import React from "react";
import { useState } from "react";
import "../styles/index.css";

import "./DisplayArea"
import DisplayArea from "./DisplayArea";
import ScannerResults from "./ScannerResults";

export function ControlPanel() {
    const [fingerprintImageOne, setFingerprintImageOne] = useState("");
    const [fingerprintImageTwo, setFingerprintImageTwo] = useState("");
    const [imageOne, setImageOne] = useState("");
    const [imageTwo, setImageTwo] = useState("");
    const [imagesLoaded, setImagesLoaded] = useState(false);


    const handleSubmit = async  (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const loadImages = await fetch(`http://localhost:6464/loadimage?imagePath1=${fingerprintImageOne}&imagePath2=${fingerprintImageTwo}`);
            const data = await loadImages.json();
            console.log("Data:", data);
            try {
                    const displayImage = await fetch(`http://localhost:6464/viewimage`);
                    const displayImageTwo = await fetch(`http://localhost:6464/viewimage2`);
                    const imageData = await displayImage.blob();
                    const imageDataTwo = await displayImageTwo.blob();


                    const imageUrl = URL.createObjectURL(imageData);
                    const imageUrlTwo = URL.createObjectURL(imageDataTwo);
                    setImageOne(imageUrl);
                    setImageTwo(imageUrlTwo);
                    setImagesLoaded(true);
                    console.log("Image URL:", imageUrl);
                    console.log("Image URL Two:", imageUrlTwo);
            }
         catch (error) {
            alert("Error loading images: " + error);
        }

    }
        catch (error) {
            alert("Error loading images: " + error);
        }
    };

  return (
    <form onSubmit={handleSubmit}
    className="left-control-panel">
      <div className="control-panel-header">
        <h2>Control Panel</h2>
      </div>
      <div className="control-panel-body"> </div>
      <label htmlFor="fingerprintImageOne" aria-label="Fingerprint Image One">
        Fingerprint Image One
      </label>
      <input
        type="text"
        id="fprintImageOne"
        name="fprintImageOne"
        placeholder="Fingerprint Image One"
        aria-label="Fingerprint Image One"
        value={fingerprintImageOne}
        onChange={(e) => setFingerprintImageOne(e.target.value)}
      />
        <label htmlFor="fingerprintImageTwo" aria-label="Fingerprint Image Two">
            Fingerprint Image Two
        </label>
        <input
            type="text"
            id="fprintImageTwo"
            name="fprintImageTwo"
            placeholder="Fingerprint Image Two"
            aria-label="Fingerprint Image Two"
            value={fingerprintImageTwo}
            onChange={(e) => setFingerprintImageTwo(e.target.value)}
        />

        <button type="submit" className="submit-button">
            Submit
        </button>

        <div className="control-panel-footer">
            <h3>Control Panel Footer</h3>
        </div>
        <div className="image-container">
            {imagesLoaded && <DisplayArea imageOne={imageOne} imageTwo={imageTwo} />}
        </div>
        <div className= "results-container">
            {imagesLoaded && <ScannerResults />}
        </div>

        

    </form>
  );
}
