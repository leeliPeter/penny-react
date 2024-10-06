import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import "./ShowImage.css"; // Assuming styles are in this file

const ShowImage: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const [dogImage, setDogImage] = useState<string | null>(null); // State for dog image
  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data) => {
        setDogImage(data.message); // Set the dog image URL
      })
      .catch((error) => {
        console.error("Dog image fetch error:", error);
      });
  }, []); // Add any side effect code here
  return (
    <main>
      <div className="container">
        <div className="images">
          {dogImage && <img src={dogImage} alt="Dog" />}{" "}
          {/* Render the dog image */}
          {
            user.image &&
              user.image.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} />
              )) // Render all images from user state
          }
        </div>
      </div>
    </main>
  );
};

export default ShowImage;
