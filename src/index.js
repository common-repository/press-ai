import React, { useEffect, useState } from 'react';
import LandingPage from './components/pages/LandingPage';
import SettingsPage from './components/pages/SettingsPage';
import UpgradePage from './components/pages/UpgradePage';
import ReactDOMClient from "react-dom/client";
import initChatBot from './components/chatbot/initChatBot';



const App = () => {
    const [currentPage, setCurrentPage] = useState('');


    useEffect(() => {
        // Listen for changes to the hash part of the URL
        window.addEventListener('hashchange', handleHashChange);

        // Set the current page based on the initial hash
        setCurrentPage(window.location.hash);

        // Clean up the event listener on unmount
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);


    const handleHashChange = async () => {
        setCurrentPage(window.location.hash);
    };


    switch (currentPage) {
        case "":
            return <LandingPage />;
        case "#/settings":
            return <SettingsPage />;
        case "#/upgrade":
            return <UpgradePage />;
        default:
            // Check if the current URL hash starts with "#/settings" and render SettingsPage, otherwise render LandingPage
            return currentPage.startsWith("#/settings") ? <SettingsPage /> : <LandingPage />;
    }
};

const container = document.getElementById('pressai-plugin-app');
if (container) {
    ReactDOMClient.createRoot(container).render(<App />);
}

initChatBot();
