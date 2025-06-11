import React from "react";
import { ViewStorageProps } from "../types";

export function ViewStorage(props: ViewStorageProps) {
  const { storedImages, setStoredImages, isImageStored } = props;

  const handleDeleteImage = (imageName: string) => {
    setStoredImages((prev) =>
      prev.filter((image) => image.imageName !== imageName)
    );
  };

  return (
    <div className="view-storage">
      <h2>Stored Images</h2>
      {isImageStored ? (
        <ul>
          {storedImages.map((image) => (
            <li key={image.imageName}>
              <img src={image.imageUrl} alt={image.imageName} />
              <p>{image.imageName}</p>
              <button onClick={() => handleDeleteImage(image.imageName)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No images stored.</p>
      )}
    </div>
  );
}