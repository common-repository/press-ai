import React, { useState, useEffect } from 'react';
import CustomIcon from "../common/CustomIcon";
import { formatDistanceToNow } from 'date-fns';
import Linkify from "react-linkify";

const BotTextBubble = (props) => {
    const [now, setNow] = useState(new Date());  // Initialize with the current time

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());  // Update the current time every 60 seconds
        }, 60000);

        return () => clearInterval(timer);  // Cleanup on unmount
    }, []);

    const formatTime = (timestamp) => {
        const timePassed = (now - new Date(timestamp)) / 1000 / 60;
        if (timePassed < 1) {
            return 'Just now';
        } else {
            return formatDistanceToNow(new Date(timestamp)) + ' ago';
        }
    }

    const linkDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
            {text}
        </a>
    );


    return (
        <div className="relative flex w-full gap-3">

            {props.chatbotSettings.botAvatar && (
                <div
                    className="inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full text-white ring-1 ring-gray-200 items-center justify-center"
                    style={{ backgroundColor: props.chatbotSettings.color || "#7031f5" }}
                >
                    <CustomIcon iconName={props.chatbotSettings.botAvatar || "fa-solid fa-robot"}/>
                </div>
            )}

            <div>
                <div className="rounded-r-xl rounded-bl-xl bg-gray-200 p-3">
                    <p className="whitespace-pre-wrap text-sm">
                        <Linkify componentDecorator={linkDecorator}>
                            {props.content}
                        </Linkify>
                    </p>
                </div>


                {props.chatbotSettings.customSupportLink && (
                    <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-semibold text-gray-500 open:text-gray-900">Support</summary>
                        <div className="mt-1">
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                <a href={props.chatbotSettings.customSupportLink}
                                   className="w-48 truncate rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-500 transition-all duration-150 after:-ml-0.5 after:text-gray-500 hover:border-gray-900 hover:bg-gray-100 hover:text-gray-900"
                                   target="_blank"
                                   rel="noreferrer">
                                    /support
                                </a>
                            </div>
                        </div>
                    </details>
                )}

                <span className="text-xs leading-none text-gray-500">
                    {formatTime(props.timestamp)}
                </span>
            </div>
        </div>
    );
};

export default BotTextBubble;
