import React, {useEffect, useState} from "react";

import UpgradePremiumRightBanner from "../common/UpgradePremiumRightBanner";
import AcademyBanner from "../common/AcademyBanner";
import Sidebar from "../Sidebar/Sidebar";
import NavBar from "../common/NavBar";
import MainModule from "../settings/MainModule";
import Integrations from "../settings/Integrations";
import {getOption, setOption} from "../../api/OptionsRelated";
import WriterSettings from "../settings/WriterSettings";
import WooCommerceSettings from "../settings/WooCommerceSettings";
import ChatbotBuilder from "../settings/ChatbotBuilder";
import CustomStyles from "../settings/CustomStyles";

function SettingsPage() {

    const [activeComponent, setActiveComponent] = useState('');
    const [expandedMenu, setExpandedMenu] = useState('');


    useEffect(() => {
        fetchModuleSettings();
        // Set the active component based on the initial URL hash
        const initialHash = window.location.hash;
        if (initialHash === '#/settings' || initialHash === '#/settings/') {
            window.location.hash = '#/settings/main-module';
        }
        setActiveComponent(initialHash);

        // Expand the corresponding menu based on the initial URL hash
        const selectedMenu = menuItems.find((menu) =>
            menu.submenu.some((submenu) => submenu.link === initialHash)
        );

        if (selectedMenu) {
            setExpandedMenu(selectedMenu.title);
        } else {
            setExpandedMenu('');
        }

        // Listen for changes to the hash part of the URL
        window.addEventListener("hashchange", handleHashChange);

        // Clean up the event listener on unmount
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);


    const fetchModuleSettings = async () => {
        try {
            const optionValue = await getOption('pressai_module_setting');
            if (optionValue.status) {
                const moduleSettings = optionValue.data;

                const updatedMenuItems = menuItems.map((menuItem) => {
                    if (menuItem.module) {
                        const moduleStatus = moduleSettings[menuItem.module];
                        if (moduleStatus !== undefined) {
                            return {
                                ...menuItem,
                                active: moduleStatus,
                            };
                        }
                    }
                    return menuItem;
                });

                setMenuItems(updatedMenuItems);

            } else {
                await setMenuItemsActiveStatus();
            }
        } catch (error) {
            console.error('Error fetching pressai_module_setting option', error);
        }
    };

    const setMenuItemsActiveStatus = async () => {
        const result = {};

        menuItems.forEach((menuItem) => {
            if (menuItem.module) {
                result[menuItem.module] = menuItem.active;
            }
        });

        try {
            const response = await setOption('pressai_module_setting', result);
            if (response.status) {
                console.log('Menu items status saved successfully');
            } else {
                console.log('Error saving menu items status');
            }
        } catch (error) {
            console.error('Error saving menu items status:', error);
        }
    };






    // Add this function
    const handleHashChange = () => {
        const currentHash = window.location.hash;
        setActiveComponent(currentHash);

        const selectedMenu = menuItems.find((menu) =>
            menu.submenu.some((submenu) => submenu.link === currentHash)
        );

        if (selectedMenu) {
            setExpandedMenu(selectedMenu.title);
        } else {
            setExpandedMenu('');
        }
    };

    // Inside SettingsPage.js
    const updateMenuItemActive = (module, activeValue) => {
        const updatedMenuItems = menuItems.map((menuItem) => {
            if (menuItem.module === module) {
                return {
                    ...menuItem,
                    active: activeValue,
                };
            }
            return menuItem;
        });

        setMenuItems(updatedMenuItems);
    };


    const renderContentBody = () => {
        switch (activeComponent) {
            case "#/settings/main-module":
                return <MainModule menuItems={menuItems} onUpdateMenuItemActive={updateMenuItemActive}/>;
            case "#/settings/integrations":
                return <Integrations/>;
            case "#/settings/main-editor-settings":
                return <WriterSettings/>;
            case "#/settings/woocommerce-settings":
                return <WooCommerceSettings/>;
            case  "#/settings/chatbot-builder":
                return <ChatbotBuilder/>;
            case "#/settings/custom-styles":
                return <CustomStyles/>;
            default:
                return null;
        }
    }

    const [menuItems, setMenuItems] = useState([
        {
            title: 'General',
            icon: 'fa-solid fa-desktop',
            active: true,
            submenu: [
                {
                    title: 'Main Modules',
                    link: '#/settings/main-module',
                },
                {
                    title: 'Integrations',
                    link: '#/settings/integrations',
                },
            ],
        },
        {
            title: 'Press AI Writer',
            icon: 'fa-solid fa-newspaper',
            module: 'writer',
            active: true,
            submenu: [
                {
                    title: 'Main Editor Settings',
                    link: '#/settings/main-editor-settings',
                },
                {
                    title: 'Woocommerce Settings',
                    link: '#/settings/woocommerce-settings',
                },
            ],
        },
        {
            title: 'Press AI Chat',
            icon: 'fa-solid fa-robot',
            module: 'chat',
            active: false,
            submenu: [
                {
                    title: 'Chatbot Builder',
                    link: '#/settings/chatbot-builder',
                },
                // {
                //     title: 'Custom Styles',
                //     link: '#/settings/custom-styles',
                // },
            ],
        },
        {
            title: 'Advanced',
            icon: 'fa-solid fa-sliders',
            active: false,
            submenu: [
                {
                    title: 'Security Settings',
                    link: '#/settings/security-settings',
                },
                {
                    title: 'Moderation',
                    link: '#/settings/moderation',
                },
                {
                    title: 'Usage Costs',
                    link: '#/settings/usage-costs',
                },
                {
                    title: 'Debug Mode',
                    link: '#/settings/debug-mode',
                },
                {
                    title: 'Shortcodes',
                    link: '#/settings/shortcodes',
                },
                {
                    title: 'Dynamic Max Tokens',
                    link: '#/settings/dynamic-max-tokens',
                },
                {
                    title: 'API Incidents',
                    link: '#/settings/api-incidents',
                },
            ],
        },

    ]);


    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar textNavbar="Settings"/>

            <div className="flex flex-col xl:flex-row w-full">

                <div className="w-full xl:w-3/4 flex flex-col pr-4 xl:pr-0">
                    <div className="flex flex-col md:flex-row w-full">
                        <div className="w-full md:w-3/12">
                            <Sidebar menuItems={menuItems} expandedMenu={expandedMenu} />
                        </div>
                        <div className="w-full md:w-9/12 bg-white shadow rounded-lg mt-4 md:mt-16">
                            {renderContentBody()}
                        </div>
                    </div>
                </div>
                <div className="w-full xl:w-1/4 mt-4 xl:mt-0 xl:ml-4 flex flex-col pr-4 xl:pr-10">
                    <div className="h-16"></div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3 xl:col-span-0"></div>

                        <div className="col-span-9 xl:col-span-12">
                            <UpgradePremiumRightBanner />
                            <AcademyBanner />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SettingsPage;