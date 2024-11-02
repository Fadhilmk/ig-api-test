// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   const { igUserId, mediaId, commentId,text,username,fromId, accessToken } = await req.json();
//   const replyText = `Thank you for Commenting "${username}"`; // Customize this reply

//   try {
//     const response = await fetch(`https://graph.instagram.com/v21.0/${igUserId}/messages`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         recipient: { id: fromId },
//         message: { text: replyText },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to send message: ${response.statusText}`);
//     }

//     console.log('Reply sent successfully.');
//     return NextResponse.json({ message: 'Reply sent successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error sending reply:', error);
//     return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
//   }
// }

// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   const { igUserId, mediaId, commentId, text, username, fromId, accessToken } = await req.json();
//   const replyText = `Thank you for Commenting "${username}"`;

//   try {
//     const response = await fetch(`https://graph.instagram.com/v21.0/${igUserId}/messages`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         recipient: { id: fromId },
//         message: { text: replyText },
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`Failed to send message. Status: ${response.status}, Response: ${errorText}`);
//       throw new Error(`Failed to send message: ${response.statusText}`);
//     }

//     console.log('Reply sent successfully.');
//     return NextResponse.json({ message: 'Reply sent successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error sending reply:', error.message);
//     return NextResponse.json({ error: 'Failed to send reply', details: error.message }, { status: 500 });
//   }
// }

// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   const { igUserId, commentId, text, username, accessToken } = await req.json();
//   const replyText = `Thank you for commenting ${username}!`;

//   try {
//     const response = await fetch(`https://graph.instagram.com/${igUserId}/messages`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         recipient: { comment_id: commentId }, // Use `comment_id` to correctly reference the comment
//         message: { text: replyText },
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`Failed to send message. Status: ${response.status}, Response: ${errorText}`);
//       throw new Error(`Failed to send message: ${response.statusText}`);
//     }

//     console.log('Reply sent successfully.');
//     return NextResponse.json({ message: 'Reply sent successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error sending reply:', error.message);
//     return NextResponse.json({ error: 'Failed to send reply', details: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req) {
  const { igUserId, commentId, text, username, accessToken } = await req.json();
  const replyText = `Thank you for commenting ${username}!`;

  try {
    // Check if the user has template messaging enabled in Firestore
    const userDocRef = doc(db, 'webhooks', igUserId);
    const userSnapshot = await getDoc(userDocRef);
    const isTemplateEnabled = userSnapshot.exists() && userSnapshot.data().isTemplateEnabled;

    // Define the URL for sending the message
    const url = `https://graph.instagram.com/${igUserId}/messages`;

    let messagePayload;

    if (isTemplateEnabled) {
      // Prepare the template message payload
      messagePayload = {
        recipient: { comment_id: commentId },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: "Thank you for your feedback!",
                  subtitle: "We appreciate your engagement.",
                  image_url: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  default_action: {
                    type: "web_url",
                    url: "https://www.maadiy.com/",
                  },
                  buttons: [
                    {
                      type: "web_url",
                      url: "https://www.maadiy.com/",
                      title: "Visit our Website"
                    }
                  ]
                }
              ]
            }
          }
        }
      };
    } else {
      // Regular reply message payload
      messagePayload = {
        recipient: { comment_id: commentId },
        message: { text: replyText }
      };
    }

    // Send the message
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send message. Status: ${response.status}, Response: ${errorText}`);
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    console.log('Reply sent successfully.');
    return NextResponse.json({ message: 'Reply sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending reply:', error.message);
    return NextResponse.json({ error: 'Failed to send reply', details: error.message }, { status: 500 });
  }
}
