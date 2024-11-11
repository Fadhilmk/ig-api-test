import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;

  const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;

  try {
    const response = await fetch(mediaIdsUrl);
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching media IDs:", data.error);
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    console.log("Fetched Media IDs:", data.data); // Log media IDs to confirm structure
    return NextResponse.json(data.data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch media IDs:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
