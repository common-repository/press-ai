import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({label, color, setColor}) => {
    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <SketchPicker
                    color={color}
                    onChangeComplete={handleChangeComplete}
                />
            </div>
        </div>
    );
};

export default ColorPicker;
