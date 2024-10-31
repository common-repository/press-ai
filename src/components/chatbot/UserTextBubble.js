import React, { useState, useEffect } from 'react';
import CustomIcon from "../common/CustomIcon";
import { formatDistanceToNow } from 'date-fns';
import Linkify from 'react-linkify';

const UserTextBubble = (props) => {
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
        <div className="flex w-full justify-start gap-3">
            {props.chatbotSettings.botAvatar && (
                <div className="inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full text-gray-400 bg-gray-200 ring-1 ring-gray-200 items-center justify-center">
                    <CustomIcon iconName="fa-solid fa-user-large" />
                </div>
            )}

            <div>
                <div className="rounded-b-xl rounded-r-xl p-3 text-white" style={{ backgroundColor: props.chatbotSettings.color || "#7031f5" }}>
                    <p className="whitespace-pre-wrap text-sm">
                        <Linkify componentDecorator={linkDecorator}>
                            {props.content}
                        </Linkify>
                    </p>
                </div>

                <span className="text-xs leading-none text-gray-500">
                    {formatTime(props.timestamp)}
                </span>
            </div>
        </div>
    );
};

export default UserTextBubble;
