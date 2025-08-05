import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner-container">
            <div className="water-ripple">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
