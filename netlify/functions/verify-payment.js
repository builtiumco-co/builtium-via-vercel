const https = require('https');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Helper to get Google Sheets client
async function getSheetsClient() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  
  if (!privateKey || !clientEmail) {
    throw new Error("Missing Google Service Account credentials.");
  }

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  return google.sheets({ version: 'v4', auth });
}

// Helper to verify transaction with Paystack API
function verifyPaystack(reference) {
  return new Promise((resolve, reject) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return reject(new Error("PAYSTACK_SECRET_KEY environment variable is not configured."));
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${encodeURIComponent(reference)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Helper to update Google Sheet row
async function updateSheetOnPayment(sessionId, phone, timestamp) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("GOOGLE_SHEET_ID is missing.");

  const sheets = await getSheetsClient();
  
  // Read Sheet to find row matching Session ID
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:T',
  });

  const rows = response.data.values || [];
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][4] === sessionId) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error(`Session ID ${sessionId} not found in Google Sheet.`);
  }

  // Columns:
  // D: Phone Number (index 3)
  // F: Completion Status (index 5)
  // R: Paid Unlock Status (index 17)
  // S: Payment Timestamp (index 18)
  // T: Follow-Up Segment (index 19)
  
  // Update Phone (D)
  if (phone) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!D${rowIndex}`,
      valueInputOption: 'RAW',
      resource: { values: [[phone]] },
    });
  }

  // Update Status & Payment Info (F, R, S, T)
  const updateValues = [
    ['Completed — Purchased', null, null, null, null, null, null, null, null, null, null, null, 'Purchased', timestamp, 'Scheduling — Paid']
  ]; // index 5 (F) to 19 (T) is 15 cells. Range is F to T.
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Sheet1!F${rowIndex}:T${rowIndex}`,
    valueInputOption: 'RAW',
    resource: { values: updateValues },
  });

  return rows[rowIndex - 1]; // Return matching row data (old state) for email info
}

// Send emails using Zoho SMTP
async function sendEmails(rowData, customerEmail, customerPhone, businessName, sessionId) {
  const zohoUser = process.env.ZOHO_EMAIL || 'hello@builtiumco.com';
  const zohoPass = process.env.ZOHO_PASSWORD;

  if (!zohoPass) {
    console.warn("ZOHO_PASSWORD not set. Skipping email notification triggers.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: zohoUser,
      pass: zohoPass
    }
  });

  const sheetUrl = process.env.GOOGLE_SHEET_ID 
    ? `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit` 
    : 'Google Sheet ID missing';

  // 1. Team Notification Email
  const teamMailOptions = {
    from: `"Builtium BGA Funnel" <${zohoUser}>`,
    to: 'hello@builtiumco.com',
    subject: `🚨 Paid BGA Unlock: ${businessName}`,
    html: `
      <h2>New Growth Blueprint Payment Received!</h2>
      <p>A user has successfully paid <strong>₦500</strong> to unlock their Digital Growth Blueprint.</p>
      <ul>
        <li><strong>Business Name:</strong> ${businessName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        <li><strong>Phone Number:</strong> ${customerPhone}</li>
        <li><strong>Session ID:</strong> <code>${sessionId}</code></li>
      </ul>
      <p>Please review their details in the spreadsheet to prepare for the manual strategy call.</p>
      <p><a href="${sheetUrl}" style="padding: 10px 20px; background-color: #3a7bff; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">Open Google Sheet</a></p>
    `
  };

  // 2. Customer Confirmation Email
  const customerMailOptions = {
    from: `"Builtium" <${zohoUser}>`,
    to: customerEmail,
    subject: `Your Growth Blueprint is Unlocked — ${businessName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #3a7bff; border-bottom: 2px solid #3a7bff; padding-bottom: 8px;">Your Blueprint is Ready!</h2>
        <p>Hi ${businessName} Team,</p>
        <p>Thank you for unlocking your <strong>Digital Growth Blueprint</strong>. We have successfully processed your payment of <strong>₦500</strong>.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Your full digital scorecard, Roadmap, and gap breakdown are now fully visible on your results page.</li>
          <li>Our strategy team is preparing your custom implementation report.</li>
          <li>A Builtium strategist will reach out manually via email at <strong>${customerEmail}</strong> or phone at <strong>${customerPhone}</strong> within <strong>24 hours</strong> to schedule your 15-minute walkthrough and strategy call.</li>
        </ol>
        <p>We look forward to speaking with you and helping you build your digital foundation!</p>
        <br>
        <p>Best regards,</p>
        <p><strong>The Builtium Team</strong><br><a href="https://builtiumco.com">builtiumco.com</a></p>
      </div>
    `
  };

  await Promise.all([
    transporter.sendMail(teamMailOptions),
    transporter.sendMail(customerMailOptions)
  ]);
  console.log("Transactional emails sent successfully.");
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { reference, sessionId, phone } = body;

    if (!reference || !sessionId) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required parameters: reference and sessionId.' })
      };
    }

    // Verify payment status with Paystack API
    const paystackResult = await verifyPaystack(reference);
    
    if (!paystackResult.status || paystackResult.data.status !== 'success') {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Payment verification failed. Status not successful.', details: paystackResult })
      };
    }

    const amountPaid = paystackResult.data.amount; // in kobo
    if (amountPaid < 10000) { // ₦100 = 10,000 kobo
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Incorrect payment amount verified.' })
      };
    }

    const timestamp = paystackResult.data.paid_at || new Date().toISOString();

    // Update session record in Google Sheets
    let rowData;
    try {
      rowData = await updateSheetOnPayment(sessionId, phone, timestamp);
    } catch (sheetErr) {
      console.error("Sheets update error:", sheetErr.message);
      // Still proceed since payment occurred, but log the error
    }

    // Retrieve metadata for mailing triggers
    const businessName = rowData ? rowData[1] : 'Unknown Business';
    const customerEmail = rowData ? rowData[2] : paystackResult.data.customer.email;
    const finalPhone = phone || (rowData ? rowData[3] : '');

    // Fire email notifications via SMTP
    try {
      await sendEmails(rowData, customerEmail, finalPhone, businessName, sessionId);
    } catch (emailErr) {
      console.error("Email notification error:", emailErr.message);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: 'Payment verified and database synced successfully.'
      })
    };

  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
