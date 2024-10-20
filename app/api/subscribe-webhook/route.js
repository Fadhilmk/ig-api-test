// import axios from 'axios';

// const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;  // Access token for Instagram user

// export async function POST(req, res) {
//   const { userId } = req.body;  // Extract the userId from the request body

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     // Subscribe the user to Instagram webhook fields (e.g., comments, messages)
//     const subscribeUrl = `https://graph.instagram.com/v21.0/${userId}/subscribed_apps`;

//     const response = await axios.post(subscribeUrl, null, {
//       params: {
//         subscribed_fields: 'comments,messages',  // Add other fields as needed
//         access_token: ACCESS_TOKEN,
//       },
//     });

//     if (response.data.success) {
//       return res.status(200).json({ success: true });
//     } else {
//       return res.status(500).json({ error: 'Failed to subscribe to webhook fields' });
//     }
//   } catch (error) {
//     console.error('Error subscribing to webhook fields:', error);
//     return res.status(500).json({ error: 'Failed to subscribe to webhook fields' });
//   }
// }


import axios from 'axios';
import { NextResponse } from 'next/server'; // Use NextResponse in the app directory

export async function POST(req) {
  const { userId } = await req.json(); // Parse request body (using req.json() in the app directory)

  if (!userId) {
    console.error('User ID is required');
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const subscribeUrl = `https://graph.instagram.com/v21.0/${userId}/subscribed_apps`;

  try {
    const response = await axios.post(subscribeUrl, null, {
      params: {
        subscribed_fields: 'comments,messages', // Fields to subscribe to
        access_token: accessToken,
      },
    });

    // Check the Instagram response
    if (response.data.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      console.error('Failed to subscribe to webhook fields:', response.data);
      return NextResponse.json({ error: 'Failed to subscribe to webhook fields' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error subscribing to webhook:', error);
    return NextResponse.json({ error: 'Failed to subscribe to webhook fields' }, { status: 500 });
  }
}
