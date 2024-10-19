import axios from 'axios';

export async function GET(request) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Access token not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // First, call the Instagram API to get the user profile data (including the IG ID)
    const userProfileResponse = await axios.get(`https://graph.instagram.com/v21.0/me`, {
      params: {
        fields: 'user_id,username,account_type,profile_picture_url,followers_count,follows_count,media_count',
        access_token: accessToken,
      },
    });

    const userProfile = userProfileResponse.data;
    const userId = userProfile.user_id;

    // Then, call the Instagram API to get the user's media objects
    const mediaResponse = await axios.get(`https://graph.instagram.com/v21.0/${userId}/media`, {
      params: {
        access_token: accessToken,
      },
    });

    const mediaData = mediaResponse.data;

    // Combine both responses into one object and return it
    const responseData = {
      profile: userProfile,
      media: mediaData,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
