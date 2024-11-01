import { NextResponse } from 'next/server';

export async function POST(req) {
  const { igUserId, igScopedId, receivedText, accessToken } = await req.json();
  const replyText = `Thank you for your message: "${receivedText}"`; // Customize this reply

  try {
    const response = await fetch(`https://graph.instagram.com/v21.0/${igUserId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: igScopedId },
        message: { text: replyText },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    console.log('Reply sent successfully.');
    return NextResponse.json({ message: 'Reply sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
