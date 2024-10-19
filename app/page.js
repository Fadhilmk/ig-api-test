// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramProfile() {
//   const [profile, setProfile] = useState(null);
//   const [media, setMedia] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Call the Next.js API route
//     fetch("/api/instagram")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.error) {
//           setError(data.error);
//         } else {
//           // Separate profile and media data from the response
//           setProfile(data.profile);
//           setMedia(data.media.data);
//           console.log(data);
//         }
//       })
//       .catch((err) => {
//         setError("Failed to fetch data");
//         console.error(err);
//       });
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!profile || !media) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Instagram Profile</h1>
//       <p>User ID: {profile.user_id}</p>
//       <p>Username: {profile.username}</p>
//       <p>Account Type: {profile.account_type}</p>
//       <p>Followers Count: {profile.followers_count}</p>
//       <p>Follows Count: {profile.follows_count}</p>
//       <p>Media Count: {profile.media_count}</p>
//       <img src={profile.profile_picture_url} alt="Profile Picture" />

//       <h2>Instagram Media</h2>
//       <ul>
//         {media.map((mediaItem) => (
//           <li key={mediaItem.id}>Media ID: {mediaItem.id}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function InstagramProfile() {
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);

  // Function to subscribe user to webhook fields
  const subscribeToWebhook = (userId) => {
    fetch("/api/subscribe-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Successfully subscribed to webhook fields.");
        } else {
          console.error("Failed to subscribe to webhook fields.");
        }
      })
      .catch((err) => {
        console.error("Error subscribing to webhook:", err);
      });
  };

  useEffect(() => {
    // Fetch the Instagram profile and media
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Separate profile and media data from the response
          setProfile(data.profile);
          setMedia(data.media.data);
          console.log(data);

          // Subscribe the user to the webhook fields once we have the user_id
          subscribeToWebhook(data.profile.user_id);  // Pass the user_id to the subscription function
        }
      })
      .catch((err) => {
        setError("Failed to fetch data");
        console.error(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile || !media) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Instagram Profile</h1>
      <p>User ID: {profile.user_id}</p>
      <p>Username: {profile.username}</p>
      <p>Account Type: {profile.account_type}</p>
      <p>Followers Count: {profile.followers_count}</p>
      <p>Follows Count: {profile.follows_count}</p>
      <p>Media Count: {profile.media_count}</p>
      <img src={profile.profile_picture_url} alt="Profile Picture" />

      <h2>Instagram Medias</h2>
      <ul>
        {media.map((mediaItem) => (
          <li key={mediaItem.id}>Media ID: {mediaItem.id}</li>
        ))}
      </ul>
    </div>
  );
}

