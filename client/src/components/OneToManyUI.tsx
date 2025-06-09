import React, { useRef, useState } from "react";
import "../styles/index.css";
import "../styles/components.css";
import { AppMode } from "../types";
import { ControlPanelProps } from "../types";

export function OneToManyUI(props: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fingerprintImageOne, setFingerprintImageOne] = useState<File | null>(
    null
  );
  const [imageOneName, setImageOneName] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFingerprintImageOne(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // You may want to use formData and actually upload the file here
      const loadImages = await fetch(`http://localhost:6464/?AddT`);
      const data = await loadImages.json();
      console.log("Data:", data);
    } catch (error) {
      alert("Error loading images: " + error);
    }
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
        Add Image To Storage
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
      </div>
    </form>
  );
}
