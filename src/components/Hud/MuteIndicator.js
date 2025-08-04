import React from 'react';
import './MuteIndicator.css';

const MuteIndicator = ({ Icon, isVisible }) => {
    if (!isVisible || !Icon) {
        return null;
    }

    return (
        <div className="mute-indicator">
            <Icon size={72} />
        </div>
    );
};

export default MuteIndicator;
