import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import afterUpload from "../../hook/afterUpload";
import imageCompression from "browser-image-compression"; // Import the image compression library
import url from "../../type/constant";
import "./Upload.css";

export default function Upload() {
  const user = useAppSelector((state) => state.user); // Get the user state
  const { fetchUserProfile } = afterUpload(); // Use the custom hook to fetch user profile
  const [image, setImage] = useState<File | null>(null); // State for single image upload
  const [images, setImages] = useState<File[]>([]); // State for multiple images upload
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Compress the image before uploading
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1, // Maximum size of 1MB
      maxWidthOrHeight: 400, // Maximum width or height of 1024px
      useWebWorker: true, // Use Web Worker for performance
    };

    try {
      const compressedFile = await imageCompression(file, options); // Compress the image
      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
      throw error;
    }
  };

  const handleSingleImageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      // Compress the image before uploading
      const compressedImage = await compressImage(image);

      const formData = new FormData();
      formData.append("uploaded_file", compressedImage); // Use the compressed image
      formData.append("userId", user.id); // Append user ID to the form data

      const response = await fetch(`${url}/upload/profile`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include credentials for session management
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message from the response
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      const { imageName } = await response.json(); // Get the image name from the response
      alert(`Image uploaded successfully! Filename: ${imageName}`);

      // After successful upload, fetch the updated user profile
      await fetchUserProfile();
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image");
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  const handleMultipleImagesSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (images.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const formData = new FormData();

      // Compress and append each image to form data
      for (const image of images) {
        const compressedImage = await compressImage(image);
        formData.append("uploaded_files", compressedImage); // Use the compressed image
      }
      formData.append("userId", user.id); // Append user ID to the form data

      const response = await fetch(`${url}/upload/multiple`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include credentials for session management
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message from the response
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      const { images: uploadedImages } = await response.json(); // Get the uploaded images from the response
      alert(
        `Images uploaded successfully! Filenames: ${uploadedImages.join(", ")}`
      );

      // After successful upload, fetch the updated user profile
      await fetchUserProfile();
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload images");
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  // Handle file selection for single image
  const handleSingleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null; // Get the selected file
    setImage(file); // Update the state
  };

  // Handle file selection for multiple images
  const handleMultipleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []); // Get the selected files
    setImages(files); // Update the state with selected files
  };

  return (
    <div className="upload">
      <div className="container">
        <div className="upload-container">
          <h2>Upload Profile Image</h2>
          <form onSubmit={handleSingleImageSubmit}>
            <input
              type="file"
              accept="image/*"
              id="singleFileInput"
              onChange={handleSingleFileChange} // Add onChange handler
              disabled={loading} // Disable input while loading
            />
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Display error if any */}
            <div className="preview-container" id="previewContainer">
              {image && ( // Render the image if it exists
                <img
                  src={URL.createObjectURL(image)} // Use createObjectURL for preview
                  alt="Image Preview"
                  id="imagePreview"
                  className="preview-image"
                />
              )}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
        <div className="upload-container">
          <h2>Upload Multiple Images</h2>
          <form onSubmit={handleMultipleImagesSubmit}>
            <input
              type="file"
              accept="image/*"
              id="multipleFileInput"
              onChange={handleMultipleFileChange} // Add onChange handler
              multiple // Allow multiple file selection
              disabled={loading} // Disable input while loading
            />
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Display error if any */}
            <div className="preview-container" id="previewContainerMultiple">
              {images.map(
                (
                  image,
                  index // Render previews for all selected images
                ) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)} // Use createObjectURL for preview
                    alt={`Image Preview ${index + 1}`}
                    className="preview-image"
                  />
                )
              )}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
