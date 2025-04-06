import React, { useState } from 'react';

interface DisplayAreaProps {
    imageOne: string;
    imageTwo: string;
}

export default function DisplayArea(props: DisplayAreaProps) {
    return (
        <div className="display-area">
            <div className="image-container">
                <img src={props.imageOne} alt="Fingerprint One" className="fingerprint-image" />
            </div>
            <div className="image-container">
                <img src={props.imageTwo} alt="Fingerprint Two" className="fingerprint-image" />
            </div>
        </div>
    );
}
