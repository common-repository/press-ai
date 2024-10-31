import React, { useState, useEffect, useRef } from 'react';
import CustomIcon from "./CustomIcon";

const Dropdown = ({ label, options, selectedOption, setSelectedOption, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if(onChange) {
            onChange(option); // add this line
        }
    };


    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center mb-2">
                <label className="font-semibold">{label}</label>
            </div>
            <div className="relative w-full">
                <div
                    className="flex items-center justify-between border border-gray-300 p-2 rounded cursor-pointer focus:ring-pressai-primary focus:ring-1 outline-none"
                    tabIndex="0"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text-gray-500">{selectedOption || 'Select an option...'}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-400"
                        role="img"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>
                {isOpen && (
                    <ul className="absolute w-full mt-1 bg-white shadow-lg max-h-60 rounded-md text-gray-900 ring-1 ring-black ring-opacity-5 overflow-auto z-20 space-y-0">

                        {options.map((option, index) => (
                            <li
                                key={index}
                                className={`flex justify-between items-center px-4 py-2 mb-0 ${
                                    selectedOption === option ? `bg-pressai-primary text-white ${index === 0 ? "rounded-t-md" : `${index === options.length - 1 ? "rounded-b-md": "" }`}` : "bg-white hover:bg-gray-200"
                                } cursor-pointer`}

                                onClick={() => handleOptionClick(option)}
                            >
                                <span>{option}</span>
                                {selectedOption === option && <CustomIcon iconName="fa-solid fa-check" />}
                            </li>
                        ))}

                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
