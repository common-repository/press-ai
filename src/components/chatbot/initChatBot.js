import ReactDOMClient from 'react-dom/client';
import React from "react";
import {isFeatureAvailable} from "../../api/CheckFeatures";

const initChatBot = async () => {
    if ((await isFeatureAvailable('chatbot')).status){

        try {
            const { ChatBot } = await import('./ChatBot');
            const chatBotContainer = document.getElementById('pressai-chatbot-popup');

            if (chatBotContainer) {
                ReactDOMClient.createRoot(chatBotContainer).render(<ChatBot />);
            }
        } catch (error) {
            console.error('ChatBot component not found');
        }

    }

};

export default initChatBot;