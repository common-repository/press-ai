import React from 'react';
import CustomIcon from './CustomIcon';
import { goToPage } from '../../utils';

function NavBar({textNavbar}) {
    return (
        <nav className="bg-white shadow">
            <div className="pl-4 pr-52 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-1 font-semibold">
                    <a className="text-pressai-primary" href="/">Home</a>
                    <span>/</span>
                    <span>{textNavbar}</span>
                </div>

                <div className="flex space-x-6 text-gray-500">
                    <button
                        type="button"
                        className="text-center focus:outline-none hover:text-gray-700 cursor-pointer"
                        onClick={() => goToPage('dashboard')}
                    >
                        <CustomIcon iconName="fa-solid fa-key" className="mb-1" />
                        <p>API Key Configuration</p>
                    </button>
                    <button
                        type="button"
                        className="text-center focus:outline-none hover:text-gray-700 cursor-pointer"
                        onClick={() => goToPage('settings/main-module')}
                    >
                        <CustomIcon iconName="fa-solid fa-cog" className="mb-1" />
                        <p>Main Settings</p>
                    </button>
                    <button
                        type="button"
                        className="text-center focus:outline-none hover:text-gray-700 cursor-pointer"
                        onClick={() => window.open('https://press.ai/support/', '_blank')}
                    >
                        <CustomIcon iconName="fa-solid fa-question-circle" className="mb-1" />
                        <p>Help & Support</p>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
