// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { mediaIds } = await req.json();
//   const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

//   try {
//     const mediaDetails = await Promise.all(
//       mediaIds.map(async (id) => {
//         const mediaUrl = `https://graph.instagram.com/v21.0/${id}?fields=id,media_type,media_url,owner,timestamp,caption,like_count,thumbnail_url,comments_count&access_token=${accessToken}`;
//         const response = await fetch(mediaUrl);
//         const data = await response.json();

//         if (data.error) {
//           console.error(`Error fetching media ID ${id}:`, data.error);
//           return { error: data.error, id };
//         }

//         return data;
//       })
//     );

//     return NextResponse.json(mediaDetails, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching media details:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

export async function POST(req) {
  const { mediaIds } = await req.json();
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  try {
    const mediaDetails = await Promise.all(
      mediaIds.map(async (id) => {
        const mediaUrl = `https://graph.instagram.com/v21.0/${id}?fields=id,media_type,media_url,owner,timestamp,caption,like_count,thumbnail_url,comments_count&access_token=${accessToken}`;
        const response = await fetch(mediaUrl);
        const data = await response.json();

        if (data.error) {
          console.error(`Error fetching media ID ${id}:`, data.error);
          return { error: data.error, id };
        }

        return data;
      })
    );

    return NextResponse.json(mediaDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching media details:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
