import React from 'react';
import CustomIcon from "./CustomIcon";

const IconSelector = ({ label, description, icons, selectedIcon, setSelectedIcon, color }) => {
    return (
        <div>
            <label className="font-semibold">{label}</label>
            <p className="mt-1 text-xs text-gray-400">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {icons.map((icon, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIcon(icon)}
                        className={`relative p-4 border-2 rounded-md ${
                            icon === selectedIcon ? "border-blue-500" : ""
                        }`}
                        style={{ minWidth: 'fit-content', minHeight: 'fit-content' }}
                    >

                        {icon ? (
                            <CustomIcon iconName={icon} className="mx-auto text-xl" style={{ color }}/>
                        ) : (
                            <span className="mx-auto text">None</span>
                        )}
                        {icon === selectedIcon && (
                            <CustomIcon iconName="fa-solid fa-circle-check" className="absolute top-0 right-0 text-blue-500 mt-0.5 mr-0.5" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IconSelector;
