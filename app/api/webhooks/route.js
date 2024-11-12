// import { NextResponse } from 'next/server';
// import { db } from '../../../firebaseConfig'; // Update the path to where your firebaseConfig.js is located
// import { setDoc, doc } from 'firebase/firestore';
// import crypto from 'crypto';

// // Handle GET request for webhook verification
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get('hub.mode');
//   const token = searchParams.get('hub.verify_token');
//   const challenge = searchParams.get('hub.challenge');

//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('Webhook verification successful.');
//     return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
//   } else {
//     console.error('Webhook verification failed: Invalid verify token or mode.');
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
//   const X_HUB_SIGNATURE = req.headers.get('x-hub-signature-256');

//   const body = await req.text();
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error('Invalid signature. Webhook payload not genuine.');
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log('Webhook event received:', jsonBody);

//   try {
//     const docRef = doc(db, 'webhooks', 'unique-id'); // Generate a unique document ID as per your logic
//     await setDoc(docRef, {
//       receivedAt: new Date().toISOString(),
//       data: jsonBody, // Store the full webhook data for testing
//     });

//     console.log('Webhook event stored successfully.');
//   } catch (error) {
//     console.error('Error saving webhook event to Firestore:', error);
//   }

//   return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
// }

// // Verify the signature for security
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith('sha256=')) return false;

//   const signatureHash = hubSignature.split('sha256=')[1];
//   const expectedHash = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
//   return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
// }

// import { NextResponse } from 'next/server';
// import { db } from '../../../firebaseConfig';
// import { setDoc, doc, collection } from 'firebase/firestore';
// import crypto from 'crypto';

// // Handle GET request for webhook verification
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get('hub.mode');
//   const token = searchParams.get('hub.verify_token');
//   const challenge = searchParams.get('hub.challenge');

//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('Webhook verification successful.');
//     return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
//   } else {
//     console.error('Webhook verification failed: Invalid verify token or mode.');
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
//   const X_HUB_SIGNATURE = req.headers.get('x-hub-signature-256');

//   const body = await req.text();
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error('Invalid signature. Webhook payload not genuine.');
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log('Webhook event received:', jsonBody);

//   try {
//     // Process each entry (user event) in the webhook data
//     for (const entry of jsonBody.entry) {
//       const userId = entry.id; // This maps to YOUR_APP_USERS_IG_USER_ID
//       const timestamp = new Date().toISOString();

//       // Process each messaging event within the entry
//       if (entry.messaging) {
//         for (const messagingEvent of entry.messaging) {
//           const message = messagingEvent.message || {};
//           const senderId = messagingEvent.sender?.id;
//           const recipientId = messagingEvent.recipient?.id;

//           // Use message.mid as the unique document ID for each message
//           const messageDocId = message.mid || `${timestamp}-${Math.random()}`;
//           const messagesCollectionRef = collection(db, 'webhooks', userId, 'messages');
//           const messageDocRef = doc(messagesCollectionRef, messageDocId);

//           // Extract data from the message event for storage
//           const messageData = {
//             senderId,
//             recipientId,
//             timestamp: messagingEvent.timestamp,
//             messageId: message.mid || null,
//             text: message.text || null,
//             isDeleted: message.is_deleted || false,
//             isEcho: message.is_echo || false,
//             isUnsupported: message.is_unsupported || false,
//             attachments: message.attachments || [],
//             quickReplyPayload: message.quick_reply?.payload || null,
//             referralData: message.referral || null,
//             replyTo: message.reply_to || null,
//           };

//           // Set the document in Firestore for each message
//           await setDoc(messageDocRef, messageData);
//           console.log(`Message stored successfully for user ${userId}`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error saving webhook event to Firestore:', error);
//   }

//   return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
// }

// // Verify the signature for security
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith('sha256=')) return false;

//   const signatureHash = hubSignature.split('sha256=')[1];
//   const expectedHash = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
//   return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
// }

// import { NextResponse } from 'next/server';
// import { db } from '../../../firebaseConfig';
// import { setDoc, doc, collection } from 'firebase/firestore';
// import crypto from 'crypto';

// // Handle GET request for webhook verification
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get('hub.mode');
//   const token = searchParams.get('hub.verify_token');
//   const challenge = searchParams.get('hub.challenge');

//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('Webhook verification successful.');
//     return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
//   } else {
//     console.error('Webhook verification failed: Invalid verify token or mode.');
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
//   const X_HUB_SIGNATURE = req.headers.get('x-hub-signature-256');

//   const body = await req.text();
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error('Invalid signature. Webhook payload not genuine.');
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log('Webhook event received:', jsonBody);

//   try {
//     for (const entry of jsonBody.entry) {
//       const userId = entry.id;
//       const timestamp = new Date().toISOString();

//       if (entry.messaging) {
//         for (const messagingEvent of entry.messaging) {
//           const message = messagingEvent.message || {};
//           const senderId = messagingEvent.sender?.id;
//           const recipientId = messagingEvent.recipient?.id;
//           const messageText = message.text || '';

//           const messageDocId = message.mid || `${timestamp}-${Math.random()}`;
//           const messagesCollectionRef = collection(db, 'webhooks', userId, 'messages');
//           const messageDocRef = doc(messagesCollectionRef, messageDocId);

//           const messageData = {
//             senderId,
//             recipientId,
//             timestamp: messagingEvent.timestamp,
//             messageId: message.mid || null,
//             text: messageText,
//             isDeleted: message.is_deleted || false,
//             isEcho: message.is_echo || false,
//             isUnsupported: message.is_unsupported || false,
//             attachments: message.attachments || [],
//             quickReplyPayload: message.quick_reply?.payload || null,
//             referralData: message.referral || null,
//             replyTo: message.reply_to || null,
//           };

//           await setDoc(messageDocRef, messageData);
//           console.log(`Message stored successfully for user ${userId}`);

//           // Use absolute URL for process_messages endpoint
//           const baseUrl = 'https://igtest-sa';

//           await fetch(`${baseUrl}/api/process_messages`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               igUserId: userId,
//               igScopedId: senderId,
//               receivedText: messageText,
//               accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
//             }),
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error saving webhook event to Firestore:', error);
//   }

//   return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
// }

// // Verify the signature for security
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith('sha256=')) return false;

//   const signatureHash = hubSignature.split('sha256=')[1];
//   const expectedHash = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
//   return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
// }

// import { NextResponse } from "next/server";
// import { db } from "../../../firebaseConfig";
// import { setDoc, doc, collection, getDoc } from "firebase/firestore";
// import crypto from "crypto";

// // Handle GET request for webhook verification
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   if (mode === "subscribe" && token === VERIFY_TOKEN) {
//     console.log("Webhook verification successful.");
//     return new NextResponse(challenge, {
//       status: 200,
//       headers: { "Content-Type": "text/plain" },
//     });
//   } else {
//     console.error("Webhook verification failed: Invalid verify token or mode.");
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
//   const X_HUB_SIGNATURE = req.headers.get("x-hub-signature-256");

//   const body = await req.text();
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error("Invalid signature. Webhook payload not genuine.");
//     return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log("Webhook event received:", jsonBody);

//   try {
//     const docRef = doc(db, "webhooks", "unique-id"); // Generate a unique document ID as per your logic
//     await setDoc(docRef, {
//       receivedAt: new Date().toISOString(),
//       data: jsonBody, // Store the full webhook data for testing
//     });

//     console.log("Webhook event stored successfully.");
//   } catch (error) {
//     console.error("Error saving webhook event to Firestore:", error);
//   }

//   try {
//     // Process each entry (user event) in the webhook data
//     for (const entry of jsonBody.entry) {
//       const userId = entry.id; // This maps to YOUR_APP_USERS_IG_USER_ID

//       if (entry.messaging) {
//         for (const messagingEvent of entry.messaging) {
//           const message = messagingEvent.message || {};
//           const senderId = messagingEvent.sender?.id;

//           // Check if the message is a self-generated message or lacks content
//           if (message.is_echo || !message.text) {
//             console.log("Skipping self-message or empty message.");
//             continue;
//           }

//           // Check if the message ID has already been processed
//           const messageDocId = message.mid;
//           const messageDocRef = doc(
//             db,
//             "webhooks",
//             userId,
//             "messages",
//             messageDocId
//           );
//           const messageSnapshot = await getDoc(messageDocRef);

//           if (messageSnapshot.exists()) {
//             console.log(`Message ${messageDocId} already processed. Skipping.`);
//             continue;
//           }

//           // Store the message details in Firestore
//           await setDoc(messageDocRef, {
//             senderId,
//             messageId: message.mid,
//             text: message.text,
//             timestamp: messagingEvent.timestamp,
//           });

//           console.log(`Message stored successfully for user ${userId}`);

//           // Send data to /api/process_messages for reply (only once per unique message)
//           const baseUrl = "https://igtest-sage.vercel.app";
//           await fetch(`${baseUrl}/api/process_messages`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               igUserId: userId,
//               igScopedId: senderId,
//               receivedText: message.text,
//               accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
//             }),
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error saving webhook event to Firestore:", error);
//   }

//   return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
// }

// // Verify the signature for security
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;

//   const signatureHash = hubSignature.split("sha256=")[1];
//   const expectedHash = crypto
//     .createHmac("sha256", appSecret)
//     .update(payload)
//     .digest("hex");
//   return crypto.timingSafeEqual(
//     Buffer.from(signatureHash),
//     Buffer.from(expectedHash)
//   );
// }


import { NextResponse } from "next/server";
import { db } from "../../../firebaseConfig";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import crypto from "crypto";

// Handle GET request for webhook verification
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verification successful.");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } else {
    console.error("Webhook verification failed: Invalid verify token or mode.");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

// Handle POST request for event notifications
export async function POST(req) {
  const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
  const X_HUB_SIGNATURE = req.headers.get("x-hub-signature-256");

  const body = await req.text();
  const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

  if (!isValid) {
    console.error("Invalid signature. Webhook payload not genuine.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const jsonBody = JSON.parse(body);
  console.log("Webhook event received:", jsonBody);

  try {
    const docRef = doc(db, "webhooks", "unique-id"); // Generate a unique document ID as per your logic
    await setDoc(docRef, {
      receivedAt: new Date().toISOString(),
      data: jsonBody, // Store the full webhook data for testing
    });

    console.log("Webhook event stored successfully.");
  } catch (error) {
    console.error("Error saving webhook event to Firestore:", error);
  }

  try {
    // Process each entry (user event) in the webhook data
    for (const entry of jsonBody.entry) {
      const userId = entry.id; // This maps to YOUR_APP_USERS_IG_USER_ID

      if (entry.messaging) {
        for (const messagingEvent of entry.messaging) {
          const message = messagingEvent.message || {};
          const senderId = messagingEvent.sender?.id;

          // Check if the message is a self-generated message or lacks content
          if (message.is_echo || !message.text) {
            console.log("Skipping self-message or empty message.");
            continue;
          }

          // Check if the message ID has already been processed
          const messageDocId = message.mid;
          const messageDocRef = doc(
            db,
            "webhooks",
            userId,
            "messages",
            messageDocId
          );
          const messageSnapshot = await getDoc(messageDocRef);

          if (messageSnapshot.exists()) {
            console.log(`Message ${messageDocId} already processed. Skipping.`);
            continue;
          }

          // Store the message details in Firestore
          await setDoc(messageDocRef, {
            senderId,
            messageId: message.mid,
            text: message.text,
            timestamp: messagingEvent.timestamp,
          });

          console.log(`Message stored successfully for user ${userId}`);

          // Send data to /api/process_messages for reply (only once per unique message)
          const baseUrl = "https://igtest-sage.vercel.app";
          await fetch(`${baseUrl}/api/process_messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              igUserId: userId,
              igScopedId: senderId,
              receivedText: message.text,
              accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
            }),
          });
        }
      }

      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            const commentData = change.value;
            const { id: commentId, text, from, media, time } = commentData;

            // Firestore structure:
            // webhooks -> userId (doc) -> comments (collection) -> mediaId (doc)
            const commentsCollectionRef = collection(db, 'webhooks', userId, 'comments');
            const commentDocRef = doc(commentsCollectionRef, media.id);

            // Save comment details in Firestore
            await setDoc(commentDocRef, {
              commentId,
              text,
              from: {
                id: from.id,
                username: from.username,
              },
              media: {
                id: media.id,
                type: media.media_product_type,
              }
            });

            console.log(`Comment stored successfully for user ${userId} on media ${media.id}`);

            // Call the process_comments endpoint once per new comment
            const baseUrl = 'https://igtest-sage.vercel.app';
            await fetch(`${baseUrl}/api/process_comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                igUserId: userId,
                mediaId: media.id,
                commentId: commentId,
                text: text,
                fromId:from.id,
                username: from.username,
                accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
              }),
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving webhook event to Firestore:", error);
  }

  return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
}

// Verify the signature for security
function verifySignature(payload, hubSignature, appSecret) {
  if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;

  const signatureHash = hubSignature.split("sha256=")[1];
  const expectedHash = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signatureHash),
    Buffer.from(expectedHash)
  );
}
