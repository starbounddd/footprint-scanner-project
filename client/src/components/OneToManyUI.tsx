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
  const [setProbe, setSetProbe] = useState<string | null>(null);
  const [storedImages, setStoredImages] = useState<ImageData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [probeFile, setProbeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      if (selectedFiles.length === 0 || !probeFile) {
        alert("Please select at least one image and a probe image to upload.");
        return;
      }
      setIsLoading(true);
      // Create FormData for file upload
      const formData = new FormData();
      // Append all selected files
      selectedFiles.forEach((file, idx) => {
        formData.append("files", file, file.webkitRelativePath || file.name);
      });
      // Append probe image (can be any file)
      formData.append(
        "probeImage",
        probeFile,
        probeFile.webkitRelativePath || probeFile.name
      );
      formData.append("timeStamp", new Date().toISOString());
      // Send the FormData in a POST request
      const response = await fetch("http://localhost:6464/scanMultiple", {
        method: "POST",
        body: formData,
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        setIsLoading(false);
        alert("Server did not return valid JSON.");
        return;
      }
      setIsLoading(false);
      if (data.status === "success") {
        alert("Files uploaded successfully!");
      } else {
        alert("Error uploading files: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setIsLoading(false);
      alert("Error uploading files: " + error);
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

        <label htmlFor="probeImage" aria-label="Probe Image">
          Choose Probe Image
        </label>
        <input
          type="file"
          id="probeImage"
          name="probeImage"
          placeholder="Probe Image"
          aria-label="Probe Image"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setProbeFile(e.target.files[0]);
            } else {
              setProbeFile(null);
            }
          }}
          accept="image/*"
        />
        {/* @ts-ignore: webkitdirectory is a non-standard attribute but supported by browsers */}
        <label htmlFor="fingerprintImageOne" aria-label="Fingerprint Image One">
          Choose Images To Add To Storage
        </label>
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
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Submit"}
        </button>
        {isLoading && (
          <div
            className="loading-indicator"
            style={{ marginTop: "10px", color: "#007bff" }}
          >
            <span className="spinner" style={{ marginRight: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="#007bff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="31.415, 31.415"
                  transform="rotate(72.0001 25 25)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </span>
            Uploading and processing, please wait...
          </div>
        )}
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
