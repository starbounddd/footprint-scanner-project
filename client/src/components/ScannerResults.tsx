import React, { useState } from "react";
import '../styles/components.css';


export default function ScannerResults(){
    const [scanResults, setScanResults] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit  = async (event: React.FormEvent) => {
        try {
            const scanImages = await fetch(`http://localhost:6464/runscanner`);
            while (!scanImages.ok) {
                setIsLoading(true);
            }
            const data = await scanImages.json();
            const response = data.responseMap.success;
            setIsLoading(false);
            console.log(response);
            setScanResults(response);

        }
        catch(error){
            alert("Error scanning images: " + error);
        }

}
        if (isLoading) {
            return <div className="loading">Loading...</div>;
        }
    
        return (
            <div className="scanner-results">
                <h2>Scanner Results</h2>
                <button onClick={handleSubmit}>Run Scanner</button>
                 <p>{scanResults}</p>
            </div>
        );
    }