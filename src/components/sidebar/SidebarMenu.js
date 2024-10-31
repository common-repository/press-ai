import React, {useEffect, useState} from 'react';
import SidebarSubmenu from './SidebarSubmenu';
import CustomIcon from "../common/CustomIcon";

const SidebarMenu = ({ menu, expandedMenu }) => {
    const [submenuExpanded, setSubmenuExpanded] = useState(false);

    useEffect(() => {
        setSubmenuExpanded(expandedMenu === menu.title);
    }, [expandedMenu, menu.title]);

    const toggleSubmenu = () => {
        setSubmenuExpanded((prevSubmenuExpanded) => !prevSubmenuExpanded);
    };

    return (
        <li>
            <button
                onClick={toggleSubmenu}
                className="group flex justify-between w-full items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <span className="flex items-center gap-3 text-sm ">
                    <CustomIcon iconName={menu.icon} className="text-gray-400 group-hover:text-gray-600" size="lg" />
                    {menu.title}
                </span>
                {menu.submenu.length > 0 && (
                    <svg
                        className={`h-4 w-4 text-gray-400 group-hover:text-gray-500 transform ${submenuExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5" />
                    </svg>
                )}
            </button>
            {submenuExpanded && menu.submenu.length > 0 && (
                <SidebarSubmenu submenuItems={menu.submenu} />
            )}
        </li>
    );
};

export default SidebarMenu;
