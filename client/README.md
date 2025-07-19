# Footprint Scanner Project

## Overview

This project is a work-in-progress system for identifying and comparing footprints using image processing and machine learning. It features:

- A React frontend for uploading and managing images, running scans, and viewing results.
- A Java backend (Spark server) for handling image storage, scan requests, and integration with Firebase.
- A Python Flask microservice for advanced ORB-based image similarity scoring.

## Project Structure

```
footprint-scanner-project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OneToManyUI.tsx
│   │   │   ├── Controls.tsx
│   │   │   ├── main.py (Flask ORB matcher)
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── README.md
├── server/ (Java backend)
│   ├── src/
│   │   └── main/java/org/example/
│   │       ├── Server.java
│   │       ├── Handlers/
│   │       │   ├── NImageScanHandler.java
│   │       │   └── ...
│   │       └── ...
│   └── ...
└── ...
```

## Features

- **One-to-One and One-to-Many Scanning:** Upload and compare a probe image against one or many stored images.
- **Folder Upload:** Select and upload multiple images or entire folders.
- **Firebase Storage Integration:** Store and retrieve images and metadata.
- **Python ORB Matcher:** Use a Flask API to compare two images using ORB feature matching.
- **Progress Indicators:** UI feedback for long-running operations.
- **CORS Support:** Cross-origin requests enabled for frontend-backend communication.

## Setup Instructions

### 1. React Frontend

- Navigate to the `client` directory:
  ```sh
  cd client
  ```
- Install dependencies:
  ```sh
  npm install
  ```
- Start the development server:
  ```sh
  npm start
  ```
- The app will run at [http://localhost:3000](http://localhost:3000)

### 2. Java Backend (Spark Server)

- Ensure you have Java 11+ and Maven installed.
- Build and run the server (from the `server` directory):
  ```sh
  mvn clean package
  java -jar target/your-server-jar-file.jar
  ```
- The backend will run at [http://localhost:6464](http://localhost:6464)
- Handles image storage, scan requests, and Firebase integration.

### 3. Python Flask ORB Matcher

- Ensure you have Python 3.8+ installed.
- Install dependencies:
  ```sh
  pip install flask flask-cors opencv-python numpy
  ```
- Run the Flask server (from the directory containing `main.py`):
  ```sh
  python main.py
  ```
- The Flask API will run at [http://localhost:5000](http://localhost:5000)
- Endpoint: `/orb-match` (POST two images as `image1` and `image2`)

## Usage

### One-to-One and One-to-Many Scanning

- Use the control panel in the React app to select scanning mode.
- Upload a probe image and one or more candidate images (or a folder).
- Submit to run the scan. Results and matches will be displayed in the UI.

### ORB Matcher (Python Flask)

- Switch to the "Run ORB Match (Flask)" mode in the UI.
- Upload two images to compare.
- The similarity score will be displayed after processing.

## Architecture

- **Frontend:** React, TypeScript, CSS (custom + Tailwind), communicates with both Java and Python backends via HTTP.
- **Backend (Java):** Spark Java, handles image storage, scan logic, and Firebase integration. Accepts multipart/form-data for image uploads.
- **Backend (Python):** Flask, exposes `/orb-match` endpoint for ORB-based image similarity. Accepts two images and returns a similarity score.

## CORS

- Both Java and Python servers are configured to allow requests from the React frontend (localhost:3000).

## Customization & Extending

- Adjust ORB parameters or similarity threshold in `main.py` for your use case.
- Extend Java backend handlers for more advanced scan logic or storage options.
- Add more UI features or result visualizations in React.

## Troubleshooting

- **CORS errors:** Ensure both backends have CORS enabled and are running.
- **Network errors:** Check that all servers are running on the correct ports.
- **High similarity scores for all images:** Tune the ORB matcher in `main.py` to filter matches by distance.

## License

MIT (or your chosen license)
