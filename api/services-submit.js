const { sendDiscordWebhook } = require('./utils/discord');
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // nodemailer optional
}

const SERVICE_LAUNCH_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_SERVICE_LAUNCH || 
  'https://discord.com/api/webhooks/1530591993779064923/STIRJWmSDcQrm64-8so8Eu5IYNSLvwNCVNoIjZ72yPsRUJJ3uB8hRpGeAwSnT9ifTowz';

const SERVICE_CUSTOM_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_SERVICE_CUSTOM || 
  'https://discord.com/api/webhooks/1530592596215333054/yplqrGmYAQl1RryUp3Fc7Nv6ygP0-tzeDxiTqp9TIQIe27MI9Hsw_yJ6td_TWkeJUymw';

// Optional Zoho SMTP email helper
async function sendNotificationEmail(subject, htmlBody) {
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

  await transporter.sendMail({
    from: `"Builtium Studio" <${zohoUser}>`,
    to: 'hello@builtiumco.com',
    subject,
    html: htmlBody
  }).catch(err => console.warn('Services email error:', err.message));
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
    const { formType } = body || {};

    if (!formType || !['launch', 'custom'].includes(formType)) {
      return res.status(400).json({ error: 'formType must be "launch" or "custom".' });
    }

    const requiredFields = ['businessName', 'contactName', 'email', 'phone'];
    for (const f of requiredFields) {
      if (!body[f] || !body[f].trim()) {
        return res.status(400).json({ error: `Missing required field: ${f}` });
      }
    }

    const timestamp = new Date().toISOString();

    if (formType === 'launch') {
      // 🚀 Service Launch Bot Notification
      const embed = {
        title: '🚀 New Launch Project Brief Submitted!',
        color: 0x8b5cf6, // Violet
        fields: [
          { name: '🏢 Business Name', value: body.businessName, inline: true },
          { name: '👤 Contact Name', value: body.contactName, inline: true },
          { name: '📧 Email', value: body.email, inline: true },
          { name: '📞 Phone / WhatsApp', value: body.phone, inline: true },
          { name: '🏭 Industry', value: body.industry || 'N/A', inline: true },
          { name: '📝 Business Description', value: body.businessDescription || 'N/A', inline: false },
          { name: '🎯 Website Goals', value: body.websiteGoals || 'N/A', inline: false },
          { name: '🎨 Brand Assets', value: body.brandAssets || 'N/A', inline: true },
          { name: '📄 Preferred Pages', value: body.preferredPages || 'N/A', inline: true },
          { name: '⚙️ Preferred Features', value: body.preferredFeatures || 'N/A', inline: false },
          { name: '💡 Inspiration Websites', value: body.inspirationWebsites || 'N/A', inline: false },
          { name: '📌 Additional Notes', value: body.additionalNotes || 'N/A', inline: false }
        ],
        timestamp: timestamp,
        footer: { text: 'Service Launch Bot • Launch Brief' }
      };

      await sendDiscordWebhook(SERVICE_LAUNCH_WEBHOOK_URL, embed, 'Service Launch Bot');

      // Send optional email
      sendNotificationEmail(
        `New Launch Project Brief — ${body.businessName}`,
        `<p>New Launch Project Brief from <strong>${body.businessName}</strong> (${body.email}, ${body.phone}).</p>`
      ).catch(err => console.warn(err));

      return res.status(200).json({ success: true, message: 'Launch brief submitted successfully.' });
    }

    if (formType === 'custom') {
      // 🛠 Service Custom Bot Notification
      const embed = {
        title: '🛠 New Custom Solution Request Received!',
        color: 0xec4899, // Pink
        fields: [
          { name: '🏢 Business Name', value: body.businessName, inline: true },
          { name: '👤 Contact Name', value: body.contactName, inline: true },
          { name: '📧 Email', value: body.email, inline: true },
          { name: '📞 Phone', value: body.phone, inline: true },
          { name: '🏭 Industry', value: body.industry || 'N/A', inline: true },
          { name: '📍 Location', value: body.businessLocation || 'N/A', inline: true },
          { name: '🌐 Existing Website', value: body.existingWebsite || 'None', inline: true },
          { name: '💵 Budget Range', value: `**${body.budgetRange || 'N/A'}**`, inline: true },
          { name: '⏱️ Timeline', value: body.timeline || 'N/A', inline: true },
          { name: '🛠 Services Required', value: body.servicesRequired || 'N/A', inline: false },
          { name: '🎯 Business Goals', value: body.businessGoals || 'N/A', inline: false },
          { name: '💡 Additional Information', value: body.additionalInformation || 'N/A', inline: false }
        ],
        timestamp: timestamp,
        footer: { text: 'Service Custom Bot • Custom Solution Request' }
      };

      await sendDiscordWebhook(SERVICE_CUSTOM_WEBHOOK_URL, embed, 'Service Custom Bot');

      sendNotificationEmail(
        `New Custom Solution Request — ${body.businessName}`,
        `<p>New Custom Solution Request from <strong>${body.businessName}</strong> (${body.email}, ${body.phone}). Budget: ${body.budgetRange || 'N/A'}</p>`
      ).catch(err => console.warn(err));

      return res.status(200).json({ success: true, message: 'Custom solution request submitted successfully.' });
    }

  } catch (error) {
    console.error('services-submit error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
