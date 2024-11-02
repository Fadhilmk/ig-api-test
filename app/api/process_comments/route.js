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

import { NextResponse } from 'next/server';

export async function POST(req) {
  const { igUserId, mediaId, commentId, text, username, fromId, accessToken } = await req.json();
  const replyText = `Thank you for Commenting "${username}"`;

  try {
    const response = await fetch(`https://graph.instagram.com/v21.0/${igUserId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: fromId },
        message: { text: replyText },
      }),
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
