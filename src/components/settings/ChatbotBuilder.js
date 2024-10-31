import React, {useEffect, useState} from 'react';
import BottomPopup from "./BottomPopup";
import CustomIcon from "../common/CustomIcon";
import Dropdown from "../common/Dropdown";
import InputField from "../common/InputField";
import ColorPicker from "../common/ColorPicker";
import {getOption, setOption} from "../../api/OptionsRelated";
import IconSelector from "../common/IconSelector";
import debounce from "lodash.debounce";
import ToggleButton from "../common/ToggleButton";

const ChatbotBuilder = () => {
    const [bottomPopup, setBottomPopup] = useState(false);
    const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    // Use one state object for all settings
    const [settings, setSettings] = useState({
        name: '',
        description: '',
        color: '',
        firstMessage: '',
        buttonIcon: '',
        buttonText: '',
        botAvatar: '',
        customSupportLink: '',
        language: '',
        showButtonText: true,
        buttonAlignment: "right",
        showBranding: true,
    });

    // Define options for dropdowns
    const buttonIcons = [
        'fa-solid fa-comment',
        'fa-regular fa-comment',
        'fa-solid fa-comments',
        'fa-regular fa-comments',
        'fa-solid fa-headset',
        'fa-solid fa-message',
        'fa-regular fa-message',
        'fa-solid fa-comment-dots',
        'fa-regular fa-comment-dots',
        'fa-solid fa-robot',
        'fa-solid fa-life-ring',
        'fa-solid fa-question',
        'fa-solid fa-circle-question',
        'fa-regular fa-circle-question'
    ];

    const botAvatars = [
        '',
        'fa-solid fa-comment',
        'fa-regular fa-comment',
        'fa-solid fa-comments',
        'fa-regular fa-comments',
        'fa-solid fa-headset',
        'fa-solid fa-message',
        'fa-regular fa-message',
        'fa-solid fa-comment-dots',
        'fa-regular fa-comment-dots',
        'fa-solid fa-robot',
        'fa-solid fa-life-ring',
        'fa-solid fa-question',
        'fa-solid fa-circle-question',
        'fa-regular fa-circle-question'
    ];

    const CHATBOT_CONFIG = 'pressai_chatbot_config';

    const languages = [
        'English', 'Japanese',
    ];

    // Load the saved values when the component mounts
    useEffect(() => {
        const loadSettings = async () => {
            const response = await getOption(CHATBOT_CONFIG);
            if (response.status) {
                setSettings(response.data);
                setInitialValuesLoaded(true);
            }
        };

        loadSettings();
    }, []);

    // Check for changes in settings
    const checkForChanges = async () => {
        if (initialValuesLoaded) {
            const savedSettings = await getOption(CHATBOT_CONFIG);
            const hasChanged = JSON.stringify(settings) !== JSON.stringify(savedSettings.data);
            setBottomPopup(hasChanged);
        }
    };

    const handleBottomPopupClose = () => {
        setBottomPopup(false);
    };

    const handleBottomPopupSave = async () => {
        await setOption(CHATBOT_CONFIG, settings);
        setSuccessMessage('Great! Your Chabot settings were saved successfully.');
        setBottomPopup(false);
    };

    // Update a setting by key
    const handleInputChange = (name) => (value) => {
        setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
    };


    useEffect(() => {
        if (successMessage !== '') {
            const timer = setTimeout(() => {
                setSuccessMessage(''); // Clear the success message after 2 seconds
            }, 2000);

            // This will clear the timeout if the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const debouncedCheckForChanges = debounce(checkForChanges, 300);

    // React to changes in writerSettings
    useEffect(() => {
        if (initialValuesLoaded) {
            debouncedCheckForChanges();
        }
    }, [settings]);

    // Render the component
    return (
        <div>
            <header className="p-8 border-b border-gray-300">
                <div className="max-w-screen-sm">
                    <h1 className="text-xl">Chatbot Builder</h1>
                    <p className="text-sm text-gray-500 mt-3">Configure your chatbot widget and settings.</p>
                </div>
            </header>
            <div className="flex flex-col h-full">
                <div className="flex-grow p-8">
                    <div className="max-w-5xl">
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="col-span-1">
                                <div className="max-w-screen-sm">
                                    <h2 className="text-lg">Chatbot Configuration</h2>
                                    <p className="mt-2 text-gray-500">Set the configuration of the chatbot to match your preferences and branding.</p>
                                </div>
                            </div>

                            <fieldset className="col-span-2 space-y-8">
                                <InputField
                                    label="Name"
                                    type="text"
                                    id="name"
                                    value={settings.name}
                                    onChange={handleInputChange('name')}
                                    description="Your bot name is displayed in the header of the widget."
                                />
                                <InputField
                                    label="Description"
                                    type="text"
                                    id="description"
                                    value={settings.description}
                                    onChange={handleInputChange('description')}
                                    description="Your bot description is displayed in the header of the widget."
                                />
                                <ColorPicker
                                    label="Color"
                                    color={settings.color}
                                    setColor={handleInputChange('color')}
                                    description="Choose the color of the widget. You can choose from a variety of colors or enter your own hex code."
                                />
                                <InputField
                                    label="First message"
                                    type="text"
                                    id="firstMessage"
                                    value={settings.firstMessage}
                                    onChange={handleInputChange('firstMessage')}
                                    description="Choose the greeting that will appear when the widget is first opened."
                                />
                                <IconSelector
                                    label="Button Icon"
                                    description="Choose the icon that will appear in the floating button."
                                    icons={buttonIcons}
                                    selectedIcon={settings.buttonIcon}
                                    setSelectedIcon={handleInputChange('buttonIcon')}
                                    color={settings.color}
                                />

                                <InputField
                                    label="Button Text"
                                    type="text"
                                    id="buttonText"
                                    value={settings.buttonText}
                                    onChange={handleInputChange('buttonText')}
                                    description="Choose the text that will appear in the floating button if any."
                                />

                                <div className="flex justify-between items-center">
                                    <div>
                                        <label htmlFor="showButtonText" className="font-semibold">Show Button Text</label>
                                        <p className="mt-1 text-xs text-gray-400">Toggle to show or hide the button text.</p>
                                    </div>
                                    <ToggleButton active={settings.showButtonText} onToggle={() => handleInputChange('showButtonText')(!settings.showButtonText)} />
                                </div>


                                <div>
                                    <label className="font-semibold">Button Alignment</label>
                                    <p className="mt-1 text-xs text-gray-400">Choose the alignment of the floating button.</p>
                                    <div className="mt-4 space-x-4">
                                        <label>
                                            <input
                                                type="radio"
                                                name="buttonAlignment"
                                                value="left"
                                                checked={settings.buttonAlignment === 'left'}
                                                onChange={() => handleInputChange('buttonAlignment')('left')}
                                            />
                                            <span className="ml-2">Left</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="buttonAlignment"
                                                value="right"
                                                checked={settings.buttonAlignment === 'right'}
                                                onChange={() => handleInputChange('buttonAlignment')('right')}
                                            />
                                            <span className="ml-2">Right</span>
                                        </label>
                                    </div>
                                </div>

                                <IconSelector
                                    label="Bot Avatar"
                                    description="Choose the avatar icon that will appear for your bot, or none at all."
                                    icons={botAvatars}
                                    selectedIcon={settings.botAvatar}
                                    setSelectedIcon={handleInputChange('botAvatar')}
                                    color={settings.color}
                                />
                                <InputField
                                    label="Custom Support Link"
                                    type="text"
                                    id="customSupportLink"
                                    value={settings.customSupportLink}
                                    onChange={handleInputChange('customSupportLink')}
                                    description="Choose a custom support link that will appear in the widget for user's to contact you directly if they need to."
                                />

                                <Dropdown
                                    label="Language"
                                    options={languages}
                                    selectedOption={settings.language}
                                    setSelectedOption={handleInputChange('language')}
                                    onChange={handleInputChange('language')}
                                    description="Choose the language that the widget will be displayed in. Currently, we support English and Japanese. We will soon allow you to easily translate the widget into your own language or customize any text strings."
                                />

                                <div className="flex justify-between items-center">
                                    <div>
                                        <label htmlFor="showBranding" className="font-semibold">Show Branding</label>
                                        <p className="mt-1 text-xs text-gray-400">Toggle to enable or disable branding.</p>
                                    </div>
                                    <ToggleButton active={settings.showBranding} onToggle={() => handleInputChange('showBranding')(!settings.showBranding)} />
                                </div>
                            </fieldset>

                        </section>

                    </div>
                </div>


                <BottomPopup show={bottomPopup} onDiscard={handleBottomPopupClose} onSave={handleBottomPopupSave} />

                {successMessage && (
                    <div className="fixed bottom-0 right-0 m-8 bg-green-500 text-white px-4 py-2 rounded-md shadow-md flex items-center">
                        <CustomIcon iconName="fa-solid fa-check" className="text-green-200 mr-2" />
                        {successMessage}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ChatbotBuilder;
