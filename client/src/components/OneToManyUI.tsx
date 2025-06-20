import React, { useEffect, useRef, useState } from "react";
// import "../styles/index.css";
// import "../styles/components.css";
import { AppMode } from "../types";
import { ControlPanelProps } from "../types";
import { timeStamp } from "console";
import { initializeApp } from "firebase/app";
import "../styles/oneToManyUI.css";
import { ImageData } from "../types";
import { ViewStorage } from "./ViewStorage";

export function OneToManyUI(props: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fingerprintImageOne, setFingerprintImageOne] = useState<File | null>(
    null
  );
  const [isImageStored, setIsImageStored] = useState(false);

  const [imageOneName, setImageOneName] = useState("");
  const [storedImages, setStoredImages] = useState<ImageData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("Selected files:", event.target.files);
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("storedImages")) {
      localStorage.setItem("storedImages", JSON.stringify([]));
      setStoredImages([]); // Only set once on mount
    } else {
      const storedImagesFromLocalStorage = localStorage.getItem("storedImages");
      if (storedImagesFromLocalStorage) {
        setStoredImages(JSON.parse(storedImagesFromLocalStorage));
      }
    }
    // eslint-disable-next-line
  }, []); // Only run on mount

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("imageName", file.name);
        formData.append("timeStamp", new Date().toISOString());

        const response = await fetch(`http://localhost:6464/loadToStorage`, {
          method: "POST",
          body: formData,
        });
        let data = await response.json();
        try {
          
        } catch (jsonError) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          alert(
            "Server did not return JSON. Check backend logs.\nResponse: " + text
          );
          continue;
        }
        if (data.status === "success") {
          setStoredImages((prev) => [
            ...prev,
            {
              imageName: file.name,
              imageUrl: data.url,
            },
          ]);
          localStorage.setItem(
            "storedImages",
            JSON.stringify([
              ...storedImages,
              {
                imageName: file.name,
                imageUrl: data.url,
              },
            ])
          );
        } else {
          alert("Error uploading image: " + (data.message || "Unknown error"));
        }
        // Remove file and metadata for next iteration
        formData.delete("file");
        formData.delete("imageName");
        formData.delete("timeStamp");
      }
    } catch (error) {
      alert("Error uploading images: " + error);
    }
  };

  return (
    <div className="main-panel-container">
      <form onSubmit={handleSubmit} className="left-control-panel">
        <div className="control-panel-header">
          <h2>Control Panel</h2>
          <div className="mode-toggle">
            <button
              type="button"
              onClick={() => props.setMode(AppMode.ONE_TO_ONE)}
            >
              One-to-One
            </button>
            <button
              type="button"
              onClick={() => props.setMode(AppMode.ONE_TO_MANY)}
            >
              One-to-Many
            </button>
          </div>
        </div>
        <div className="control-panel-body"> </div>
        <label htmlFor="fingerprintImageOne" aria-label="Fingerprint Image One">
          Choose Image To Add To Storage
        </label>
        {/* @ts-ignore: webkitdirectory is a non-standard attribute but supported by browsers */}
        <input
          type="file"
          id="fprintImageOne"
          name="fprintImageOne"
          placeholder="Fingerprint Image One"
          aria-label="Fingerprint Image One"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          // @ts-ignore
          webkitdirectory="true"
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
        <div className="control-panel-footer">
          <h3>Control Panel Footer</h3>
        </div>
      </form>
      <ViewStorage
        storedImages={storedImages}
        setStoredImages={setStoredImages}
        isImageStored={storedImages.length > 0}
      />
    </div>
  );
}
