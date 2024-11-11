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


// import { NextResponse } from 'next/server';
// import { db } from '../../../firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';

// export async function POST(req) {
//   const { igUserId,mediaId, commentId, text,fromId, username, accessToken } = await req.json();
//   const replyText = `Thank you for commenting ${username}!`;

//   try {
//     // Check if the user has template messaging enabled in Firestore
//     const userDocRef = doc(db, 'webhooks', igUserId);
//     const userSnapshot = await getDoc(userDocRef);
//     const isTemplateEnabled = userSnapshot.exists() && userSnapshot.data().isTemplateEnabled;

//     // Define the URL for sending the message
//     const url = `https://graph.instagram.com/${igUserId}/messages`;

//     let messagePayload;

//     if (isTemplateEnabled) {
//       // Prepare the template message payload
//       messagePayload = {
//         recipient: { comment_id: commentId },
//         message: {
//           attachment: {
//             type: 'template',
//             payload: {
//               template_type: 'generic',
//               elements: [
//                 {
//                   title: "Thank you for your feedback!",
//                   subtitle: "We appreciate your engagement.",
//                   image_url: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//                   default_action: {
//                     type: "web_url",
//                     url: "https://www.maadiy.com/",
//                   },
//                   buttons: [
//                     {
//                       type: "web_url",
//                       url: "https://www.maadiy.com/",
//                       title: "Visit our Website"
//                     }
//                   ]
//                 }
//               ]
//             }
//           }
//         }
//       };
//     } else {
//       // Regular reply message payload
//       messagePayload = {
//         recipient: { comment_id: commentId },
//         message: { text: replyText }
//       };
//     }

//     // Send the message
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(messagePayload),
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
import { doc, getDoc, collection } from 'firebase/firestore';

export async function POST(req) {
  const { igUserId, mediaId, commentId, text, fromId, username, accessToken } = await req.json();

  try {
    // Fetch media document from Firebase
    const mediaDocRef = doc(collection(db, 'media'), mediaId);
    const mediaSnapshot = await getDoc(mediaDocRef);

    if (!mediaSnapshot.exists()) {
      return NextResponse.json({ error: 'Media not found in database' }, { status: 404 });
    }

    const mediaData = mediaSnapshot.data();
    const {
      Keywords = [],
      TemplateMessage = false,
      TextMessage = false,
      commentAutoReply = [],
      excludeKeywords = [],
      replyMessage = ''
    } = mediaData;

    // Check if the comment text contains any excluded keywords
    const isExcluded = excludeKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
    if (isExcluded) {
      return NextResponse.json({ message: 'Comment excluded based on excludeKeywords' }, { status: 200 });
    }

    // Check if comment text matches any keywords
    const isKeywordMatched = Keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));

    // Prepare for reply based on conditions
    let replyText;

    if (isKeywordMatched && commentAutoReply.length > 0) {
      // If `commentAutoReply` exists and a keyword match is found, reply using `commentAutoReply` strings as a comment reply
      const randomReply = commentAutoReply.length === 1
        ? commentAutoReply[0]
        : commentAutoReply[Math.floor(Math.random() * commentAutoReply.length)]; // Randomly select one reply

      const replyUrl = `https://graph.instagram.com/v21.0/${commentId}/replies`;

      const response = await fetch(replyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: randomReply }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to send comment reply. Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`Failed to send comment reply: ${response.statusText}`);
      }

      console.log('Comment reply sent successfully.');
      return NextResponse.json({ message: 'Comment reply sent successfully' }, { status: 200 });

    } else if (isKeywordMatched && TemplateMessage && !TextMessage) {
      // Send a direct template message
      replyText = {
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
                  image_url: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
                  default_action: {
                    type: "web_url",
                    url: "https://www.maadiy.com/"
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

      const directMessageUrl = `https://graph.instagram.com/${igUserId}/messages`;

      const response = await fetch(directMessageUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyText),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to send template message. Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`Failed to send template message: ${response.statusText}`);
      }

      console.log('Template message sent successfully.');
      return NextResponse.json({ message: 'Template message sent successfully' }, { status: 200 });

    } else if (isKeywordMatched && TextMessage && !TemplateMessage) {
      // Send a direct text message
      replyText = {
        recipient: { comment_id: commentId },
        message: { text: replyMessage }
      };

      const directMessageUrl = `https://graph.instagram.com/${igUserId}/messages`;

      const response = await fetch(directMessageUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyText),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to send text message. Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`Failed to send text message: ${response.statusText}`);
      }

      console.log('Text message sent successfully.');
      return NextResponse.json({ message: 'Text message sent successfully' }, { status: 200 });
    } else {
      // No matching conditions for sending a reply
      return NextResponse.json({ message: 'No matching conditions for reply' }, { status: 200 });
    }

  } catch (error) {
    console.error('Error sending reply:', error.message);
    return NextResponse.json({ error: 'Failed to send reply', details: error.message }, { status: 500 });
  }
}
