import React, {useEffect, useState} from 'react';
import CustomIcon from "../common/CustomIcon";
import ToggleButton from "../common/ToggleButton";
import WriterModuleBanner from '../../../dist/images/modules/Press-AI-Writer-Main-Module-Icon-Banner.svg';
import ChatModuleBanner from '../../../dist/images/modules/Press-AI-Chat-Module-Icon-Banner.svg';
import PhotosModuleBanner from '../../../dist/images/modules/Press-AI-Photo-Module-Icon-Banner.svg';
import TranscribeModuleBanner from '../../../dist/images/modules/Press-AI-Transcribe-Module-Icon-Banner.svg';
import EmbeddingsModuleBanner from '../../../dist/images/modules/Press-AI-Embeddings-Module-Icon-Banner.svg';
import FineTuneModuleBanner from '../../../dist/images/modules/Press-AI-Fine-Tuning-Module-Icon-Banner.svg';
import BottomPopup from "./BottomPopup";
import {getOption, setOption} from "../../api/OptionsRelated";

const MainModule = ({ menuItems, onUpdateMenuItemActive }) => {

    const [bottomPopup, setBottomPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


    const [mainModuleItems, setMainModuleItems] = useState([
        {
            module: 'writer',
            title: 'Press AI Writer',
            description: 'Streamline content creation with AI-assisted writing directly in your Gutenberg WordPress editor.',
            image: WriterModuleBanner,
            background: '#eef2ff',
            isPro: false,
            active: false,
            learnMoreLink: "https://press.ai/wordpress/",
        },
        {
            module: 'chat',
            title: 'Press AI Chat',
            description: 'Boost user engagement with interactive ChatGPT-inspired chat bots for tutorials and product information.',
            image: ChatModuleBanner,
            background: '#f0fdfa',
            isPro: false,
            active: false,
            learnMoreLink: "https://press.ai/wordpress/",
        },
        {
            module: 'photos',
            title: 'Press AI Photos',
            description: 'Unleash your creativity with AI-driven image generation, effortlessly crafting unique photos from your text prompts.',
            image: PhotosModuleBanner,
            background: '#fef2f2',
            isPro: true,
            active: false,
            learnMoreLink: "https://press.ai/wordpress/",
        },
        {
            module: 'embeddings',
            title: 'Press AI Embeddings',
            description: 'Harness the power of AI-driven text embeddings to enhance search relevance, clustering, recommendations, anomaly detection, classification, and more use cases to optimizing your website\'s performance and user experience.',
            image: EmbeddingsModuleBanner,
            background: '#fffbeb',
            isPro: true,
            active: false,
            learnMoreLink: "https://press.ai/wordpress/",
        },
        {
            module: 'transcribe',
            title: 'Press AI Transcribe',
            description: 'Effortlessly convert your audio files into text with versatile transcription API, supporting multiple input and output formats. Transcribe audio in its original language or translate and transcribe into English for seamless content integration.',
            image: TranscribeModuleBanner,
            background: '#e4f6ff',
            isPro: true,
            active: false,
        },
        {
            module: 'fine-tune',
            title: 'Press AI Fine-Tuning',
            description: 'Maximize your AI experience with fine-tuning, delivering higher-quality results, efficient token usage, and lower latency requests. Train on more examples and streamline your prompts for optimal performance and enhanced outcomes.',
            image: FineTuneModuleBanner,
            background: '#ffeff7',
            isPro: true,
            active: false,
        }
    ]);


    useEffect(() => {
        if (menuItems.length > 0) {
            const updatedMainModuleItems = mainModuleItems.map((item) => {
                const menuItem = menuItems.find((mItem) => mItem.module === item.module);
                if (menuItem) {
                    return { ...item, active: menuItem.active };
                }
                return item;
            });
            setMainModuleItems(updatedMainModuleItems);
        }
    }, [menuItems]);


    const handleToggle = async (index) => {
        const newMainModuleItems = [...mainModuleItems];
        newMainModuleItems[index].active = !newMainModuleItems[index].active;

        // Fetch the default menu items using the fetchDefaultMenuItems function
        const defaultMenuItems = await fetchDefaultMenuItems();

        // Determine if any of the mainModuleItems has a different active status compared to the defaultMenuItems
        const hasChanged = newMainModuleItems.some((item) => {
            const defaultModuleValue = defaultMenuItems.hasOwnProperty(item.module) ? defaultMenuItems[item.module] : false;
            return defaultModuleValue != null && item.active !== defaultModuleValue;
        });

        // Show the bottom popup if there's any change in the active status
        setBottomPopup(hasChanged);

        setMainModuleItems(newMainModuleItems);

        // Update the 'active' key of the menu item in SettingsPage
        onUpdateMenuItemActive(newMainModuleItems[index].module, newMainModuleItems[index].active);
    };


    const fetchDefaultMenuItems = async () => {
        // Fetch the default menu items using the getOption function
        const optionValue = await getOption('pressai_module_setting');

        if (optionValue.status) {
            // Assuming the moduleSettings contains the default menu items
            return optionValue.data;
        } else {
            // If the API call fails or returns an error, return an empty array
            return [''];
        }
    };

    const handleBottomPopupClose = () => {
        setBottomPopup(false);
    }

    const handleBottomPopupSave = async () => {
        // Generate the array from mainModuleItems
        const moduleSettings = mainModuleItems.reduce((acc, item) => {
            acc[item.module] = item.active;
            return acc;
        }, {});

        // Call setOption with the generated array and the specified name
        const response = await setOption('pressai_module_setting', moduleSettings);

        // Handle the response
        if (response.status) {
            // Success: show success message and hide it after 3 seconds
            setSuccessMessage('Great! Your settings were saved successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            // Error
            console.log('Error saving settings', response.message);
        }

        // Close the bottom popup
        setBottomPopup(false);
    };


    useEffect(() => {
        if (successMessage !== '') {
            const timer = setTimeout(() => {
                setSuccessMessage(''); // Clear the success message after 5 seconds
            }, 5000);

            // This will clear the timeout if the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div>
            <div className="p-8">
                <h2 className="text-xl mb-2">Press AI Modules</h2>
                <p className="text-gray-500 mb-4">Please activate the required modules for your website.</p>
            </div>
            <hr className="border-t horizontal-line"/>
            <div className="p-8">
                <h3 className="text-lg mb-4">Press AI Main Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {mainModuleItems.map((item, index) => {
                        const ModuleImage = item.image;
                        return (
                            <div key={index} className="bg-white rounded-md border border-gray-300 flex flex-col">
                                <div
                                    className="relative h-64 mb-4 rounded-t-md overflow-hidden"
                                    style={{ background: item.background }}
                                >
                                    <ModuleImage className={`absolute top-0 left-1/2 transform -translate-x-1/2`} alt={item.title} />
                                </div>
                                <div className="p-4 flex-grow">
                                    <h4 className="text-lg mb-2">{item.title}</h4>
                                    <p className="text-gray-600 mb-4">{item.description} </p>
                                    <a target="_blank" href={item.learnMoreLink} className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
                                        Learn more <CustomIcon iconName="fa-solid fa-arrow-right" className="ml-1" />
                                    </a>
                                    <hr className="border-t horizontal-line my-4" />
                                    <div className="flex justify-between items-center p-2">
                                        {item.isPro ? (
                                            <button
                                                type="button"
                                                className="bg-pressai-light hover:bg-purple-300 text-pressai-primary py-2 px-4 w-full rounded mt-2"
                                                onClick={() => window.open('https://press.ai/wordpress/', '_blank')}
                                            >
                                                <CustomIcon iconName="fa-solid fa-lock" className="pr-2"/> Unlock with Premium
                                            </button>
                                        ) : (
                                            <span>Enable Feature</span>
                                        )}

                                        {!item.isPro && (
                                            <ToggleButton
                                                active={item.active}
                                                onToggle={() => handleToggle(index)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

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
    );
};

export default MainModule;

