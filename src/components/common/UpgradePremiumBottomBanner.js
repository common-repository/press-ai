import React from 'react';
import CustomIcon from "./CustomIcon";

function UpgradePremiumBottomBanner() {

    return (
        <div className="bg-white mt-5 p-5 mr-10 border rounded-lg md:w-2/5">
            <h2 className="text-pressai-primary font-semibold text-xl mb-3">
                Upgrade to Press AI Premium
            </h2>

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
    );
}


export default UpgradePremiumBottomBanner;