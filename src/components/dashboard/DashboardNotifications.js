import React, {useEffect, useState} from 'react';
import CustomIcon from "../common/CustomIcon";
import {fetchDashboardItems, updateDashboardItems} from "../../api/OptionsRelated";

function DashboardNotifications() {
    const [showNotifications, setShowNotifications] = useState(false);

    const [hiddenNotifications, setHiddenNotifications] = useState([]);
    const [shownNotifications, setShownNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDashboardItems('notifications');

            setHiddenNotifications(data.hidden_items);
            setShownNotifications(data.shown_items);
        };

        fetchData();
    }, []);

    useEffect(() => {
        updateDashboardItems(hiddenNotifications, shownNotifications, 'notifications');
    }, [hiddenNotifications, shownNotifications]);

    const toggleNotification = (id) => {
        const targetNotification = hiddenNotifications.find((item) => item.id === id);
        if (targetNotification) {
            setHiddenNotifications(hiddenNotifications.filter((item) => item.id !== id));
            setShownNotifications([...shownNotifications, targetNotification]);
        } else {
            const targetShownNotification = shownNotifications.find((item) => item.id === id);
            setShownNotifications(shownNotifications.filter((item) => item.id !== id));
            setHiddenNotifications([...hiddenNotifications, targetShownNotification]);
        }
    };

    // Rest of the code related to notifications ...

    return (
        <div className="w-full border border-gray-300 bg-white mb-4 pb-4">

            <h3 className="text-black text-lg p-4 pl-6">
                {showNotifications.length > 0 ? (
                    <span className="dashicons dashicons-flag text-pressai-primary"></span>
                ) : (
                    <span className="dashicons dashicons-yes text-pressai-primary"></span>
                )}
                Notifications ({shownNotifications.length})
            </h3>
            <hr className="border-gray-300 border-t-1 my-2" />

            {shownNotifications.map((notification) => (
                <div key={notification.id} className="px-4 pb-4">
                    <div className="relative border-l-4 border-pressai-primary">
                        <p className="pl-2">{notification.content}</p>
                        <button
                            type="button"
                            className="absolute top-0 right-0 pr-2"
                            onClick={() => toggleNotification(notification.id)}
                        >
                            <span className="screen-reader-text">Hide this item.</span>
                            <CustomIcon iconName="fa-solid fa-eye-slash" />
                        </button>
                    </div>
                </div>
            ))}

            {shownNotifications.length === 0 && (
                <p className="p-4">You have no notifications at the moment.</p>
            )}


            {hiddenNotifications.length > 0 && (
                <div className="px-4 pt-4">
                    <button
                        className="w-full text-left text-lg flex items-center justify-between shadow border-l-4 border-pressai-primary p-4"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        You have {hiddenNotifications.length} hidden notification:
                        <span className="dashicons dashicons-arrow-down-alt2 text-gray-500"></span>
                    </button>
                </div>
            )}


            {showNotifications && (
                <div className="pb-4">
                    {hiddenNotifications.map((notification) => (
                        <div key={notification.id} className="px-4 pb-4">
                            <div className="relative border-l-4 border-pressai-primary bg-gray-100">
                                <p className="pl-2">{notification.content}</p>
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 pr-2"
                                    onClick={() => toggleNotification(notification.id)}
                                >
                                    <span className="screen-reader-text">Show this item.</span>
                                    <CustomIcon iconName="fa-solid fa-eye" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default DashboardNotifications;
