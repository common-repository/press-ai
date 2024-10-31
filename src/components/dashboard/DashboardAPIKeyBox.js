import React, {useEffect, useState} from 'react';
import {
    getOpenAIAPIKey,
    setOpenAIAPIKey,
} from "../../api/OptionsRelated";

function DashboardAPIKeyBox({goToConfigAPIPage}) {

    const [apiKey, setApiKey] = useState('');
    const [apiKeyStatus, setApiKeyStatus] = useState(true);
    const [apiKeyMessage, setApiKeyMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleApiKeySubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        const getAPIKey = await setOpenAIAPIKey(apiKey);
        if (getAPIKey.status) {
            setApiKeyStatus(true);
        } else {
            setApiKeyStatus(false);
        }
        setApiKeyMessage(getAPIKey.message);
        setIsSaving(false);
    };

    useEffect(() => {
        async function fetchData() {
            const apiKeyResponse = await getOpenAIAPIKey();
            setApiKey(apiKeyResponse.data);
        }
        fetchData();
    }, []);

    return (
        <div className="w-full border border-gray-300 bg-white mb-4 pb-4">

            <h3 className="text-black text-lg p-4 pl-6">
                {!apiKeyStatus ? (
                    <span className="dashicons dashicons-flag text-red-500"></span>
                ) : (
                    <span className="dashicons dashicons-yes text-pressai-primary"></span>
                )}
                Open AI API Configuration
            </h3>
            <hr className="border-gray-300 border-t-1 my-2" />

            <div className="p-4">
                <p>Please enter your <a className="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank"> OpenAI API key </a>. If you don't have an API key, follow the steps in the <a className="text-pressai-primary cursor-pointer" onClick={goToConfigAPIPage}> Open AI API configuration</a> tab.</p>
                <form onSubmit={handleApiKeySubmit} className="mt-4 space-y-4">
                    <div>
                        <input
                            type="text"
                            className={`form-input w-7/12 border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${
                                apiKeyStatus ? (apiKeyMessage ? 'valid' : '') : 'invalid'
                            }`}
                            id="inputAPIKey"
                            placeholder="API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-3 py-2 bg-pressai-primary text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            Save API Key
                        </button>

                        {isSaving ? (
                            <div className="flex items-center ml-4">
                                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pressai-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-pressai-primary"></span>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>

                </form>

                {apiKeyStatus && apiKeyMessage && <p className="text-green-600 mt-2">{apiKeyMessage}</p>}
                {!apiKeyStatus && apiKeyMessage && <p className="text-red-600 mt-2">{apiKeyMessage}</p>}

            </div>


        </div>
    );
}

export default DashboardAPIKeyBox;
