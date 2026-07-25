const { sendDiscordWebhook } = require('./utils/discord');

const CONTACT_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_CONTACT || 
  'https://discord.com/api/webhooks/1530592773944901714/fhqkJghGzZsB2Xgr9iYtr5MxxqUDVUlu9bPjtB_d4ResbrAcg_mkwFZAgFiEMW3l62y-';

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
    const { name, email, phone, subject, message } = body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const timestamp = new Date().toISOString();

    const embed = {
      title: '📬 New Website Contact Form Message',
      color: 0x06b6d4, // Cyan
      fields: [
        { name: '👤 Sender Name', value: name, inline: true },
        { name: '📧 Email Address', value: email, inline: true },
        { name: '📞 Phone / WhatsApp', value: phone || 'N/A', inline: true },
        { name: '📌 Subject / Interested In', value: subject || 'General Inquiry', inline: false },
        { name: '💬 Message', value: message || 'No message content provided.', inline: false }
      ],
      timestamp: timestamp,
      footer: { text: 'Contact Bot • Homepage Contact Form' }
    };

    await sendDiscordWebhook(CONTACT_WEBHOOK_URL, embed, 'Contact Bot');

    return res.status(200).json({ success: true, message: 'Contact message received.' });

  } catch (error) {
    console.error('contact-submit error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
