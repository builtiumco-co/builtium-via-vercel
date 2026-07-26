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

    if (action === 'update' || action === 'completion' || data.type === 'completion') {
      const scores = data.scores || {};
      const scoreFields = Object.entries(scores)
        .map(([k, v]) => `**${k}**: ${v}/5`)
        .join(' | ');

      const overviewFields = [
        { name: '🏢 Business Name', value: data.businessName || 'N/A', inline: true },
        { name: '📧 Email', value: data.email || 'N/A', inline: true },
        { name: '📞 Phone', value: data.phone || 'N/A', inline: true },
        { name: '🏁 Final Stage Result', value: `**${data.finalResult || 'Audit Completed'}**`, inline: false },
        { name: '📈 Category Scores', value: scoreFields || 'Scores recorded', inline: false },
        { name: '💳 Paid Status', value: data.paid ? '✅ Purchased (₦500)' : '⏳ Completed (Not Purchased)', inline: true },
        { name: '🆔 Session ID', value: `\`${sessionId || 'N/A'}\``, inline: true }
      ];

      // Format 55 answers into requested template grouped by section
      const sectionFields = [];
      if (Array.isArray(data.answers) && data.answers.length > 0) {
        const sectionsMap = {};
        data.answers.forEach(item => {
          const sec = (item.section || 'GENERAL').toUpperCase();
          if (!sectionsMap[sec]) sectionsMap[sec] = [];
          
          const qText = item.question ? `Q${item.qNum}: ${item.question}` : `Q${item.qNum}`;
          const aText = `Answer: ${item.answer || 'Not answered'}`;
          sectionsMap[sec].push(`${qText}\n${aText}`);
        });

        // Convert grouped questions into Discord embed fields per section
        for (const [secName, qList] of Object.entries(sectionsMap)) {
          const count = qList.length;
          const sectionTitle = `📋 ${secName} (${count} question${count === 1 ? '' : 's'})`;
          
          let currentChunk = [];
          let currentLen = 0;
          let partIdx = 1;

          qList.forEach(itemStr => {
            if (currentLen + itemStr.length + 2 > 980) {
              sectionFields.push({
                name: `${sectionTitle}${partIdx > 1 ? ` (Part ${partIdx})` : ''}`,
                value: currentChunk.join('\n\n'),
                inline: false
              });
              partIdx++;
              currentChunk = [itemStr];
              currentLen = itemStr.length;
            } else {
              currentChunk.push(itemStr);
              currentLen += itemStr.length + 2;
            }
          });

          if (currentChunk.length > 0) {
            sectionFields.push({
              name: `${sectionTitle}${partIdx > 1 ? ` (Part ${partIdx})` : ''}`,
              value: currentChunk.join('\n\n'),
              inline: false
            });
          }
        }
      }

      // Deliver via Discord Webhook embeds
      // Embed 1: Overview & Initial Sections (Up to 10 fields)
      const embed1 = {
        title: '🎯 Digital Growth Audit Completed! (Overview & Initial Sections)',
        color: data.paid ? 0x10b981 : 0xf59e0b,
        fields: [...overviewFields, ...sectionFields.slice(0, 8)],
        timestamp: new Date().toISOString(),
        footer: { text: 'Builtium Audit Bot • Audit Overview' }
      };

      await sendDiscordWebhook(AUDIT_WEBHOOK_URL, embed1, 'Builtium Audit Bot');

      // Embed 2: Remaining Sections if any (Up to 25 fields per embed)
      if (sectionFields.length > 8) {
        const remainingFields = sectionFields.slice(8);
        // Chunk remaining fields into sets of 20 fields per embed
        for (let i = 0; i < remainingFields.length; i += 20) {
          const chunk = remainingFields.slice(i, i + 20);
          const embedSub = {
            title: `📋 Audit Answers Breakdown (Part ${Math.floor(i / 20) + 2})`,
            color: data.paid ? 0x10b981 : 0xf59e0b,
            fields: chunk,
            timestamp: new Date().toISOString(),
            footer: { text: 'Builtium Audit Bot • Full 55 Answers' }
          };
          await sendDiscordWebhook(AUDIT_WEBHOOK_URL, embedSub, 'Builtium Audit Bot');
        }
      }

      return res.status(200).json({ success: true, message: 'Audit completion and full 55 answers delivered to Discord.' });
    }

    return res.status(200).json({ success: true, message: 'Audit log received.' });

  } catch (error) {
    console.error('Error in audit-log function:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
