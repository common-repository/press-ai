import React from 'react';
import CustomIcon from "../common/CustomIcon";

const WooCommerceSettings = () => {
    return (
        <div>
            <div className="p-8">
                <h2 className="text-xl mb-2">WooCommerce Settings</h2>
                <p className="text-gray-500 mb-4">WooCommerce Settings for your website.</p>
            </div>
            <hr className="border-t horizontal-line"/>
            <div className="p-8">
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        className="bg-pressai-light text-pressai-primary py-2 px-4 rounded inline-flex items-center justify-center w-2/6"
                        onClick={() => window.open('https://press.ai/wordpress/', '_blank')}
                    >
                        <span className="mr-2">Get Press AI Premium</span>
                        <CustomIcon iconName="fa-solid fa-arrow-right" />
                    </button>

                </div>

            </div>
        </div>
    );
};


export default WooCommerceSettings;