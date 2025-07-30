import React from 'react';

const BatteryDisplay = ({ battery }) => {
    const batteryPercentage = Math.floor(battery);
    let batteryClass = '';
    if (batteryPercentage < 20) {
        batteryClass = 'low-battery';
    }

    return (
        <div id="batteryDisplay" className={batteryClass}>
            Batería: {batteryPercentage}%
        </div>
    );
};

export default BatteryDisplay;
