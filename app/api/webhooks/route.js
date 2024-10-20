// import { NextResponse } from 'next/server';

// // Handle GET request for webhook verification
// export async function GET(req) {
//   // Extract query parameters from the URL
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get('hub.mode');
//   const token = searchParams.get('hub.verify_token');
//   const challenge = searchParams.get('hub.challenge');

//   // Get the VERIFY_TOKEN from environment variables
//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   // Check if the request is a subscription request
//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('Webhook verification successful.');
    
//     // Respond with the challenge token from the request
//     return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
//   } else {
//     // Log the failure and respond with a 403 Forbidden status
//     console.error('Webhook verification failed: Invalid verify token or mode.');
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const body = await req.json();  // Parse the JSON body of the request

//   console.log('Webhook event received:', body);  // Log the received event

//   // Respond with 200 OK to acknowledge receipt of the event
//   return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
// }

import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Handle GET request for webhook verification
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verification successful.');
    return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } else {
    console.error('Webhook verification failed: Invalid verify token or mode.');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

// Handle POST request for event notifications
export async function POST(req) {
  const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
  const X_HUB_SIGNATURE = req.headers.get('x-hub-signature-256');

  const body = await req.text(); // Get raw body as a string for signature verification

  // Verify that the request payload is genuine by comparing the SHA256 signature
  const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

  if (!isValid) {
    console.error('Invalid signature. Webhook payload not genuine.');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Parse the JSON body of the request (now that it's verified)
  const jsonBody = JSON.parse(body);
  console.log('Webhook event received:', jsonBody);

  // Handle event data (example: user posted a photo)
  jsonBody.entry.forEach((entry) => {
    const { id, changes, time } = entry;
    changes.forEach((change) => {
      console.log(`Change detected: ${change.field} at ${new Date(time * 1000).toLocaleString()}`);
      console.log(`Change details:`, change.value);
    });
  });

  // Respond with 200 OK to acknowledge receipt of the event
  return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
}

// Function to verify the payload signature using SHA256 and the app secret
function verifySignature(payload, hubSignature, appSecret) {
  if (!hubSignature || !hubSignature.startsWith('sha256=')) {
    return false;
  }

  const signatureHash = hubSignature.split('sha256=')[1];

  // Create a hash using the app secret and the payload
  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex');

  // Compare the hashes to ensure the payload is genuine
  return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
}
