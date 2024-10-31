import React from 'react';
import CustomIcon from "./CustomIcon";
import Logo from '../../../dist/images/press-ai-square-logo-text.svg';

function UpgradePremiumRightBanner() {

    return (

            <div className="bg-pressai-dark rounded-lg p-8 relative">
                <Logo className="w-16 h-16 absolute top-[-20px] left-[50%] transform -translate-x-1/2  border-2 border-white" />
                <h3 className="font-bold text-lg text-white mt-8 mb-2">Get Press AI Premium</h3>
                <p className="text-white">
                    Gain exclusive early access to latest AI features and tools, enjoy round-the-clock support, and supercharge your productivity and content creation journey. Stay ahead of the curve with Press AI Premium.
                </p>
                <button
                    type="button"
                    className="bg-pressai-light text-pressai-primary py-2 px-4 mt-4 rounded inline-flex items-center justify-center w-full"
                    onClick={() => window.open('https://press.ai/wordpress/', '_blank')}
                >
                    <span className="mr-2">Get Press AI Premium</span>
                    <CustomIcon iconName="fa-solid fa-arrow-right" />
                </button>
                {/*<a href="#" className="text-white mt-4 inline-block">Read reviews from real users</a>*/}

                <div className="flex items-center justify-center space-x-1 mt-2 text-white">
                    <CustomIcon iconName="fa-brands fa-wordpress" className="h-5 w-5 mr-2 text-white" />
                    <CustomIcon iconName="fa-solid fa-star" className="text-yellow-400" />
                    <CustomIcon iconName="fa-solid fa-star" className="text-yellow-400" />
                    <CustomIcon iconName="fa-solid fa-star" className="text-yellow-400" />
                    <CustomIcon iconName="fa-solid fa-star" className="text-yellow-400" />
                    <CustomIcon iconName="fa-solid fa-star-half-alt" className="text-yellow-400" />
                    {/*<span>4.6/5</span>*/}
                </div>

            </div>
    );

}

export default UpgradePremiumRightBanner;