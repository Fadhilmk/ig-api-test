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

// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramProfile() {
//   const [profile, setProfile] = useState(null);
//   const [media, setMedia] = useState(null);
//   const [error, setError] = useState(null);

//   // Function to subscribe user to webhook fields
//   const subscribeToWebhook = (userId) => {
//     fetch("/api/subscribe-webhook", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           console.log("Successfully subscribed to webhook fields.");
//         } else {
//           console.error("Failed to subscribe to webhook fields.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error subscribing to webhook:", err);
//       });
//   };

//   useEffect(() => {
//     // Fetch the Instagram profile and media
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

//           // Subscribe the user to the webhook fields once we have the user_id
//           subscribeToWebhook(data.profile.user_id);  // Pass the user_id to the subscription function
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

//       <h2>Instagram Medias</h2>
//       <ul>
//         {media.map((mediaItem) => (
//           <li key={mediaItem.id}>Media ID: {mediaItem.id}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramProfile() {
//   const [profile, setProfile] = useState(null);
//   const [media, setMedia] = useState([]);
//   const [error, setError] = useState(null);

//   // Function to subscribe user to webhook fields
//   const subscribeToWebhook = (userId) => {
//     fetch("/api/subscribe-webhook", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           console.log("Successfully hh subscribed to webhook fields.");
//         } else {
//           console.error("Failed to subscribe to webhook fields.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error subscribing to webhook:", err);
//       });
//   };

//   useEffect(() => {
//     // Fetch the Instagram profile and media
//     fetch("/api/instagram")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.error) {
//           setError(data.error);
//         } else {
//           // Separate profile and media data from the response
//           setProfile(data.profile);

//           // Safely check if media data exists
//           if (data.media && Array.isArray(data.media.data)) {
//             setMedia(data.media.data);
//           } else {
//             console.warn("No media data found.");
//           }

//           // Subscribe the user to the webhook fields once we have the user_id
//           if (data.profile && data.profile.user_id) {
//             subscribeToWebhook(data.profile.user_id);  // Pass the user_id to the subscription function
//           }
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

//   if (!profile || media.length === 0) {
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

//       <h2>Instagram Medias</h2>
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
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function InstagramProfile() {
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [delay, setDelay] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [isTemplateEnabled, setIsTemplateEnabled] = useState();
  const [previousSettings, setPreviousSettings] = useState({}); // Stores last saved settings

  // Function to load previously saved settings
  const loadUserSettings = async (userId) => {
    try {
      const userDocRef = doc(db, "webhooks", userId);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setDelay(data.delay || 5);
        setKeyword(data.keyword || "");
        setIsTemplateEnabled(data.isTemplateEnabled || false);
        setPreviousSettings({ delay: data.delay, keyword: data.keyword, isTemplateEnabled: data.isTemplateEnabled });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  // Save settings to Firebase if there are changes
  const saveUserSettings = async (userId) => {
    const currentSettings = { delay, keyword, isTemplateEnabled };
    if (JSON.stringify(currentSettings) === JSON.stringify(previousSettings)) {
      console.log("No changes to settings. Not saving to Firebase.");
      return;
    }

    try {
      const userDocRef = doc(db, "webhooks", userId);
      await setDoc(
        userDocRef,
        currentSettings,
        { merge: true }
      );
      console.log("Settings saved successfully");
      setPreviousSettings(currentSettings); // Update previous settings after saving
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  // Subscribe to webhook fields
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
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data.profile);
          setMedia(data.media?.data || []);
          if (data.profile && data.profile.user_id) {
            subscribeToWebhook(data.profile.user_id);
            loadUserSettings(data.profile.user_id); // Load settings on component mount
          }
        }
      })
      .catch((err) => {
        setError("Failed to fetch data");
        console.error(err);
      });
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!profile || media.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Instagram Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        <div className="flex flex-col space-y-2">
          <img src={profile.profile_picture_url} alt="Profile Picture" className="w-24 h-24 rounded-full mx-auto mb-4" />
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>User ID:</strong> {profile.user_id}</p>
          <p><strong>Account Type:</strong> {profile.account_type}</p>
          <p><strong>Followers Count:</strong> {profile.followers_count}</p>
          <p><strong>Media Count:</strong> {profile.media_count}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>

        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Enable Template Message</label>
          <div
            className={`relative inline-flex items-center cursor-pointer ${isTemplateEnabled ? "bg-green-500" : "bg-gray-300"
              } rounded-full w-11 h-6 transition-colors duration-300`}
            onClick={() => setIsTemplateEnabled((prev) => !prev)}
          >
            <div
              className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${isTemplateEnabled ? "translate-x-5" : ""
                }`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="delay" className="block font-medium mb-2">Response Delay (seconds)</label>
          <select
            id="delay"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            {[5, 10, 15, 20, 30].map((sec) => (
              <option key={sec} value={sec}>{sec} seconds</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="keyword" className="block font-medium mb-2">Keyword</label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter keyword..."
          />
        </div>
        <button
          onClick={() => saveUserSettings(profile.user_id)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Instagram Media</h2>
        <ul className="space-y-4">
          {media.map((mediaItem) => (
            <li key={mediaItem.id} className="p-4 border border-gray-200 rounded-md">
              <p><strong>Media ID:</strong> {mediaItem.id}</p>
              <p><strong>Media Type:</strong> {mediaItem.media_type}</p>
              {mediaItem.media_url && <img src={mediaItem.media_url} alt="Media" className="mt-2 rounded-lg max-w-xs" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
