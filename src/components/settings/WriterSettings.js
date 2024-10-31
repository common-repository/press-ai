import React, {useEffect, useState} from 'react';
import BottomPopup from "./BottomPopup";
import CustomIcon from "../common/CustomIcon";
import Dropdown from "../common/Dropdown";
import InputField from "../common/InputField";
import {getOption, setOption} from "../../api/OptionsRelated";
import debounce from 'lodash.debounce';

const WriterSettings = () => {
    const [bottomPopup, setBottomPopup] = useState(false);
    const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const WRITER_CONFIG = 'pressai_writer_config';


    const [settings, setSettings] = useState({
        aiModel: '',
        language: '',
        writingStyle: '',
        temperature: '',
        maxTokens: '',
        stopSequence: '',
        topP: '',
        frequencyPenalty: '',
        presencePenalty: '',
    });



    const languages = [
        'English', 'German', 'French', 'Spanish', 'Italian', 'Chinese', 'Japanese', 'Portuguese', 'Other'
    ];

    const writingStyles = [
        'Informative', 'Descriptive', 'Creative', 'Narrative', 'Persuasive', 'Reflective', 'Argumentative', 'Analytics', 'Evaluative', 'Journalistic', 'Technical'
    ];

    // Replace this with the actual models from the OpenAI account.
    const aiModels = [
        'gpt-3.5-turbo', 'gpt-3.5-turbo-0301', 'text-davinci-003', 'text-davinci-002', 'text-curie-001', 'text-babbage-001', 'text-ada-001'
    ];



    // Load the saved values when the component mounts
    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getOption(WRITER_CONFIG);
            if (settings.status) {
                setSettings(settings.data);
                setInitialValuesLoaded(true); // Set flag to true when initial values are loaded
            }
        };
        loadSettings();
    }, []);

    // Function to check if any value has changed and show/hide the BottomPopup accordingly
    const checkForChanges = async () => {
        if (initialValuesLoaded) {
            const savedSettings = await getOption(WRITER_CONFIG);
            const hasChanged = JSON.stringify(settings) !== JSON.stringify(savedSettings.data);
            setBottomPopup(hasChanged);
        }
    };



    const handleBottomPopupClose = () => {
        setBottomPopup(false);
    }

    // Save the settings using setOption
    const handleBottomPopupSave = async () => {
        await setOption(WRITER_CONFIG, settings);
        setSuccessMessage('Great! Your settings were saved successfully.');
        setBottomPopup(false);
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
    // Call checkForChanges whenever any of the settings change
    useEffect(() => {
        if (initialValuesLoaded) {
            debouncedCheckForChanges();
        }
    }, [settings]);

    const handleInputChange = (name) => (value) => {
        setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
    };


    return (
        <div>
            <header className="p-8 border-b border-gray-300">
                <div className="max-w-screen-sm">
                    <h1 className="text-xl">Writer Basics</h1>
                    <p className="text-sm text-gray-500 mt-3">Configure the basics for Press AI Writer.</p>
                </div>
            </header>
            <div className="flex flex-col h-full">
                <div className="flex-grow p-8">
                    <div className="max-w-5xl">
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="col-span-1">
                                <div className="max-w-screen-sm">
                                    <h2 className="text-lg">Writer Configuration</h2>
                                    <p className="mt-2 text-gray-500">Set the basic configuration of the writer to get quality content</p>
                                </div>
                            </div>

                            <fieldset className="col-span-2 space-y-8">
                                <Dropdown
                                    label="AI Models"
                                    options={aiModels}
                                    selectedOption={settings.aiModel}
                                    setSelectedOption={handleInputChange('aiModel')}
                                    onChange={handleInputChange('aiModel')}
                                />

                                <Dropdown
                                    label="Language"
                                    options={languages}
                                    selectedOption={settings.language}
                                    setSelectedOption={handleInputChange('language')}
                                    onChange={handleInputChange('language')}
                                />


                                <Dropdown
                                    label="Writing Style"
                                    options={writingStyles}
                                    selectedOption={settings.writingStyle}
                                    setSelectedOption={handleInputChange('writingStyle')}
                                    onChange={handleInputChange('writingStyle')}
                                />

                                <InputField
                                    label="Temperature"
                                    type="float"
                                    id="temperature"
                                    value={settings.temperature}
                                    onChange={handleInputChange('temperature')}
                                    description="Between 0 and 2. Higher values mean the model will take more risks."
                                    min={0}
                                    max={2}
                                />

                                <InputField
                                    label="Max Tokens"
                                    type="integer"
                                    id="maxTokens"
                                    value={settings.maxTokens}
                                    onChange={handleInputChange('maxTokens')}
                                    description="The maximum number of tokens to generate. The model will stop generating once it hits this limit."
                                />

                                <InputField
                                    label="Stop Sequence"
                                    type="text"
                                    id="stopSequence"
                                    value={settings.stopSequence || ''}
                                    onChange={handleInputChange('stopSequence')}
                                    description="The sequence of tokens that will cause the model to stop generating text. You absolutely need this with fine-tuned models."
                                />

                                <InputField
                                    label="Top P"
                                    type="float"
                                    id="topP"
                                    value={settings.topP}
                                    onChange={handleInputChange('topP')}
                                    description="Between 0 and 1. The probability of selecting the next token among the most likely tokens. Lower values means the model will take more risks."
                                    min={0}
                                    max={1}
                                />

                                <InputField
                                    label="Frequency Penalty"
                                    type="float"
                                    id="frequencyPenalty"
                                    value={settings.frequencyPenalty}
                                    onChange={handleInputChange('frequencyPenalty')}
                                    description="Between -2 and 2. The higher this value, the less likely the model will repeat the same words."
                                    min={-2.0}
                                    max={2.0}
                                />

                                <InputField
                                    label="Presence Penalty"
                                    type="float"
                                    id="presencePenalty"
                                    value={settings.presencePenalty}
                                    onChange={handleInputChange('presencePenalty')}
                                    description="Between -2 and 2. The higher this value, the less likely the model will talk about the same topic again."
                                    min={-2.0}
                                    max={2.0}
                                />
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

export default WriterSettings;
