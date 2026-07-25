const https = require('https');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // nodemailer optional
}
const { sendDiscordWebhook } = require('./utils/discord');

const PAYMENTS_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_PAYMENTS || 
  'https://discord.com/api/webhooks/1530516984024793120/OdSEQHJySkKH_gLk8ukZ4aqcM8U7kFezOvmVvnhXY59ICCGxB53TcfjPTLBZeCHwRTTM';

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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

// Optional Zoho SMTP email helper
async function sendEmailNotifications(customerEmail, customerPhone, businessName, sessionId, reference, amountFormatted) {
  if (!nodemailer) return;
  const zohoUser = process.env.ZOHO_EMAIL || 'hello@builtiumco.com';
  const zohoPass = process.env.ZOHO_PASSWORD;

  if (!zohoPass) return;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: zohoUser, pass: zohoPass }
  });

  const teamMailOptions = {
    from: `"Builtium Payments" <${zohoUser}>`,
    to: 'hello@builtiumco.com',
    subject: `🚨 Paid BGA Unlock: ${businessName || customerEmail}`,
    html: `
      <h2>New Growth Blueprint Payment Received!</h2>
      <p>A user has successfully paid <strong>${amountFormatted}</strong> to unlock their Digital Growth Blueprint.</p>
      <ul>
        <li><strong>Business Name:</strong> ${businessName || 'N/A'}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        <li><strong>Phone Number:</strong> ${customerPhone || 'N/A'}</li>
        <li><strong>Reference:</strong> <code>${reference}</code></li>
        <li><strong>Session ID:</strong> <code>${sessionId}</code></li>
      </ul>
    `
  };

  const customerMailOptions = {
    from: `"Builtium" <${zohoUser}>`,
    to: customerEmail,
    subject: `Your Growth Blueprint is Unlocked — Builtium`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #3a7bff; border-bottom: 2px solid #3a7bff; padding-bottom: 8px;">Your Blueprint is Ready!</h2>
        <p>Thank you for unlocking your <strong>Digital Growth Blueprint</strong>. We have successfully processed your payment of <strong>${amountFormatted}</strong>.</p>
        <p>Our strategy team will reach out via email (<strong>${customerEmail}</strong>) or phone within <strong>24 hours</strong> to walk you through your custom blueprint implementation.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>The Builtium Team</strong><br><a href="https://builtiumco.com">builtiumco.com</a></p>
      </div>
    `
  };

  await Promise.all([
    transporter.sendMail(teamMailOptions).catch(err => console.warn('Team email error:', err.message)),
    transporter.sendMail(customerMailOptions).catch(err => console.warn('Customer email error:', err.message))
  ]);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { reference, sessionId, phone, businessName, email } = body || {};

    if (!reference) {
      return res.status(400).json({ error: 'Missing required parameter: reference.' });
    }

    // Verify payment status with Paystack API
    const paystackResult = await verifyPaystack(reference);
    
    if (!paystackResult.status || paystackResult.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment verification failed.', details: paystackResult });
    }

    const amountPaid = paystackResult.data.amount; // in kobo
    const amountNaira = (amountPaid / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    const customerEmail = email || paystackResult.data.customer.email;
    const customerPhone = phone || (paystackResult.data.customer.phone || 'N/A');
    const bName = businessName || 'Builtium Client';
    const timestamp = paystackResult.data.paid_at || new Date().toISOString();

    // 1. Send Discord Webhook alert to Builtium Payments Bot
    const embed = {
      title: '💳 Payment Verified — Paid Unlock Received!',
      color: 0x10b981, // Emerald Green
      fields: [
        { name: '🏢 Business / Client', value: bName, inline: true },
        { name: '💰 Amount Paid', value: `**${amountNaira}**`, inline: true },
        { name: '📧 Customer Email', value: customerEmail, inline: true },
        { name: '📞 Phone Number', value: customerPhone, inline: true },
        { name: '🔑 Paystack Reference', value: `\`${reference}\``, inline: true },
        { name: '🆔 Session ID', value: `\`${sessionId || 'N/A'}\``, inline: true }
      ],
      timestamp: timestamp,
      footer: { text: 'Builtium Payments Bot • Transaction Verified' }
    };

    await sendDiscordWebhook(PAYMENTS_WEBHOOK_URL, embed, 'Builtium Payments Bot');

    // 2. Fire optional email notifications
    sendEmailNotifications(customerEmail, customerPhone, bName, sessionId, reference, amountNaira)
      .catch(err => console.warn('Email trigger warning:', err.message));

    return res.status(200).json({
      success: true,
      message: 'Payment verified and notification sent successfully.'
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
