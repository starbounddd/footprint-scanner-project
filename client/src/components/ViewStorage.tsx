import React from "react";
import { ViewStorageProps } from "../types";

export function ViewStorage(props: ViewStorageProps) {
  const { storedImages, setStoredImages } = props;

  const handleDeleteImage = (imageName: string) => {
    setStoredImages((prev) =>
      prev.filter((image) => image.imageName !== imageName)
    );
    localStorage.setItem(
      "storedImages",
      JSON.stringify(storedImages.filter((image) => image.imageName !== imageName))
    );
  };

  return (
    <div className="view-storage">
      <h2>Stored Images</h2>
      {storedImages.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Image Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storedImages.map((image) => (
              <tr key={image.imageName}>
                <td>{image.imageName}</td>
                <td>
                  <img src={image.imageUrl} alt={image.imageName} width="100" />
                </td>
                <td>
                  <button onClick={() => handleDeleteImage(image.imageName)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No images stored.</p>
      )}
  
    </div>
  );
}