// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramPosts() {
//   const [mediaDetails, setMediaDetails] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("moderation"); // "moderation" or "automation"
//   const [selectedMedia, setSelectedMedia] = useState(null);

//   useEffect(() => {
//     const fetchMediaDetails = async () => {
//       try {
//         const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
//         const igUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

//         const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;
//         const mediaIdsResponse = await fetch(mediaIdsUrl);
//         const mediaIdsData = await mediaIdsResponse.json();

//         if (mediaIdsData.error) {
//           setError(`Error: ${mediaIdsData.error.message}`);
//           console.error("Error fetching media IDs:", mediaIdsData.error);
//           return;
//         }

//         const mediaIds = mediaIdsData.data.map((media) => media.id);
//         console.log("Fetched Media IDs:", mediaIds);

//         const detailsResponse = await fetch("/api/instagram/media-details", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ mediaIds }),
//         });

//         const detailsData = await detailsResponse.json();

//         if (detailsData.error) {
//           setError(`Error: ${detailsData.error}`);
//           console.error("Error fetching media details:", detailsData.error);
//           return;
//         }

//         setMediaDetails(detailsData);
//       } catch (err) {
//         setError("Failed to fetch media details");
//         console.error(err);
//       }
//     };

//     fetchMediaDetails();
//   }, []);

//   const openModal = (media) => {
//     setSelectedMedia(media);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMedia(null);
//   };

//   if (error) return <div className="text-red-500 text-center">{error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">Instagram Posts</h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {mediaDetails.map((media) =>
//           media.error ? (
//             <div key={media.id} className="text-red-500">
//               Error loading media {media.id}: {media.error.message}
//             </div>
//           ) : (
//             <div key={media.id} className="bg-white shadow-md rounded-lg p-4">
//               {media.media_type === "VIDEO" && media.thumbnail_url ? (
//                 <img
//                   src={media.thumbnail_url}
//                   alt="Video Thumbnail"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               ) : (
//                 <img
//                   src={media.media_url}
//                   alt="Instagram Media"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               )}

//               <p className="font-semibold text-lg truncate">
//                 {media.caption ? `${media.caption.slice(0, 30)}...` : "No caption"}
//               </p>

//               <div className="flex items-center justify-between mt-2 text-gray-500">
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-red-500">favorite</span>
//                   <span>{media.like_count || 0}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-blue-500">comment</span>
//                   <span>{media.comments_count || 0}</span>
//                 </div>
//               </div>

//               <p className="text-xs text-gray-400 mt-2">
//                 Posted on: {new Date(media.timestamp).toLocaleString()}
//               </p>

//               <button
//                 onClick={() => openModal(media)}
//                 className="inline-flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//               >
//                 <span className="material-icons mr-2">link</span> Link
//               </button>
//             </div>
//           )
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg w-11/12 max-w-5xl p-6 relative">
//             {/* Close button */}
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               onClick={closeModal}
//             >
//               <span className="material-icons">close</span>
//             </button>

//             {/* Modal header with tabs */}
//             <div className="flex justify-between mb-6 border-b pb-2">
//               <h2 className="text-2xl font-semibold">{selectedMedia.caption || "Instagram Post"}</h2>
//               <div className="flex space-x-4">
//                 <button
//                   className={`font-semibold ${activeTab === "moderation" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
//                   onClick={() => setActiveTab("moderation")}
//                 >
//                   Comment Moderation
//                 </button>
//                 <button
//                   className={`font-semibold ${activeTab === "automation" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
//                   onClick={() => setActiveTab("automation")}
//                 >
//                   Automation
//                 </button>
//               </div>
//             </div>

//             {/* Modal content */}
//             <div className="flex">
//               {/* Left side: Comment Moderation Settings */}
//               <div className="w-1/2 pr-4">
//                 {activeTab === "moderation" && (
//                   <>
//                     <h3 className="text-xl font-semibold mb-4">Moderation Settings</h3>
//                     {/* Add input fields and moderation options here */}
//                     <input
//                       type="text"
//                       placeholder="Enter keyword to moderate"
//                       className="w-full border border-gray-300 p-2 rounded-lg mb-4"
//                     />
//                     <button className="bg-green-500 text-white py-2 px-4 rounded-md">
//                       Save Settings
//                     </button>
//                   </>
//                 )}
//               </div>

//               {/* Right side: Mobile Preview */}
//               <div className="w-1/2 flex justify-center">
//                 <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
//                   <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
//                     <img
//                       src={selectedMedia.media_url || selectedMedia.thumbnail_url}
//                       alt="Post Preview"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramPosts() {
//   const [mediaDetails, setMediaDetails] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("moderation");
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [privateReplyEnabled, setPrivateReplyEnabled] = useState(false);
//   const [templateImage, setTemplateImage] = useState(null);
//   const [templateTitle, setTemplateTitle] = useState("");
//   const [buttons, setButtons] = useState([{ text: "", url: "" }]);
//   const [button1Text, setButton1Text] = useState("");
//   const [button1Url, setButton1Url] = useState("");

//   const handleButtonChange = (index, field, value) => {
//     const updatedButtons = [...buttons];
//     updatedButtons[index][field] = value;
//     setButtons(updatedButtons);
//   };

//   const addButton = () => {
//     if (buttons.length < 3) {
//       setButtons([...buttons, { text: "", url: "" }]);
//     }
//   };

//   useEffect(() => {
//     const fetchMediaDetails = async () => {
//       try {
//         const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
//         const igUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

//         const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;
//         const mediaIdsResponse = await fetch(mediaIdsUrl);
//         const mediaIdsData = await mediaIdsResponse.json();

//         if (mediaIdsData.error) {
//           setError(`Error: ${mediaIdsData.error.message}`);
//           console.error("Error fetching media IDs:", mediaIdsData.error);
//           return;
//         }

//         const mediaIds = mediaIdsData.data.map((media) => media.id);
//         console.log("Fetched Media IDs:", mediaIds);

//         const detailsResponse = await fetch("/api/instagram/media-details", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ mediaIds }),
//         });

//         const detailsData = await detailsResponse.json();

//         if (detailsData.error) {
//           setError(`Error: ${detailsData.error}`);
//           console.error("Error fetching media details:", detailsData.error);
//           return;
//         }

//         setMediaDetails(detailsData);
//       } catch (err) {
//         setError("Failed to fetch media details");
//         console.error(err);
//       }
//     };

//     fetchMediaDetails();
//   }, []);

//   const openModal = (media) => {
//     setSelectedMedia(media);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMedia(null);
//   };

//   if (error) return <div className="text-red-500 text-center">{error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">Instagram Posts</h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {mediaDetails.map((media) =>
//           media.error ? (
//             <div key={media.id} className="text-red-500">
//               Error loading media {media.id}: {media.error.message}
//             </div>
//           ) : (
//             <div key={media.id} className="bg-white shadow-md rounded-lg p-4">
//               {media.media_type === "VIDEO" && media.thumbnail_url ? (
//                 <img
//                   src={media.thumbnail_url}
//                   alt="Video Thumbnail"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               ) : (
//                 <img
//                   src={media.media_url}
//                   alt="Instagram Media"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               )}

//               <p className="font-semibold text-lg truncate">
//                 {media.caption
//                   ? `${media.caption.slice(0, 30)}...`
//                   : "No caption"}
//               </p>

//               <div className="flex items-center justify-between mt-2 text-gray-500">
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-red-500">favorite</span>
//                   <span>{media.like_count || 0}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-blue-500">comment</span>
//                   <span>{media.comments_count || 0}</span>
//                 </div>
//               </div>

//               <p className="text-xs text-gray-400 mt-2">
//                 Posted on: {new Date(media.timestamp).toLocaleString()}
//               </p>

//               <button
//                 onClick={() => openModal(media)}
//                 className="inline-flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//               >
//                 <span className="material-icons mr-2">link</span> Link
//               </button>
//             </div>
//           )
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg w-11/12 max-w-5xl p-6 relative">
//             {/* Close button */}
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               onClick={closeModal}
//             >
//               <span className="material-icons">close</span>
//             </button>

//             {/* Modal header with tabs */}
//             <div className="flex justify-start mb-6 border-b pb-2">
//               <div className="flex space-x-4">
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "moderation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("moderation")}
//                 >
//                   Comment Moderation
//                 </button>
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "automation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("automation")}
//                 >
//                   Automation
//                 </button>
//               </div>
//             </div>
//             {/* Modal content */}
//             <div className="flex">
//               {/* Left side: Comment Moderation Settings */}
//               <div className="w-1/2 pr-4">
//                 {activeTab === "moderation" && (
//                   <>
//                     <h3 className="text-xl font-semibold mb-4">
//                       Moderation Settings
//                     </h3>

//                     {/* Private Reply Section */}
//                     <div className="mb-4">
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           className="toggle-checkbox"
//                           onChange={(e) =>
//                             setPrivateReplyEnabled(e.target.checked)
//                           }
//                         />
//                         <span className="text-lg font-semibold">
//                           Enable Private Reply
//                         </span>
//                       </label>
//                     </div>

//                     {/* Template Options - only visible if toggle is enabled */}
//                     {privateReplyEnabled && (
//                       <div className="space-y-4">
//                         {/* Template Image */}
//                         <div>
//                           <label className="text-gray-600">
//                             Template Image
//                           </label>
//                           <input
//                             type="file"
//                             className="w-full border border-gray-300 p-2 rounded-lg mb-2"
//                             onChange={(e) =>
//                               setTemplateImage(e.target.files[0])
//                             }
//                           />
//                         </div>

//                         {/* Template Title */}
//                         <div>
//                           <label className="text-gray-600">
//                             Template Title
//                           </label>
//                           <input
//                             type="text"
//                             placeholder="Enter template title"
//                             className="w-full border border-gray-300 p-2 rounded-lg"
//                             value={templateTitle}
//                             onChange={(e) => setTemplateTitle(e.target.value)}
//                           />
//                         </div>

//                         {/* Button 1 */}
//                         <div className="space-y-2">
//                           <label className="text-gray-600">Button 1</label>
//                           <input
//                             type="text"
//                             placeholder="Button text"
//                             className="w-full border border-gray-300 p-2 rounded-lg"
//                             value={button1Text}
//                             onChange={(e) => setButton1Text(e.target.value)}
//                           />
//                           <input
//                             type="url"
//                             placeholder="Button URL"
//                             className="w-full border border-gray-300 p-2 rounded-lg"
//                             value={button1Url}
//                             onChange={(e) => setButton1Url(e.target.value)}
//                           />
//                         </div>

//                         {/* Add Button 2 and 3 */}
//                         {buttons.length < 3 && (
//                           <button
//                             className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
//                             onClick={addButton}
//                           >
//                             Add Button {buttons.length + 2}
//                           </button>
//                         )}

//                         {/* Additional Buttons */}
//                         {buttons.map((button, index) => (
//                           <div key={index} className="space-y-2">
//                             <label className="text-gray-600">
//                               Button {index + 2}
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="Button text"
//                               className="w-full border border-gray-300 p-2 rounded-lg"
//                               value={button.text}
//                               onChange={(e) =>
//                                 handleButtonChange(
//                                   index,
//                                   "text",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <input
//                               type="url"
//                               placeholder="Button URL"
//                               className="w-full border border-gray-300 p-2 rounded-lg"
//                               value={button.url}
//                               onChange={(e) =>
//                                 handleButtonChange(index, "url", e.target.value)
//                               }
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>

//               {/* Right side: Interactive Mobile Preview */}
//               <div className="w-1/2 flex justify-center">
//                 <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
//                   <div className="bg-white w-full h-full rounded-[2rem] flex flex-col justify-between overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-b">
//                       <img
//                         src="icons8-male-user-50.png"
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span className="font-semibold">Username</span>
//                     </div>

//                     {/* Message Bubble aligned to bottom-right */}
//                     <div className="flex flex-1 justify-end p-4 items-end">
//                       <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-2 mr-2 self-end">
//                         Thank you for Commenting!
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-t">
//                       <input
//                         type="text"
//                         placeholder="Message..."
//                         className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm"
//                       />
//                       <button className="material-icons text-blue-500">
//                         send
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramPosts() {
//   const [mediaDetails, setMediaDetails] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("moderation");
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [privateReplyEnabled, setPrivateReplyEnabled] = useState(false);
//   const [templateImage, setTemplateImage] = useState(null);
//   const [templateTitle, setTemplateTitle] = useState("");
//   const [buttons, setButtons] = useState([{ text: "", url: "" }]);

//   const handleButtonChange = (index, field, value) => {
//     const updatedButtons = [...buttons];
//     updatedButtons[index][field] = value;
//     setButtons(updatedButtons);
//   };

//   const addButton = () => {
//     if (buttons.length < 3) {
//       setButtons([...buttons, { text: "", url: "" }]);
//     }
//   };

//   const removeButton = (index) => {
//     if (buttons.length > 1) {
//       setButtons(buttons.filter((_, i) => i !== index));
//     }
//   };

//   useEffect(() => {
//     const fetchMediaDetails = async () => {
//       try {
//         const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
//         const igUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

//         const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;
//         const mediaIdsResponse = await fetch(mediaIdsUrl);
//         const mediaIdsData = await mediaIdsResponse.json();

//         if (mediaIdsData.error) {
//           setError(`Error: ${mediaIdsData.error.message}`);
//           console.error("Error fetching media IDs:", mediaIdsData.error);
//           return;
//         }

//         const mediaIds = mediaIdsData.data.map((media) => media.id);
//         console.log("Fetched Media IDs:", mediaIds);

//         const detailsResponse = await fetch("/api/instagram/media-details", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ mediaIds }),
//         });

//         const detailsData = await detailsResponse.json();

//         if (detailsData.error) {
//           setError(`Error: ${detailsData.error}`);
//           console.error("Error fetching media details:", detailsData.error);
//           return;
//         }

//         setMediaDetails(detailsData);
//       } catch (err) {
//         setError("Failed to fetch media details");
//         console.error(err);
//       }
//     };

//     fetchMediaDetails();
//   }, []);

//   const openModal = (media) => {
//     setSelectedMedia(media);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMedia(null);
//   };

//   if (error) return <div className="text-red-500 text-center">{error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">Instagram Posts</h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {mediaDetails.map((media) =>
//           media.error ? (
//             <div key={media.id} className="text-red-500">
//               Error loading media {media.id}: {media.error.message}
//             </div>
//           ) : (
//             <div key={media.id} className="bg-white shadow-md rounded-lg p-4">
//               {media.media_type === "VIDEO" && media.thumbnail_url ? (
//                 <img
//                   src={media.thumbnail_url}
//                   alt="Video Thumbnail"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               ) : (
//                 <img
//                   src={media.media_url}
//                   alt="Instagram Media"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               )}

//               <p className="font-semibold text-lg truncate">
//                 {media.caption
//                   ? `${media.caption.slice(0, 30)}...`
//                   : "No caption"}
//               </p>

//               <div className="flex items-center justify-between mt-2 text-gray-500">
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-red-500">favorite</span>
//                   <span>{media.like_count || 0}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-blue-500">comment</span>
//                   <span>{media.comments_count || 0}</span>
//                 </div>
//               </div>

//               <p className="text-xs text-gray-400 mt-2">
//                 Posted on: {new Date(media.timestamp).toLocaleString()}
//               </p>

//               <button
//                 onClick={() => openModal(media)}
//                 className="inline-flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//               >
//                 <span className="material-icons mr-2">link</span> Link
//               </button>
//             </div>
//           )
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg w-11/12 max-w-5xl p-6 relative">
//             {/* Close button */}
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               onClick={closeModal}
//             >
//               <span className="material-icons">close</span>
//             </button>

//             {/* Modal header with tabs */}
//             <div className="flex justify-start mb-6 border-b pb-2">
//               <div className="flex space-x-4">
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "moderation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("moderation")}
//                 >
//                   Comment Moderation
//                 </button>
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "automation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("automation")}
//                 >
//                   Automation
//                 </button>
//               </div>
//             </div>

//             {/* Modal content */}
//             <div className="flex">
//               {/* Left side: Comment Moderation Settings */}
//               <div className="w-1/2 pr-4 max-h-[500px] overflow-y-auto">
//                 {activeTab === "moderation" && (
//                   <>
//                     <h3 className="text-xl font-semibold mb-4">
//                       Moderation Settings
//                     </h3>

//                     {/* Custom Toggle Button for Private Reply */}
//                     <div className="mb-4">
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           className="sr-only peer"
//                           checked={privateReplyEnabled}
//                           onChange={(e) =>
//                             setPrivateReplyEnabled(e.target.checked)
//                           }
//                         />
//                         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                         <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
//                           Private Reply with Template
//                         </span>
//                       </label>
//                     </div>

//                     {/* Template Options - only visible if toggle is enabled */}
//                     {privateReplyEnabled && (
//                       <div className="space-y-4">
//                         {/* Template Image */}
//                         <div>
//                           <label className="text-gray-600">Template Image</label>
//                           <input
//                             type="file"
//                             className="w-full border border-gray-300 p-2 rounded-lg mb-2"
//                             onChange={(e) => setTemplateImage(e.target.files[0])}
//                           />
//                         </div>

//                         {/* Template Title */}
//                         <div>
//                           <label className="text-gray-600">Template Title</label>
//                           <input
//                             type="text"
//                             placeholder="Enter template title"
//                             className="w-full border border-gray-300 p-2 rounded-lg"
//                             value={templateTitle}
//                             onChange={(e) => setTemplateTitle(e.target.value)}
//                           />
//                         </div>

//                         {/* Default and Additional Buttons */}
//                         {buttons.map((button, index) => (
//                           <div key={index} className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <label className="text-gray-600">
//                                 Button {index + 1}
//                               </label>
//                               {index > 0 && (
//                                 <button
//                                   onClick={() => removeButton(index)}
//                                   className="text-red-500"
//                                 >
//                                   Remove
//                                 </button>
//                               )}
//                             </div>
//                             <input
//                               type="text"
//                               placeholder="Button text"
//                               className="w-full border border-gray-300 p-2 rounded-lg"
//                               value={button.text}
//                               onChange={(e) =>
//                                 handleButtonChange(index, "text", e.target.value)
//                               }
//                             />
//                             <input
//                               type="url"
//                               placeholder="Button URL"
//                               className="w-full border border-gray-300 p-2 rounded-lg"
//                               value={button.url}
//                               onChange={(e) =>
//                                 handleButtonChange(index, "url", e.target.value)
//                               }
//                             />
//                           </div>
//                         ))}

//                         {/* Add Button (up to 3 total) */}
//                         {buttons.length < 3 && (
//                           <button
//                             className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
//                             onClick={addButton}
//                           >
//                             Add Button {buttons.length + 1}
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>

//               {/* Right side: Interactive Mobile Preview */}
//               <div className="w-1/2 flex justify-center">
//                 <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
//                   <div className="bg-white w-full h-full rounded-[2rem] flex flex-col justify-between overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-b">
//                       <img
//                         src="icons8-male-user-50.png"
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span className="font-semibold">Username</span>
//                     </div>

//                     {/* Message Bubble aligned to bottom-right */}
//                     <div className="flex flex-1 justify-end p-4 items-end">
//                       <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-2 mr-2 self-end">
//                         Thank you for Commenting!
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-t">
//                       <input
//                         type="text"
//                         placeholder="Message..."
//                         className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm"
//                       />
//                       <button className="material-icons text-blue-500">
//                         send
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramPosts() {
//   const [mediaDetails, setMediaDetails] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("moderation");
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [privateReplyEnabled, setPrivateReplyEnabled] = useState(false);
//   const [replyToCommentEnabled, setReplyToCommentEnabled] = useState(false);
//   const [templateImage, setTemplateImage] = useState(null);
//   const [templateTitle, setTemplateTitle] = useState("");
//   const [buttons, setButtons] = useState([{ text: "", url: "" }]);
//   const [keywords, setKeywords] = useState([]);
//   const [keywordInput, setKeywordInput] = useState("");

//   const handleButtonChange = (index, field, value) => {
//     const updatedButtons = [...buttons];
//     updatedButtons[index][field] = value;
//     setButtons(updatedButtons);
//   };

//   const addButton = () => {
//     if (buttons.length < 3) {
//       setButtons([...buttons, { text: "", url: "" }]);
//     }
//   };

//   const removeButton = (index) => {
//     if (buttons.length > 1) {
//       setButtons(buttons.filter((_, i) => i !== index));
//     }
//   };

//   const addKeyword = () => {
//     if (keywordInput.trim() && keywords.length < 10) {
//       setKeywords([...keywords, keywordInput.trim()]);
//       setKeywordInput("");
//     }
//   };

//   const removeKeyword = (index) => {
//     setKeywords(keywords.filter((_, i) => i !== index));
//   };

//   useEffect(() => {
//     const fetchMediaDetails = async () => {
//       try {
//         const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
//         const igUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

//         const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;
//         const mediaIdsResponse = await fetch(mediaIdsUrl);
//         const mediaIdsData = await mediaIdsResponse.json();

//         if (mediaIdsData.error) {
//           setError(`Error: ${mediaIdsData.error.message}`);
//           console.error("Error fetching media IDs:", mediaIdsData.error);
//           return;
//         }

//         const mediaIds = mediaIdsData.data.map((media) => media.id);
//         console.log("Fetched Media IDs:", mediaIds);

//         const detailsResponse = await fetch("/api/instagram/media-details", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ mediaIds }),
//         });

//         const detailsData = await detailsResponse.json();

//         if (detailsData.error) {
//           setError(`Error: ${detailsData.error}`);
//           console.error("Error fetching media details:", detailsData.error);
//           return;
//         }

//         setMediaDetails(detailsData);
//       } catch (err) {
//         setError("Failed to fetch media details");
//         console.error(err);
//       }
//     };

//     fetchMediaDetails();
//   }, []);

//   const openModal = (media) => {
//     setSelectedMedia(media);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMedia(null);
//   };

//   if (error) return <div className="text-red-500 text-center">{error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">Instagram Posts</h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {mediaDetails.map((media) =>
//           media.error ? (
//             <div key={media.id} className="text-red-500">
//               Error loading media {media.id}: {media.error.message}
//             </div>
//           ) : (
//             <div key={media.id} className="bg-white shadow-md rounded-lg p-4">
//               {media.media_type === "VIDEO" && media.thumbnail_url ? (
//                 <img
//                   src={media.thumbnail_url}
//                   alt="Video Thumbnail"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               ) : (
//                 <img
//                   src={media.media_url}
//                   alt="Instagram Media"
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               )}

//               <p className="font-semibold text-lg truncate">
//                 {media.caption
//                   ? `${media.caption.slice(0, 30)}...`
//                   : "No caption"}
//               </p>

//               <div className="flex items-center justify-between mt-2 text-gray-500">
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-red-500">favorite</span>
//                   <span>{media.like_count || 0}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="material-icons text-blue-500">comment</span>
//                   <span>{media.comments_count || 0}</span>
//                 </div>
//               </div>

//               <p className="text-xs text-gray-400 mt-2">
//                 Posted on: {new Date(media.timestamp).toLocaleString()}
//               </p>

//               <button
//                 onClick={() => openModal(media)}
//                 className="inline-flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//               >
//                 <span className="material-icons mr-2">link</span> Link
//               </button>
//             </div>
//           )
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg w-11/12 max-w-5xl p-6 relative">
//             {/* Close button */}
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               onClick={closeModal}
//             >
//               <span className="material-icons">close</span>
//             </button>

//             {/* Modal header with tabs */}
//             <div className="flex justify-start mb-6 border-b pb-2">
//               <div className="flex space-x-4">
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "moderation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("moderation")}
//                 >
//                   Comment Moderation
//                 </button>
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "automation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("automation")}
//                 >
//                   Automation
//                 </button>
//               </div>
//             </div>

//             {/* Modal content */}
//             <div className="flex">
//               {/* Left side: Comment Moderation Settings */}
//               <div className="w-1/2 pr-4 max-h-[550px] overflow-y-auto">
//                 {activeTab === "moderation" && (
//                   <>
//                     <h3 className="text-xl font-semibold mb-4">
//                       Moderation Settings
//                     </h3>

//                     {/* Custom Toggle Button for Private Reply */}
//                     <div className="mb-4 ml-4">
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           className="sr-only peer"
//                           checked={privateReplyEnabled}
//                           onChange={(e) =>
//                             setPrivateReplyEnabled(e.target.checked)
//                           }
//                         />
//                         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                         <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
//                           Private Reply with Template
//                         </span>
//                       </label>
//                     </div>

//                     {/* Inside Moderation Settings section */}
//                     {privateReplyEnabled && (
//                       <div className="overflow-y-auto max-h-[250px] space-y-4 border-t pt-4">
//                         {/* Template Image */}
//                         <div>
//                           <label className="text-gray-600">
//                             Template Image
//                           </label>
//                           <input
//                             type="file"
//                             className="w-full border border-gray-300 p-2 rounded-lg mb-2"
//                             onChange={(e) =>
//                               setTemplateImage(e.target.files[0])
//                             }
//                           />
//                         </div>

//                         {/* Template Title */}
//                         <div>
//                           <label className="text-gray-600">
//                             Template Title
//                           </label>
//                           <input
//                             type="text"
//                             placeholder="Enter template title"
//                             className="w-full border border-gray-300 p-2 rounded-lg"
//                             value={templateTitle}
//                             onChange={(e) => setTemplateTitle(e.target.value)}
//                           />
//                         </div>

//                         {/* Default and Additional Buttons */}
//                         {buttons.map((button, index) => (
//                           <div key={index} className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <label className="text-gray-600">
//                                 Button {index + 1}
//                               </label>
//                               {index > 0 && (
//                                 <button
//                                   onClick={() => removeButton(index)}
//                                   className="text-red-500"
//                                 >
//                                   Remove
//                                 </button>
//                               )}
//                             </div>
//                             <input
//                               type="text"
//                               placeholder="Button text"
//                               className="w-full border border-gray-300 p-2 rounded-lg"
//                               value={button.text}
//                               onChange={(e) =>
//                                 handleButtonChange(
//                                   index,
//                                   "text",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <input
//                               type="url"
//                               placeholder="Button URL"
//                               className="w-full border border-gray-300 p-2 rounded-lg"
//                               value={button.url}
//                               onChange={(e) =>
//                                 handleButtonChange(index, "url", e.target.value)
//                               }
//                             />
//                           </div>
//                         ))}

//                         {/* Add Button (up to 3 total) */}
//                         {buttons.length < 3 && (
//                           <button
//                             className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
//                             onClick={addButton}
//                           >
//                             Add Button {buttons.length + 1}
//                           </button>
//                         )}
//                       </div>
//                     )}

//                     {/* Toggle for Reply to Comment */}
//                     <div className="mb-4 mt-4 ml-4">
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           className="sr-only peer"
//                           checked={replyToCommentEnabled}
//                           onChange={(e) =>
//                             setReplyToCommentEnabled(e.target.checked)
//                           }
//                         />
//                         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                         <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
//                           Reply to Comment
//                         </span>
//                       </label>
//                     </div>

//                     {/* Keyword Input Section */}
//                     {replyToCommentEnabled && (
//                       <div className="overflow-y-auto max-h-[200px] space-y-4 border-t pt-4">
//                         <div>
//                           <label className="text-gray-600">Keywords</label>
//                           <div className="flex items-center space-x-2">
//                             <input
//                               type="text"
//                               placeholder="Enter keyword"
//                               className="flex-1 border border-gray-300 p-2 rounded-lg"
//                               value={keywordInput}
//                               onChange={(e) => setKeywordInput(e.target.value)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                   addKeyword();
//                                   e.preventDefault();
//                                 }
//                               }}
//                             />
//                             <button
//                               onClick={addKeyword}
//                               className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                             >
//                               Add
//                             </button>
//                           </div>

//                           {/* Display Keywords as Bubbles */}
//                           <div className="flex flex-wrap mt-2 space-x-2 space-y-2">
//                             {keywords.map((keyword, index) => (
//                               <span
//                                 key={index}
//                                 className="inline-flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium space-x-1"
//                               >
//                                 <span>{keyword}</span>
//                                 <button
//                                   onClick={() => removeKeyword(index)}
//                                   className="text-blue-500 hover:text-blue-700"
//                                 >
//                                   &times;
//                                 </button>
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>

//               {/* Right side: Interactive Mobile Preview */}
//               <div className="w-1/2 flex justify-center">
//                 <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
//                   <div className="bg-white w-full h-full rounded-[2rem] flex flex-col justify-between overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-b">
//                       <img
//                         src="icons8-male-user-50.png"
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span className="font-semibold">Username</span>
//                     </div>

//                     {/* Message Bubble aligned to bottom-right */}
//                     <div className="flex flex-1 justify-end p-4 items-end">
//                       <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-2 mr-2 self-end">
//                         Thank you for Commenting!
//                       </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-t">
//                       <input
//                         type="text"
//                         placeholder="Message..."
//                         className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm"
//                       />
//                       <button className="material-icons text-blue-500">
//                         send
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// app/posts/page.jsx

// "use client";
// import { useState } from "react";

// export default function InstagramPosts() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("moderation"); // Main tabs: Comment Moderation, Automation
//   const [activeSubTab, setActiveSubTab] = useState("setup"); // Sub-tabs for Comment Moderation

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">Instagram Posts</h1>

//       <button
//         onClick={openModal}
//         className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//       >
//         <span className="material-icons mr-2">link</span> Link
//       </button>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg w-11/12 max-w-5xl p-6 relative">
//             {/* Close button */}
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               onClick={closeModal}
//             >
//               <span className="material-icons">close</span>
//             </button>

//             {/* Modal header with tabs */}
//             <div className="flex justify-start mb-6 border-b pb-2">
//               <div className="flex space-x-4">
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "moderation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("moderation")}
//                 >
//                   Comment Moderation
//                 </button>
//                 <button
//                   className={`font-semibold ${
//                     activeTab === "automation"
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500"
//                   }`}
//                   onClick={() => setActiveTab("automation")}
//                 >
//                   Automation
//                 </button>
//               </div>
//             </div>

//             {/* Sub-tabs for Comment Moderation */}
//             {activeTab === "moderation" && (
//               <div className="mb-6">
//                 <div className="flex space-x-4 border-b pb-2">
//                   <button
//                     className={`font-semibold ${
//                       activeSubTab === "setup" ? "text-blue-600" : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveSubTab("setup")}
//                   >
//                     Setup
//                   </button>
//                   <button
//                     className={`font-semibold ${
//                       activeSubTab === "trigger" ? "text-blue-600" : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveSubTab("trigger")}
//                   >
//                     Trigger
//                   </button>
//                   <button
//                     className={`font-semibold ${
//                       activeSubTab === "settings" ? "text-blue-600" : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveSubTab("settings")}
//                   >
//                     Settings
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Interactive Mobile Preview */}
//             <div className="w-full flex justify-center">
//               <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
//                 <div className="bg-white w-full h-full rounded-[2rem] flex flex-col justify-between overflow-hidden">
//                   {/* Header */}
//                   <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-b">
//                     <img
//                       src="icons8-male-user-50.png"
//                       alt="Profile"
//                       className="w-8 h-8 rounded-full"
//                     />
//                     <span className="font-semibold">Username</span>
//                   </div>

//                   {/* Message Bubble aligned to bottom-right */}
//                   <div className="flex flex-1 justify-end p-4 items-end">
//                     <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-2 mr-2 self-end">
//                       Thank you for Commenting!
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-t">
//                     <input
//                       type="text"
//                       placeholder="Message..."
//                       className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm"
//                     />
//                     <button className="material-icons text-blue-500">send</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";

// export default function InstagramPosts() {
//   const [mediaDetails, setMediaDetails] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("moderation");
//   const [subTab, setSubTab] = useState("setup");
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [messageType, setMessageType] = useState("textMessage");
//   const [replyMessage, setReplyMessage] = useState("");
//   const [savedMessage, setSavedMessage] = useState("");
//   const [templateImage, setTemplateImage] = useState(null);
//   const [buttons, setButtons] = useState([{ name: "", url: "" }]);
//   const [templateTitle, setTemplateTitle] = useState("");
//   const [templateDescription, setTemplateDescription] = useState("");

//   useEffect(() => {
//     const fetchMediaDetails = async () => {
//       try {
//         const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
//         const igUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

//         const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;
//         const mediaIdsResponse = await fetch(mediaIdsUrl);
//         const mediaIdsData = await mediaIdsResponse.json();

//         if (mediaIdsData.error) {
//           setError(`Error: ${mediaIdsData.error.message}`);
//           return;
//         }

//         const mediaIds = mediaIdsData.data.map((media) => media.id);
//         const detailsResponse = await fetch("/api/instagram/media-details", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mediaIds }),
//         });

//         const detailsData = await detailsResponse.json();
//         if (detailsData.error) {
//           setError(`Error: ${detailsData.error}`);
//           return;
//         }

//         setMediaDetails(detailsData);
//       } catch (err) {
//         setError("Failed to fetch media details");
//       }
//     };

//     fetchMediaDetails();
//   }, []);

//   const openModal = (media) => {
//     setSelectedMedia(media);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMedia(null);
//   };

//   const handleSaveMessage = () => {
//     setSavedMessage(replyMessage);
//   };

//   const handleAddButton = () => {
//     if (buttons.length < 3) {
//       setButtons([...buttons, { name: "", url: "" }]);
//     }
//   };

//   const handleRemoveButton = (index) => {
//     if (buttons.length > 1) {
//       setButtons(buttons.filter((_, i) => i !== index));
//     }
//   };

//   const handleButtonChange = (index, field, value) => {
//     const updatedButtons = [...buttons];
//     updatedButtons[index][field] = value;
//     setButtons(updatedButtons);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Instagram Posts</h1>

//       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
//         {mediaDetails.map((media) =>
//           media.error ? (
//             <div key={media.id} className="text-red-500 font-semibold text-center">
//               Error loading media {media.id}: {media.error.message}
//             </div>
//           ) : (
//             <div key={media.id} className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105">
//               <img
//                 src={media.media_type === "VIDEO" ? media.thumbnail_url : media.media_url}
//                 alt="Instagram Media"
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <p className="font-semibold text-lg text-gray-700 mb-2 truncate">
//                   {media.caption ? `${media.caption.slice(0, 30)}...` : "No caption"}
//                 </p>
//                 <button
//                   onClick={() => openModal(media)}
//                   className="inline-flex items-center justify-center w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors duration-300"
//                 >
//                   <span className="material-icons mr-2">link</span> View Details
//                 </button>
//               </div>
//             </div>
//           )
//         )}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl p-8 relative shadow-2xl transform transition-transform duration-500 ease-in-out">
//             <button
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
//               onClick={closeModal}
//             >
//               <span className="material-icons text-3xl">close</span>
//             </button>

//             <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
//               <div className="w-full lg:w-2/3">
//                 <div className="flex space-x-8 border-b pb-4 mb-6">
//                   <button
//                     className={`font-semibold text-lg ${
//                       activeTab === "moderation" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveTab("moderation")}
//                   >
//                     Comment Moderation
//                   </button>
//                   <button
//                     className={`font-semibold text-lg ${
//                       activeTab === "automation" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveTab("automation")}
//                   >
//                     Message Automation
//                   </button>
//                 </div>

//                 {activeTab === "moderation" && (
//                   <div className="flex space-x-6 border-b pb-4 mb-6">
//                     {["setup", "trigger", "settings"].map((tab) => (
//                       <button
//                         key={tab}
//                         className={`text-sm font-semibold ${
//                           subTab === tab ? "text-blue-600" : "text-gray-400"
//                         }`}
//                         onClick={() => setSubTab(tab)}
//                       >
//                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 <div className="overflow-y-auto max-h-[450px] pr-2">
//                   {activeTab === "moderation" && subTab === "setup" && (
//                     <div className="space-y-6">
//                       <div className="flex space-x-10 items-center">
//                         <label className="flex items-center space-x-2">
//                           <input
//                             type="radio"
//                             name="messageType"
//                             value="textMessage"
//                             checked={messageType === "textMessage"}
//                             onChange={() => setMessageType("textMessage")}
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                           />
//                           <span className="text-gray-800 font-medium">Text Message</span>
//                         </label>
//                         <label className="flex items-center space-x-2">
//                           <input
//                             type="radio"
//                             name="messageType"
//                             value="templateMessage"
//                             checked={messageType === "templateMessage"}
//                             onChange={() => setMessageType("templateMessage")}
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                           />
//                           <span className="text-gray-800 font-medium">Template Message</span>
//                         </label>
//                       </div>

//                       {messageType === "textMessage" && (
//                         <div className="space-y-4">
//                           <label className="block text-gray-800 font-semibold">
//                             Enter Reply Message:
//                           </label>
//                           <textarea
//                             rows="4"
//                             className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Type your reply message here..."
//                             value={replyMessage}
//                             onChange={(e) => setReplyMessage(e.target.value)}
//                           ></textarea>
//                           <button
//                             onClick={handleSaveMessage}
//                             className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
//                           >
//                             Save Message
//                           </button>
//                         </div>
//                       )}

//                       {messageType === "templateMessage" && (
//                         <div className="space-y-4">
//                           <label className="block text-gray-800 font-semibold">Upload Image</label>
//                           <input
//                             type="file"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
//                             onChange={(e) => setTemplateImage(e.target.files[0])}
//                           />

//                           {buttons.map((button, index) => (
//                             <div key={index} className="flex items-center space-x-4">
//                               <input
//                                 type="text"
//                                 placeholder="Button Name"
//                                 className="flex-1 border border-gray-300 rounded-lg p-2"
//                                 value={button.name}
//                                 onChange={(e) =>
//                                   handleButtonChange(index, "name", e.target.value)
//                                 }
//                               />
//                               <input
//                                 type="url"
//                                 placeholder="Button URL"
//                                 className="flex-[2] border border-gray-300 rounded-lg p-2"
//                                 value={button.url}
//                                 onChange={(e) =>
//                                   handleButtonChange(index, "url", e.target.value)
//                                 }
//                               />
//                               {buttons.length > 1 && (
//                                 <button
//                                   onClick={() => handleRemoveButton(index)}
//                                   className="text-red-500 font-semibold hover:text-red-700"
//                                 >
//                                   Remove
//                                 </button>
//                               )}
//                             </div>
//                           ))}

//                           {buttons.length < 3 && (
//                             <button
//                               onClick={handleAddButton}
//                               className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 mt-2"
//                             >
//                               Add Button
//                             </button>
//                           )}

//                           <label className="block text-gray-800 font-semibold mt-4">Template Title</label>
//                           <input
//                             type="text"
//                             placeholder="Enter template title"
//                             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={templateTitle}
//                             onChange={(e) => setTemplateTitle(e.target.value)}
//                           />

//                           <label className="block text-gray-800 font-semibold mt-4">Description</label>
//                           <textarea
//                             rows="3"
//                             placeholder="Enter description"
//                             className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={templateDescription}
//                             onChange={(e) => setTemplateDescription(e.target.value)}
//                           ></textarea>

//                           <button
//                             onClick={handleSaveMessage}
//                             className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 mt-6"
//                           >
//                             Save Template
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Modal Right Content: Interactive Mobile Preview */}
//               <div className="w-full lg:w-1/3 flex flex-col items-center bg-gray-50 border rounded-lg p-6">
//                 <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
//                   <div className="bg-white w-full h-full rounded-[2rem] flex flex-col justify-between overflow-hidden">
//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-b">
//                       <img
//                         src="icons8-male-user-50.png"
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span className="font-semibold">Username</span>
//                     </div>

//                     <div className="flex flex-1 justify-end p-4 items-end">
//                       <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-2 mr-2 self-end">
//                         {replyMessage || "Thank you for Commenting!"}
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-t">
//                       <input
//                         type="text"
//                         placeholder="Message..."
//                         className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                       <button className="material-icons text-blue-500">send</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function InstagramPosts() {
  const [mediaDetails, setMediaDetails] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("moderation");
  const [subTab, setSubTab] = useState("setup");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [messageType, setMessageType] = useState("textMessage");
  const [replyMessage, setReplyMessage] = useState("");
  const [templateImage, setTemplateImage] = useState(null);
  const [buttons, setButtons] = useState([{ name: "Website", url: "" }]);
  const [templateTitle, setTemplateTitle] = useState("Template Title");
  const [templateDescription, setTemplateDescription] = useState(
    "Description goes here."
  );
  const [triggerType, setTriggerType] = useState("keywords");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [excludeKeywords, setExcludeKeywords] = useState([]);
  const [excludeKeywordInput, setExcludeKeywordInput] = useState("");
  const [excludeKeywordsEnabled, setExcludeKeywordsEnabled] = useState(false);
  const [sendReplyPerPost, setSendReplyPerPost] = useState(false);
  const [excludeMentions, setExcludeMentions] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [mentionInput, setMentionInput] = useState("");

  const [autoCommentEnabled, setAutoCommentEnabled] = useState(false);
  const [replyComments, setReplyComments] = useState([""]); // Start with one reply comment
  const [delayMessage, setDelayMessage] = useState("1");

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
        const igUserId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

        const mediaIdsUrl = `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${accessToken}`;
        const mediaIdsResponse = await fetch(mediaIdsUrl);
        const mediaIdsData = await mediaIdsResponse.json();

        if (mediaIdsData.error) {
          setError(`Error: ${mediaIdsData.error.message}`);
          return;
        }

        const mediaIds = mediaIdsData.data.map((media) => media.id);
        const detailsResponse = await fetch("/api/instagram/media-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaIds }),
        });

        const detailsData = await detailsResponse.json();
        console.log(detailsData)
        if (detailsData.error) {
          setError(`Error: ${detailsData.error}`);
          return;
        }

        setMediaDetails(detailsData);
      } catch (err) {
        setError("Failed to fetch media details");
      }
    };

    fetchMediaDetails();
  }, []);

  const openModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  const handleAddButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, { name: "", url: "" }]);
    }
  };

  const handleRemoveButton = (index) => {
    if (buttons.length > 1) {
      setButtons(buttons.filter((_, i) => i !== index));
    }
  };

  const handleButtonChange = (index, field, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index][field] = value;
    setButtons(updatedButtons);
  };

  const handleTemplateMessageSelect = () => {
    setMessageType("templateMessage");
    setTemplateTitle("Template Title");
    setTemplateDescription("Description goes here.");
    setButtons([{ name: "Website", url: "" }]);
    setTemplateImage(null);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleAddExcludeKeyword = () => {
    if (excludeKeywordInput.trim()) {
      setExcludeKeywords([...excludeKeywords, excludeKeywordInput.trim()]);
      setExcludeKeywordInput("");
    }
  };

  const handleRemoveExcludeKeyword = (index) => {
    setExcludeKeywords(excludeKeywords.filter((_, i) => i !== index));
  };

  const handleAddMention = () => {
    if (mentionInput.trim()) {
      setMentions([...mentions, mentionInput.trim()]);
      setMentionInput("");
    }
  };

  const handleRemoveMention = (index) => {
    setMentions(mentions.filter((_, i) => i !== index));
  };

  const handleSaveTextMessage = () => {
    alert(`Text message saved: ${replyMessage}`);
  };

  const handleSaveTemplateMessage = () => {
    alert(
      `Template saved with title: ${templateTitle} and description: ${templateDescription}`
    );
  };

  const handleSaveTriggerSettings = () => {
    alert("Trigger settings saved successfully!");
  };

  const handleAddReplyComment = () => {
    if (replyComments.length < 5) {
      setReplyComments([...replyComments, ""]);
    }
  };

  const handleRemoveReplyComment = (index) => {
    if (replyComments.length > 1) {
      setReplyComments(replyComments.filter((_, i) => i !== index));
    }
  };

  const handleReplyCommentChange = (index, value) => {
    const updatedComments = [...replyComments];
    updatedComments[index] = value;
    setReplyComments(updatedComments);
  };

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Instagram Posts
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
        {mediaDetails.map((media) =>
          media.error ? (
            <div
              key={media.id}
              className="text-red-500 font-semibold text-center"
            >
              Error loading media {media.id}: {media.error.message}
            </div>
          ) : (
            <div
              key={media.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={
                  media.media_type === "VIDEO"
                    ? media.thumbnail_url
                    : media.media_url
                }
                alt="Instagram Media"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="font-semibold text-lg text-gray-700 mb-2 truncate">
                  {media.caption
                    ? `${media.caption.slice(0, 30)}...`
                    : "No caption"}
                </p>
                <button
                  onClick={() => openModal(media)}
                  className="inline-flex items-center justify-center w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors duration-300"
                >
                  <span className="material-icons mr-2">link</span> View Details
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl p-8 relative shadow-2xl transform transition-transform duration-500 ease-in-out">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={closeModal}
            >
              <span className="material-icons text-3xl">close</span>
            </button>

            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="w-full lg:w-2/3">
                <div className="flex space-x-8 border-b pb-4 mb-6">
                  <button
                    className={`font-semibold text-lg ${
                      activeTab === "moderation"
                        ? "text-blue-600 border-b-4 border-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("moderation")}
                  >
                    Comment Moderation
                  </button>
                </div>

                {activeTab === "moderation" && (
                  <div className="flex space-x-6 border-b pb-4 mb-6">
                    {["setup", "trigger", "settings"].map((tab) => (
                      <button
                        key={tab}
                        className={`text-sm font-semibold ${
                          subTab === tab ? "text-blue-600" : "text-gray-400"
                        }`}
                        onClick={() => setSubTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                <div className="overflow-y-auto max-h-[450px] pr-2">
                  {activeTab === "moderation" && subTab === "setup" && (
                    <div className="space-y-6">
                      <div className="flex space-x-10 items-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="messageType"
                            value="textMessage"
                            checked={messageType === "textMessage"}
                            onChange={() => setMessageType("textMessage")}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-800 font-medium">
                            Text Message
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="messageType"
                            value="templateMessage"
                            checked={messageType === "templateMessage"}
                            onChange={handleTemplateMessageSelect}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-800 font-medium">
                            Template Message
                          </span>
                        </label>
                      </div>

                      {messageType === "textMessage" && (
                        <div className="space-y-4">
                          <label className="block text-gray-800 font-semibold">
                            Enter Reply Message:
                          </label>
                          <textarea
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your reply message here..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                          ></textarea>
                          <button
                            onClick={handleSaveTextMessage}
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
                          >
                            Save Message
                          </button>
                        </div>
                      )}

                      {messageType === "templateMessage" && (
                        <div className="space-y-4">
                          <label className="block text-gray-800 font-semibold">
                            Upload Image
                          </label>
                          <input
                            type="file"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                            onChange={(e) =>
                              setTemplateImage(
                                URL.createObjectURL(e.target.files[0])
                              )
                            }
                          />

                          {buttons.map((button, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-4"
                            >
                              <input
                                type="text"
                                placeholder="Button Name"
                                className="flex-1 border border-gray-300 rounded-lg p-2"
                                value={button.name}
                                onChange={(e) =>
                                  handleButtonChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="url"
                                placeholder="Button URL"
                                className="flex-[2] border border-gray-300 rounded-lg p-2"
                                value={button.url}
                                onChange={(e) =>
                                  handleButtonChange(
                                    index,
                                    "url",
                                    e.target.value
                                  )
                                }
                              />
                              {buttons.length > 1 && (
                                <button
                                  onClick={() => handleRemoveButton(index)}
                                  className="text-red-500 font-semibold hover:text-red-700"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}

                          {buttons.length < 3 && (
                            <button
                              onClick={handleAddButton}
                              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 mt-2"
                            >
                              Add Button
                            </button>
                          )}

                          <label className="block text-gray-800 font-semibold mt-4">
                            Template Title
                          </label>
                          <input
                            type="text"
                            placeholder="Enter template title"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={templateTitle}
                            onChange={(e) => setTemplateTitle(e.target.value)}
                          />

                          <label className="block text-gray-800 font-semibold mt-4">
                            Description
                          </label>
                          <textarea
                            rows="3"
                            placeholder="Enter description"
                            className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={templateDescription}
                            onChange={(e) =>
                              setTemplateDescription(e.target.value)
                            }
                          ></textarea>

                          <button
                            onClick={handleSaveTemplateMessage}
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 mt-4"
                          >
                            Save Template
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[450px] pr-2">
                  {activeTab === "moderation" && subTab === "trigger" && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <label className="text-lg font-medium text-gray-700">
                          Trigger Type:
                        </label>
                        <select
                          value={triggerType}
                          onChange={(e) => setTriggerType(e.target.value)}
                          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="keywords">Keywords</option>
                          <option value="allComment">All Comments</option>
                          <option value="emojis">Emojis</option>
                          <option value="mentions">@Mentions</option>
                        </select>
                      </div>

                      {/* Keywords Section */}
                      {triggerType === "keywords" && (
                        <div className="space-y-4">
                          <label className="block text-lg font-medium text-gray-700">
                            Trigger Keywords
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Enter keyword"
                              value={keywordInput}
                              onChange={(e) => setKeywordInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddKeyword();
                                }
                              }}
                              className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={handleAddKeyword}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap space-x-2 space-y-2 mt-2">
                            {keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium space-x-2"
                              >
                                <span>{keyword}</span>
                                <button
                                  onClick={() => handleRemoveKeyword(index)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Checkboxes Section */}
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={sendReplyPerPost}
                            onChange={(e) =>
                              setSendReplyPerPost(e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="text-gray-700">
                            Send a reply to a user per post
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={excludeKeywordsEnabled}
                            onChange={(e) =>
                              setExcludeKeywordsEnabled(e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="text-gray-700">
                            Exclude Keywords
                          </label>
                        </div>

                        {excludeKeywordsEnabled && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Enter exclude keyword"
                                value={excludeKeywordInput}
                                onChange={(e) =>
                                  setExcludeKeywordInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddExcludeKeyword();
                                  }
                                }}
                                className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={handleAddExcludeKeyword}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap space-x-2 space-y-2 mt-2">
                              {excludeKeywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium space-x-2"
                                >
                                  <span>{keyword}</span>
                                  <button
                                    onClick={() =>
                                      handleRemoveExcludeKeyword(index)
                                    }
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={excludeMentions}
                            onChange={(e) =>
                              setExcludeMentions(e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="text-gray-700">
                            Exclude Mentions
                          </label>
                        </div>

                        {excludeMentions && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Enter mention to exclude"
                                value={mentionInput}
                                onChange={(e) =>
                                  setMentionInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddMention();
                                  }
                                }}
                                className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={handleAddMention}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap space-x-2 space-y-2 mt-2">
                              {mentions.map((mention, index) => (
                                <span
                                  key={index}
                                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium space-x-2"
                                >
                                  <span>{mention}</span>
                                  <button
                                    onClick={() => handleRemoveMention(index)}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Save Trigger Settings Button */}
                      <div className="mt-6">
                        <button
                          onClick={handleSaveTriggerSettings}
                          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                          Save Trigger Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[450px] pr-2">
                  {/* Settings Tab Content */}
                  {activeTab === "moderation" && subTab === "settings" && (
                    <div className="space-y-6">
                      {/* Toggle for Auto Comment */}
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={autoCommentEnabled}
                          onChange={() =>
                            setAutoCommentEnabled(!autoCommentEnabled)
                          }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Auto Comment
                        </span>
                      </label>

                      {/* Dynamic Reply Comments */}
                      {autoCommentEnabled && (
                        <div className="space-y-4">
                          {replyComments.map((comment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                placeholder={`Reply Comment #${index + 1}`}
                                value={comment}
                                onChange={(e) =>
                                  handleReplyCommentChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {replyComments.length > 1 && (
                                <button
                                  onClick={() => handleRemoveReplyComment(index)}
                                  className="text-red-500 font-semibold hover:text-red-700"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add Comment Button */}
                          {replyComments.length < 5 && (
                            <button
                              onClick={handleAddReplyComment}
                              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 mt-2"
                            >
                              Add Another Reply Comment
                            </button>
                          )}
                        </div>
                      )}

                      {/* Delay Message Select */}
                      <div className="mt-6">
                        <label className="block text-lg font-medium text-gray-700">
                          Delay Message
                        </label>
                        <select
                          value={delayMessage}
                          onChange={(e) => setDelayMessage(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1">1 minute</option>
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes</option>
                        </select>
                      </div>

                      {/* Save Settings Button */}
                      <div className="mt-6">
                        <button
                          onClick={handleSaveSettings}
                          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                          Save Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Right Content: Interactive Mobile Preview */}
              <div className="w-full lg:w-1/3 flex flex-col items-center bg-gray-50 border rounded-lg p-6">
                <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
                  <div className="bg-white w-full h-full rounded-[2rem] flex flex-col justify-between overflow-hidden">
                    <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-b">
                      <img
                        src="icons8-male-user-50.png"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-semibold">Username</span>
                    </div>

                    {/* Body section for message or template preview */}
                    <div className="flex-1 flex items-end justify-start p-4">
                      {messageType === "templateMessage" ? (
                        <div className="w-64 border rounded-lg p-4 bg-white shadow-lg">
                          {" "}
                          {/* Card styling */}
                          <img
                            src={
                              templateImage ||
                              "https://via.placeholder.com/150?text=Upload+Image"
                            }
                            alt="Template Preview"
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                          <h2 className="font-semibold text-lg text-gray-800">
                            {templateTitle}
                          </h2>
                          <p className="text-gray-600 text-sm mt-2">
                            {templateDescription}
                          </p>
                          <div className="mt-4 space-y-2">
                            {buttons.map((button, index) => (
                              <a
                                key={index}
                                href={button.url}
                                className="block text-blue-500 font-semibold bg-blue-100 px-4 py-2 rounded-full text-center"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {button.name || "Website"}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full mb-2">
                          {replyMessage || "Thank you for Commenting!"}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 w-full p-4 flex items-center space-x-2 border-t">
                      <input
                        type="text"
                        placeholder="Message..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="material-icons text-blue-500">
                        send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
