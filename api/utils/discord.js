/**
 * Helper to post rich Embed messages to Discord Webhooks via Node.js HTTPS request or fetch API.
 */
const https = require('https');
const { URL } = require('url');

async function sendDiscordWebhook(webhookUrl, embedPayload, username = 'Builtium Bot', avatarUrl = '') {
  if (!webhookUrl) {
    console.warn('[Discord Webhook] No webhook URL specified. Skipping notification.');
    return false;
  }

  const payload = {
    username: username,
    avatar_url: avatarUrl || 'https://builtiumco.com/images/favicon.png',
    embeds: [embedPayload]
  };

  const dataString = JSON.stringify(payload);
  const parsedUrl = new URL(webhookUrl);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          console.error(`[Discord Webhook] Failed with status ${res.statusCode}: ${responseBody}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[Discord Webhook] Request error:', err);
      resolve(false);
    });

    req.write(dataString);
    req.end();
  });
}

module.exports = {
  sendDiscordWebhook
};
