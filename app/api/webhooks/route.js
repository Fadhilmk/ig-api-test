// import crypto from 'crypto';

// // VERIFY TOKEN: Set this to match what you set in the App Dashboard for the webhook
// const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
// const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;  // App Secret from the Instagram Developer Dashboard

// // Verify the incoming webhook requests
// const verifyRequest = (req, res) => {
//   const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

//   // Verification request
//   if (mode && token === VERIFY_TOKEN) {
//     console.log('Verification successful');
//     res.status(200).send(challenge);  // Respond with the hub.challenge
//   } else {
//     res.status(403).send('Forbidden');
//   }
// };

// // Validate the payload's integrity using X-Hub-Signature-256
// const validateSignature = (req) => {
//   const signature = req.headers['x-hub-signature-256'] || '';
//   const payload = JSON.stringify(req.body);

//   const expectedSignature = `sha256=${crypto
//     .createHmac('sha256', APP_SECRET)
//     .update(payload)
//     .digest('hex')}`;

//   return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
// };

// // Process incoming event notifications
// const processEventNotifications = (req, res) => {
//   const { entry, object } = req.body;

//   // Loop through each entry and process the event
//   entry.forEach((entryItem) => {
//     const { changes, id, uid, time } = entryItem;
//     console.log('Received event:', changes, id, time);

//     // You can log or store data in Firebase here, if needed
//   });

//   res.status(200).send('EVENT_RECEIVED');  // Always respond with 200 OK
// };

// export async function GET(req, res) {
//   verifyRequest(req, res);  // For the initial verification
// }

// export async function POST(req, res) {
//   if (!validateSignature(req)) {
//     res.status(403).send('Forbidden: Invalid Signature');
//     return;
//   }

//   processEventNotifications(req, res);  // Process the event notification
// }

export async function GET(req, res) {
  const { query } = req;  // Properly access the query parameters

  // Destructure the query parameters safely
  const mode = query['hub.mode'];
  const challenge = query['hub.challenge'];
  const verifyToken = query['hub.verify_token'];

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

  // Validate the verify_token
  if (mode === 'subscribe' && verifyToken === VERIFY_TOKEN) {
    // Respond with the challenge
    res.status(200).send(challenge);
  } else {
    // Respond with 403 Forbidden if the verify_token is incorrect
    res.status(403).send('Forbidden');
  }
}

export async function POST(req, res) {
  // Handle the event notifications coming from Instagram
  console.log('Webhook event received:', req.body);

  // Always respond with 200 OK to acknowledge the event
  res.status(200).send('EVENT_RECEIVED');
}
