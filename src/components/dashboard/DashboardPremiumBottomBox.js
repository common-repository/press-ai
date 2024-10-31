import React from 'react';
import CustomIcon from "../common/CustomIcon";

function DashboardPremiumBottomBox() {

    return (
        <div className="w-full border border-gray-300 bg-white mb-4 pb-4">

            <h3 className="text-black text-lg p-4 pl-6">
                <span className="dashicons dashicons-yes text-pressai-primary"></span>
                Upgrade to Press AI Premium
            </h3>
            <hr className="border-gray-300 border-t-1 my-2" />

            <div className="p-4">

                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 pr-2">
                        <p className="flex items-start mb-2">
                            <CustomIcon iconName="fa-solid fa-circle-check" className="mr-2" />
                            <span className="font-bold pr-1">Custom Chatbot: </span> Train with your own Content
                        </p>

                        <p className="flex items-start mb-2">
                            <CustomIcon iconName="fa-solid fa-circle-check" className="mr-2" />
                            <span className="font-bold">Powerful Press AI API</span>
                        </p>
                        <p className="flex items-start mb-2">
                            <CustomIcon iconName="fa-solid fa-circle-check" className="mr-2" />
                            <span className="font-bold"> 24/7 email support </span>
                        </p>
                    </div>
                    <div className="w-full md:w-1/2">
                        <p className="flex items-start mb-2">
                            <CustomIcon iconName="fa-solid fa-circle-check" className="mr-2" />
                            <span className="font-bold pr-1">Embeddings: </span> Train With Multiple Content Sources
                        </p>
                        <p className="flex items-start mb-2">
                            <CustomIcon iconName="fa-solid fa-circle-check" className="mr-2" />
                            <span className="font-bold pr-1">Unbranded Widgets:</span> Remove our Branding
                        </p>
                        <p className="flex items-start mb-2">
                            <CustomIcon iconName="fa-solid fa-circle-check" className="mr-2" />
                            <span className="font-bold">No ads!</span>
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded mt-2"
                    onClick={() => window.open('https://press.ai/wordpress/', '_blank')}
                >
                    Get Press AI Premium <CustomIcon iconName="fa-solid fa-caret-right" />
                </button>


            </div>


        </div>
    );
}

export default DashboardPremiumBottomBox;
