import React from 'react';
import CustomIcon from '../common/CustomIcon';
import BannerSquare from '../../../dist/images/pressai-banner-square.svg';
import APISettingsBackground from '../../../dist/images/pressai-api-settings-white-background.svg';

function FirstTimePage({goToConfigDashboardPage}) {

    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen">
            <div className="w-full lg:w-1/2">
                <h1 className="text-center font-bold text-3xl"><div>You've successfully</div> <div>installed <span className="text-pressai-primary">PressAI!</span></div></h1>

                <div className="mt-10 flex items-center justify-center mx-4">
                    <div className="w-6 h-6 flex items-center justify-center text-pressai-primary rounded-full">
                        <CustomIcon iconName="fa-solid fa-check-circle" className="text-4xl" />
                    </div>
                    <div className="h-1 bg-pressai-primary flex-grow mr-1 max-w-1/2"></div>
                    <div className="w-6 h-6 flex items-center justify-center text-pressai-primary rounded-full">
                        <CustomIcon iconName="fa-regular fa-circle-dot" className="text-4xl" />
                    </div>
                </div>


                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex justify-center">
                        <div className="card bg-white p-5 rounded-md shadow border-none">
                            <h5 className="text-lg font-bold mb-2">Congratulations!</h5>

                            <p className="text-gray-500">You have installed and activated the plugin successfully. You are only a step away from making the most of our Generative AI tools and solutions.</p>

                            <div className="flex items-center justify-center mt-4">
                                {/*<CustomIcon iconName="fa-solid fa-rocket" className="text-pressai-primary text-6xl" />*/}
                                <BannerSquare/>
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center mt-4 lg:mt-0">
                        <div className="card bg-pressai-primary text-white p-5 rounded-md shadow border-none">
                            <h5 className="text-lg font-bold mb-2">Configure API Settings</h5>
                            <p className="text-white" >To fully activate the plugin's features, please configure the OpenAI API settings.</p>

                            <div className="flex items-center justify-center mt-4">
                                {/*<CustomIcon iconName="fa-solid fa-key" className="text-white mb-4 text-6xl" />*/}
                                <APISettingsBackground/>
                            </div>

                            <button onClick={goToConfigDashboardPage} type="button" className="bg-white text-pressai-primary text-sm w-full mt-4 py-2 rounded flex items-center justify-center">
                                Setup OpenAI API Key
                                <CustomIcon iconName="fa-solid fa-arrow-right" className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FirstTimePage;
