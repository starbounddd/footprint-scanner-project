import React, { useRef, useState } from "react";
import "../styles/index.css";
import "../styles/components.css";
import { AppMode } from "../types";
import { ControlPanelProps } from "../types";
import { timeStamp } from "console";
import { initializeApp } from "firebase/app";
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
  if (storedImages.length > 0) {
    setIsImageStored(true);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFingerprintImageOne(event.target.files[0]);
    }
  };



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    

    try {
      // const loadImages = await fetch(`http://localhost:6464/loadToStorage?timeStamp=${new Date().toISOString()}&imageName=${imageOneName}`, {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await loadImages.json();
      // const imageUrl = URL.createObjectURL(fingerprintImageOne as Blob);
      const imageUrl = URL.createObjectURL(fingerprintImageOne as Blob);
      const imageData: ImageData = {
        imageName: imageOneName,
        imageUrl: imageUrl,
      };
      setStoredImages((prev) => [...prev, imageData]);
      console.log("Data:", imageData);
    } catch (error) {
      alert("Error loading images: " + error);
    }
    // try {
    //     const storage = getStorage();
    //     const storageRef = ref(storage, `images/${imageOneName}_${Date.now()}`);
    //     await uploadBytes(storageRef, fingerprintImageOne as Blob);
    //     const imageUrl = await getDownloadURL(storageRef);

    //     await addDoc(collection(db, "images"), {
    //         name: imageOneName,
    //         url: imageUrl,
    //         timeStamp: new Date().toISOString(),
    //       });

    //     setStoredImages((prev) => [...prev, imageUrl]);
    // } catch (error) {
    //   alert("Error uploading image: " + error);
    // }
    
  };

  return (
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
      <input
        type="file"
        id="fprintImageOne"
        name="fprintImageOne"
        placeholder="Fingerprint Image One"
        aria-label="Fingerprint Image One"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <label htmlFor="imageOneName" aria-label="Image One Name">
        Image One Name
      </label>
      <input
        type="text"
        id="imageOneName"
        name="imageOneName"
        placeholder="Image One Name"
        aria-label="Image One Name"
        value={imageOneName}
        onChange={(e) => setImageOneName(e.target.value)}
      />
      <button type="submit" className="submit-button">
        Submit
      </button>
      <div className="control-panel-footer">
        <h3>Control Panel Footer</h3>
        <ViewStorage
          storedImages={storedImages}
          setStoredImages={setStoredImages}
          isImageStored={isImageStored}
        />
      </div>
    </form>
    
  );
}
