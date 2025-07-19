import React from "react";
import { useState, useRef } from "react";
import "../styles/index.css";
import "../styles/components.css";

import DisplayArea from "./DisplayArea";
import ScannerResults from "./ScannerResults";
import { AppMode } from "../types";
import { ControlPanelProps } from "../types";
import { OneToManyUI } from "./OneToManyUI";

function FlaskOrbMatcher() {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInput1 = useRef<HTMLInputElement>(null);
  const fileInput2 = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image1 || !image2) {
      alert("Please select two images.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);
    try {
      const response = await fetch("http://localhost:5000/orb-match", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setScore(data.similarity_score);
    } catch (err) {
      alert("Error contacting Flask server: " + err);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="left-control-panel">
      <div className="control-panel-header">
        <h2>Flask ORB Matcher</h2>
      </div>
      <div className="control-panel-body">
        <label>Image 1:</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInput1}
          onChange={(e) => setImage1(e.target.files ? e.target.files[0] : null)}
        />
        <label>Image 2:</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInput2}
          onChange={(e) => setImage2(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Comparing..." : "Run ORB Match (Flask)"}
        </button>
        {score !== null && (
          <div style={{ marginTop: "10px" }}>
            <strong>Similarity Score:</strong> {score}
          </div>
        )}
      </div>
    </form>
  );
}

export function ControlPanel(props: ControlPanelProps) {
  const [fingerprintImageOne, setFingerprintImageOne] = useState("");
  const [fingerprintImageTwo, setFingerprintImageTwo] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [flaskMode, setFlaskMode] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const loadImages = await fetch(
        `http://localhost:6464/loadimage?imagePath1=${fingerprintImageOne}&imagePath2=${fingerprintImageTwo}`
      );
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
      } catch (error) {
        alert("Error loading images: " + error);
      }
    } catch (error) {
      alert("Error loading images: " + error);
    }
  };

  return flaskMode ? (
    <>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFlaskMode(false)} className="submit-button">
          Back to Main Panel
        </button>
      </div>
      <FlaskOrbMatcher />
    </>
  ) : (
    <>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFlaskMode(true)} className="submit-button">
          Run ORB Match (Flask)
        </button>
      </div>
      {props.mode === AppMode.ONE_TO_ONE ? (
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
          <label
            htmlFor="fingerprintImageOne"
            aria-label="Fingerprint Image One"
          >
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
          <label
            htmlFor="fingerprintImageTwo"
            aria-label="Fingerprint Image Two"
          >
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
            {imagesLoaded && (
              <DisplayArea imageOne={imageOne} imageTwo={imageTwo} />
            )}
          </div>
          <div className="results-container">
            {imagesLoaded && <ScannerResults />}
          </div>
        </form>
      ) : (
        <OneToManyUI setMode={props.setMode} mode={props.mode} />
      )}
    </>
  );
}
