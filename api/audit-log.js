const { sendDiscordWebhook } = require('./utils/discord');

const AUDIT_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_AUDIT || 
  'https://discord.com/api/webhooks/1530516433703014541/uxxuh3qFv5Uj-yushD-keZNIZJ1DBh-myRjQb-t-XAQAHjKXG0lIxw8hl8q9bTNC3REW';

module.exports = async function handler(req, res) {
  // CORS Headers
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
    const { action, sessionId, data = {} } = body || {};

    if (action === 'create') {
      // Session started
      if (data.businessName || data.email) {
        await sendDiscordWebhook(
          AUDIT_WEBHOOK_URL,
          {
            title: '📊 New Digital Growth Audit Started',
            color: 0x3b82f6, // Blue
            fields: [
              { name: '🏢 Business Name', value: data.businessName || 'N/A', inline: true },
              { name: '📧 Email', value: data.email || 'N/A', inline: true },
              { name: '📞 Phone', value: data.phone || 'N/A', inline: true },
              { name: '🆔 Session ID', value: `\`${sessionId}\``, inline: false }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: 'Builtium Audit Bot • Session Started' }
          },
          'Builtium Audit Bot'
        );
      }

      return res.status(200).json({ success: true, message: 'Session started notification sent.' });
    }

    if (action === 'update' && data.type === 'completion') {
      const scores = data.scores || {};
      const scoreFields = Object.entries(scores)
        .map(([k, v]) => `**${k}**: ${v}/5`)
        .join(' | ');

      const mainFields = [
        { name: '🏢 Business Name', value: data.businessName || 'N/A', inline: true },
        { name: '📧 Email', value: data.email || 'N/A', inline: true },
        { name: '📞 Phone', value: data.phone || 'N/A', inline: true },
        { name: '🏁 Final Stage Result', value: `**${data.finalResult || 'Audit Completed'}**`, inline: false },
        { name: '📈 Category Scores', value: scoreFields || 'Scores recorded', inline: false },
        { name: '💳 Paid Status', value: data.paid ? '✅ Purchased (₦500)' : '⏳ Completed (Not Purchased)', inline: true },
        { name: '🆔 Session ID', value: `\`${sessionId}\``, inline: true }
      ];

      // Format full 55 answers grouped by category section
      const sectionFields = [];
      if (Array.isArray(data.answers) && data.answers.length > 0) {
        const sectionsMap = {};
        data.answers.forEach(item => {
          const sec = item.section || 'GENERAL';
          if (!sectionsMap[sec]) sectionsMap[sec] = [];
          const ptsStr = item.points !== null && item.points !== undefined ? ` [${item.points} pts]` : '';
          sectionsMap[sec].push(`• **Q${item.qNum}** (${item.question}): ${item.answer}${ptsStr}`);
        });

        for (const [secName, qList] of Object.entries(sectionsMap)) {
          let content = qList.join('\n');
          // Truncate to Discord 1024 char field limit if necessary
          if (content.length > 1000) {
            content = content.substring(0, 990) + '\n...[truncated]';
          }
          sectionFields.push({
            name: `📋 Section: ${secName}`,
            value: content || 'No answers',
            inline: false
          });
        }
      }

      // Combine main fields and section fields
      const allFields = [...mainFields, ...sectionFields];

      // If total fields > 25 (Discord embed limit), split into 2 embeds in 1 webhook payload
      if (allFields.length > 20) {
        const embed1 = {
          title: '🎯 Digital Growth Audit Completed! (Overview & Initial Sections)',
          color: data.paid ? 0x10b981 : 0xf59e0b,
          fields: allFields.slice(0, 15),
          timestamp: new Date().toISOString(),
          footer: { text: 'Builtium Audit Bot • Report Part 1' }
        };

        const embed2 = {
          title: '📋 Full 55 Answers Breakdown (Continued)',
          color: data.paid ? 0x10b981 : 0xf59e0b,
          fields: allFields.slice(15),
          timestamp: new Date().toISOString(),
          footer: { text: 'Builtium Audit Bot • Full Answers' }
        };

        await sendDiscordWebhook(AUDIT_WEBHOOK_URL, embed1, 'Builtium Audit Bot');
        await sendDiscordWebhook(AUDIT_WEBHOOK_URL, embed2, 'Builtium Audit Bot');
      } else {
        const embed = {
          title: '🎯 Digital Growth Audit Completed!',
          color: data.paid ? 0x10b981 : 0xf59e0b,
          fields: allFields,
          timestamp: new Date().toISOString(),
          footer: { text: 'Builtium Audit Bot • Full Audit Evaluation' }
        };

        await sendDiscordWebhook(AUDIT_WEBHOOK_URL, embed, 'Builtium Audit Bot');
      }

      return res.status(200).json({ success: true, message: 'Audit completion and full 55 answers delivered to Discord.' });
    }

    return res.status(200).json({ success: true, message: 'Audit log received.' });

  } catch (error) {
    console.error('Error in audit-log function:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
