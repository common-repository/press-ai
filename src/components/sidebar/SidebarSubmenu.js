import React from 'react';

const SidebarSubmenu = ({ submenuItems }) => {
    const getCurrentLink = () => {
        return window.location.hash;
    };

    return (
        <ul className="ml-8 mt-1 space-y-1">
            {submenuItems.map((item) => (
                <li key={item.title} className="pb-1">
                    <a
                        href={item.link}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-indigo-500 ${
                            item.link === getCurrentLink() ? 'bg-gray-200' : ''
                        }`}
                    >
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default SidebarSubmenu;
