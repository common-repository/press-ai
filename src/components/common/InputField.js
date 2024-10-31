import React from 'react';

const InputField = ({ label, type, id, value, onChange, description, min, max }) => {
    const inputType = type === 'integer' || type === 'float' ? 'number' : type;

    const handleChange = (e) => {
        let newValue = e.target.value;

        if (type === 'integer') {
            newValue = parseInt(newValue);
            if (isNaN(newValue)) newValue = '';
        } else if (type === 'float') {
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) newValue = '';
        }

        if (newValue !== '' && (min !== undefined || max !== undefined)) {
            newValue = Math.min(Math.max(newValue, min || -Infinity), max || Infinity);
        }

        onChange(newValue);
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="font-semibold" htmlFor={id}>
                {label}
            </label>
            <input
                className="border border-gray-300 p-2 rounded leading-none min-h-0"
                type={inputType}
                id={id}
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={type === 'float' ? 'any' : undefined}
            />
            <p className="text-smc">{description}</p>
        </div>
    );
};

export default InputField;
