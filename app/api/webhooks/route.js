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

// import { NextResponse } from 'next/server';
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

//   const body = await req.text(); // Get raw body as a string for signature verification

//   // Verify that the request payload is genuine by comparing the SHA256 signature
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error('Invalid signature. Webhook payload not genuine.');
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//   }

//   // Parse the JSON body of the request (now that it's verified)
//   const jsonBody = JSON.parse(body);
//   console.log('Webhook event received:', jsonBody);

//   // Handle event data (example: user posted a photo)
//   jsonBody.entry.forEach((entry) => {
//     const { id, changes, time } = entry;
//     changes.forEach((change) => {
//       console.log(`Change detected: ${change.field} at ${new Date(time * 1000).toLocaleString()}`);
//       console.log(`Change details:`, change.value);
//     });
//   });

//   // Respond with 200 OK to acknowledge receipt of the event
//   return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
// }

// // Function to verify the payload signature using SHA256 and the app secret
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith('sha256=')) {
//     return false;
//   }

//   const signatureHash = hubSignature.split('sha256=')[1];

//   // Create a hash using the app secret and the payload
//   const expectedHash = crypto
//     .createHmac('sha256', appSecret)
//     .update(payload)
//     .digest('hex');

//   // Compare the hashes to ensure the payload is genuine
//   return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
// }


// import { NextResponse } from 'next/server';
// import { db } from '../../../firebaseConfig'; // Firebase configuration
// import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
// import { writeBatch } from 'firebase/firestore';
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

//   const body = await req.text(); // Get raw body for signature verification
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error('Invalid signature. Webhook payload not genuine.');
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//   }

//   // Parse the JSON body of the request
//   const jsonBody = JSON.parse(body);
//   console.log('Webhook event received:', jsonBody);

//   // Handle the event notification and categorize it
//   for (const entry of jsonBody.entry) {
//     const userId = entry.id;  // Instagram User ID
//     const changes = entry.messaging || entry.changes;

//     // Process each change (message, reaction, etc.)
//     for (const change of changes) {
//       const { sender, recipient, timestamp } = change;

//       // Define the Firebase document path for the user
//       const userDocRef = doc(db, 'users', userId);
//       const notificationsCollection = collection(userDocRef, 'notifications');

//       // Check what kind of notification it is
//       if (change.message) {
//         await handleMessage(change.message, userId, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.reaction) {
//         await handleReaction(change.reaction, userId, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.postback) {
//         await handlePostback(change.postback, userId, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.referral) {
//         await handleReferral(change.referral, userId, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.read) {
//         await handleSeen(change.read, userId, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.comment) {
//         await handleCommentUpdate(change.comment, userId, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.media) {
//         await handleMediaUpdate(change.media, userId, notificationsCollection, sender, recipient, timestamp);
//       }
//     }
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

// // Handle incoming message event
// async function handleMessage(message, userId, notificationsCollection, sender, recipient, timestamp) {
//   const messageData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: message.mid,
//     text: message.text || null,
//     isDeleted: message.is_deleted || false,
//     isEcho: message.is_echo || false,
//     isUnsupported: message.is_unsupported || false,
//     attachments: message.attachments || [],
//     quickReply: message.quick_reply ? message.quick_reply.payload : null,
//     referral: message.referral ? message.referral : null,
//     replyTo: message.reply_to || null,
//   };

//   console.log('Message Data:', messageData); // Log the payload before writing

//   // Save to Firebase under the "messages" document
//   await addDoc(notificationsCollection, {
//     type: 'message',
//     data: messageData,
//     timestamp: new Date(timestamp)
//   });
// }


// // Handle incoming reaction event
// async function handleReaction(reaction, userId, notificationsCollection, sender, recipient, timestamp) {
//   const reactionData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: reaction.mid,
//     action: reaction.action,
//     reaction: reaction.reaction || null,
//     emoji: reaction.emoji || null
//   };

//   // Save to Firebase under the "reactions" document
//   await addDoc(notificationsCollection, {
//     type: 'reaction',
//     data: reactionData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle postback events
// async function handlePostback(postback, userId, notificationsCollection, sender, recipient, timestamp) {
//   const postbackData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: postback.mid,
//     title: postback.title,
//     payload: postback.payload
//   };

//   // Save to Firebase under the "postbacks" document
//   await addDoc(notificationsCollection, {
//     type: 'postback',
//     data: postbackData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle referral events
// async function handleReferral(referral, userId, notificationsCollection, sender, recipient, timestamp) {
//   const referralData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     ref: referral.ref,
//     source: referral.source,
//     type: referral.type
//   };

//   // Save to Firebase under the "referrals" document
//   await addDoc(notificationsCollection, {
//     type: 'referral',
//     data: referralData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle "seen" events
// async function handleSeen(read, userId, notificationsCollection, sender, recipient, timestamp) {
//   const seenData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: read.mid
//   };

//   // Save to Firebase under the "seen" document
//   await addDoc(notificationsCollection, {
//     type: 'seen',
//     data: seenData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle comment updates
// async function handleCommentUpdate(comment, userId, notificationsCollection, sender, recipient, timestamp) {
//   const commentData = {
//     senderId: comment.from.id,
//     senderUsername: comment.from.username,
//     mediaId: comment.media.id,
//     mediaType: comment.media.media_product_type || 'unknown',
//     commentId: comment.id,
//     text: comment.text || null,
//   };

//   // Save to Firebase under the "comments" document
//   await addDoc(notificationsCollection, {
//     type: 'comment_update',
//     data: commentData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle media updates
// async function handleMediaUpdate(media, userId, notificationsCollection, sender, recipient, timestamp) {
//   const mediaData = {
//     mediaId: media.id,
//     mediaType: media.media_product_type || 'unknown', // Type of media, e.g., 'FEED'
//     timestamp: new Date(), // Current timestamp
//   };

//   // Save to Firebase under the "media_updates" document
//   await addDoc(notificationsCollection, {
//     type: 'media_update',
//     data: mediaData,
//     timestamp: new Date(timestamp)
//   });
// }

// import { NextResponse } from 'next/server';
// import { db } from '../../../firebaseConfig'; // Firebase configuration
// import { doc, collection, addDoc, writeBatch } from 'firebase/firestore';
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

//   const body = await req.text(); // Get raw body for signature verification
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error('Invalid signature. Webhook payload not genuine.');
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//   }

//   // Parse the JSON body of the request
//   const jsonBody = JSON.parse(body);
//   console.log('Webhook event received:', jsonBody);

//   // Handle the event notification and categorize it
//   for (const entry of jsonBody.entry) {
//     const userId = entry.id;  // Instagram User ID
//     const changes = entry.messaging || entry.changes;

//     // Check for valid changes
//     if (!changes || changes.length === 0) {
//       console.warn('No changes or messaging events found.');
//       continue;
//     }

//     const userDocRef = doc(db, 'users', userId);
//     const notificationsCollection = collection(userDocRef, 'notifications');

//     // Use batch to handle multiple changes in one transaction
//     const batch = writeBatch(db);

//     for (const change of changes) {
//       const { sender = {}, recipient = {}, timestamp = Date.now() } = change;

//       // Check what kind of notification it is
//       if (change.message) {
//         handleMessage(change.message, batch, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.reaction) {
//         handleReaction(change.reaction, batch, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.postback) {
//         handlePostback(change.postback, batch, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.referral) {
//         handleReferral(change.referral, batch, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.read) {
//         handleSeen(change.read, batch, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.comment) {
//         handleCommentUpdate(change.comment, batch, notificationsCollection, sender, recipient, timestamp);
//       } else if (change.media) {
//         handleMediaUpdate(change.media, batch, notificationsCollection, sender, recipient, timestamp);
//       }
//     }

//     // Commit the batch write to Firestore
//     try {
//       await batch.commit();
//       console.log('Batch write successful.');
//     } catch (error) {
//       console.error('Error during batch write:', error);
//     }
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

// // Handle incoming message event
// function handleMessage(message, batch, notificationsCollection, sender, recipient, timestamp) {
//   const messageData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: message.mid,
//     text: message.text || null,
//     isDeleted: message.is_deleted || false,
//     isEcho: message.is_echo || false,
//     isUnsupported: message.is_unsupported || false,
//     attachments: message.attachments || [],
//     quickReply: message.quick_reply ? message.quick_reply.payload : null,
//     referral: message.referral ? message.referral : null,
//     replyTo: message.reply_to || null,
//   };

//   console.log('Message Data:', messageData);

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'message',
//     data: messageData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle incoming reaction event
// function handleReaction(reaction, batch, notificationsCollection, sender, recipient, timestamp) {
//   const reactionData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: reaction.mid,
//     action: reaction.action,
//     reaction: reaction.reaction || null,
//     emoji: reaction.emoji || null
//   };

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'reaction',
//     data: reactionData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle postback events
// function handlePostback(postback, batch, notificationsCollection, sender, recipient, timestamp) {
//   const postbackData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: postback.mid,
//     title: postback.title,
//     payload: postback.payload
//   };

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'postback',
//     data: postbackData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle referral events
// function handleReferral(referral, batch, notificationsCollection, sender, recipient, timestamp) {
//   const referralData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     ref: referral.ref,
//     source: referral.source,
//     type: referral.type
//   };

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'referral',
//     data: referralData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle "seen" events
// function handleSeen(read, batch, notificationsCollection, sender, recipient, timestamp) {
//   const seenData = {
//     senderId: sender.id,
//     recipientId: recipient.id,
//     timestamp,
//     messageId: read.mid
//   };

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'seen',
//     data: seenData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle comment updates
// function handleCommentUpdate(comment, batch, notificationsCollection, sender, recipient, timestamp) {
//   const commentData = {
//     senderId: comment.from.id,
//     senderUsername: comment.from.username,
//     mediaId: comment.media.id,
//     mediaType: comment.media.media_product_type || 'unknown',
//     commentId: comment.id,
//     text: comment.text || null,
//   };

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'comment_update',
//     data: commentData,
//     timestamp: new Date(timestamp)
//   });
// }

// // Handle media updates
// function handleMediaUpdate(media, batch, notificationsCollection, sender, recipient, timestamp) {
//   const mediaData = {
//     mediaId: media.id,
//     mediaType: media.media_product_type || 'unknown', // Type of media, e.g., 'FEED'
//     timestamp: new Date(), // Current timestamp
//   };

//   const docRef = doc(notificationsCollection);
//   batch.set(docRef, {
//     type: 'media_update',
//     data: mediaData,
//     timestamp: new Date(timestamp)
//   });
// }

import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig'; // Firebase configuration
import { doc, collection, writeBatch } from 'firebase/firestore';
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

  const body = await req.text(); // Get raw body for signature verification
  const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

  if (!isValid) {
    console.error('Invalid signature. Webhook payload not genuine.');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Parse the JSON body of the request
  const jsonBody = JSON.parse(body);
  console.log('Webhook event received:', jsonBody);

  // Handle the event notification and categorize it
  for (const entry of jsonBody.entry) {
    const userId = entry.id;  // Instagram User ID
    const changes = entry.messaging || entry.changes;

    // Check for valid changes
    if (!changes || changes.length === 0) {
      console.warn('No changes or messaging events found.');
      continue;
    }

    const userDocRef = doc(db, 'users', userId);
    const notificationsCollection = collection(userDocRef, 'notifications');

    // Use batch to handle multiple changes in one transaction
    const batch = writeBatch(db);

    for (const change of changes) {
      const { sender = {}, recipient = {}, timestamp = Date.now() } = change;

      // Process the notification based on its type
      if (change.message) {
        await handleMessage(change.message, batch, notificationsCollection, sender, recipient, timestamp);
      } else if (change.reaction) {
        await handleReaction(change.reaction, batch, notificationsCollection, sender, recipient, timestamp);
      } else if (change.postback) {
        await handlePostback(change.postback, batch, notificationsCollection, sender, recipient, timestamp);
      } else if (change.referral) {
        await handleReferral(change.referral, batch, notificationsCollection, sender, recipient, timestamp);
      } else if (change.read) {
        await handleSeen(change.read, batch, notificationsCollection, sender, recipient, timestamp);
      } else if (change.comment) {
        await handleCommentUpdate(change.comment, batch, notificationsCollection, sender, recipient, timestamp);
      } else if (change.media) {
        await handleMediaUpdate(change.media, batch, notificationsCollection, sender, recipient, timestamp);
      } else {
        console.warn("Unknown change type received. Saving full change object.");
        const unknownData = { ...change };
        const docRef = doc(notificationsCollection);
        batch.set(docRef, {
          type: 'unknown',
          data: unknownData,
          timestamp: new Date(timestamp)
        });
      }
    }

    // Commit the batch write to Firestore
    try {
      await batch.commit();
      console.log('Batch write successful.');
    } catch (error) {
      console.error('Error during batch write:', error);
    }
  }

  return NextResponse.json({ message: 'EVENT_RECEIVED' }, { status: 200 });
}

// Verify the signature for security
function verifySignature(payload, hubSignature, appSecret) {
  if (!hubSignature || !hubSignature.startsWith('sha256=')) return false;

  const signatureHash = hubSignature.split('sha256=')[1];
  const expectedHash = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
}

// Handle incoming message event
async function handleMessage(message, batch, notificationsCollection, sender, recipient, timestamp) {
  const messageData = {
    senderId: sanitizeField(sender.id),
    recipientId: sanitizeField(recipient.id),
    timestamp: new Date(timestamp),
    messageId: sanitizeField(message.mid),
    text: message.text || null,
    isDeleted: message.is_deleted || false,
    isEcho: message.is_echo || false,
    isUnsupported: message.is_unsupported || false,
    attachments: message.attachments || [],
    quickReply: message.quick_reply ? message.quick_reply.payload : null,
    referral: message.referral || null,
    replyTo: message.reply_to || null,
  };

  console.log('Message Data:', messageData);

  const docRef = doc(notificationsCollection);
  batch.set(docRef, {
    type: 'message',
    data: messageData,
    timestamp: new Date(timestamp)
  });
}

// Handle incoming reaction event
async function handleReaction(reaction, batch, notificationsCollection, sender, recipient, timestamp) {
  const reactionData = {
    senderId: sanitizeField(sender.id),
    recipientId: sanitizeField(recipient.id),
    timestamp: new Date(timestamp),
    messageId: sanitizeField(reaction.mid),
    action: reaction.action || null,
    reaction: reaction.reaction || null,
    emoji: reaction.emoji || null
  };

  const docRef = doc(notificationsCollection);
  batch.set(docRef, {
    type: 'reaction',
    data: reactionData,
    timestamp: new Date(timestamp)
  });
}

// Other handlers (handlePostback, handleReferral, etc.) remain unchanged...

// Helper function to sanitize field values
function sanitizeField(value) {
  return value ? String(value).replace(/[^a-zA-Z0-9_-]/g, '') : null;
}
