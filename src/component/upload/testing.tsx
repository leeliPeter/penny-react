// import React, { useState } from "react";
// import { useAppSelector } from "../../redux/hooks";
// import afterUpload from "../../hook/afterUpload";
// import imageCompression from "browser-image-compression"; // Import the image compression library
// import "./Upload.css";

// export default function Upload() {
//   const user = useAppSelector((state) => state.user); // Get the user state
//   const { fetchUserProfile } = afterUpload(); // Use the custom hook to fetch user profile
//   const [image, setImage] = useState<File | null>(null); // State to manage the uploaded image
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState<string | null>(null); // Error state

//   // Compress the image before uploading
//   const compressImage = async (file: File) => {
//     const options = {
//       maxSizeMB: 1, // Maximum size of 1MB
//       maxWidthOrHeight: 1024, // Maximum width or height of 1024px
//       useWebWorker: true, // Use Web Worker for performance
//     };

//     try {
//       const compressedFile = await imageCompression(file, options); // Compress the image
//       return compressedFile;
//     } catch (error) {
//       console.error("Image compression error:", error);
//       throw error;
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!image) {
//       alert("Please select an image to upload.");
//       return;
//     }

//     setLoading(true); // Start loading
//     setError(null); // Clear any previous errors

//     try {
//       // Compress the image before uploading
//       const compressedImage = await compressImage(image);

//       const formData = new FormData();
//       formData.append("uploaded_file", compressedImage); // Use the compressed image
//       formData.append("userId", user.id); // Append user ID to the form data

//       const response = await fetch("http://localhost:3000/upload/profile", {
//         method: "POST",
//         body: formData,
//         credentials: "include", // Include credentials for session management
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text(); // Get error message from the response
//         throw new Error(`Error: ${response.status} - ${errorMessage}`);
//       }

//       const { imageName } = await response.json(); // Get the image name from the response
//       alert(`Image uploaded successfully! Filename: ${imageName}`);

//       // After successful upload, fetch the updated user profile
//       await fetchUserProfile();
//     } catch (error) {
//       console.error("Upload error:", error);
//       setError("Failed to upload image");
//     } finally {
//       setLoading(false); // Stop loading after the request finishes
//     }
//   };

//   // Handle file selection
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] || null; // Get the selected file
//     setImage(file); // Update the state
//   };

//   return (
//     <div className="upload">
//       <div className="container">
//         <h2>Upload Image</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="file"
//             accept="image/*"
//             id="fileInput"
//             onChange={handleFileChange} // Add onChange handler
//             disabled={loading} // Disable input while loading
//           />
//           {error && <p className="error-message">{error}</p>}{" "}
//           {/* Display error if any */}
//           <div className="preview-container" id="previewContainer">
//             {image && ( // Render the image if it exists
//               <img
//                 src={URL.createObjectURL(image)} // Use createObjectURL for preview
//                 alt="Image Preview"
//                 id="imagePreview"
//                 className="preview-image"
//               />
//             )}
//           </div>
//           <button type="submit" disabled={loading}>
//             {loading ? "Uploading..." : "Upload"}
//           </button>
//         </form>
//       </div>
//       <div className="container"></div>
//     </div>
//   );
// }
