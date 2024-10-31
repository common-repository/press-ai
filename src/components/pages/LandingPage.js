import React, {useEffect, useState} from 'react';
import Logo from '../../../dist/images/press-ai-square-logo.svg';
import UpgradePremiumRightBanner from "../common/UpgradePremiumRightBanner";
import AcademyBanner from "../common/AcademyBanner";
import ApiKeySetupTab from "../dashboard/ApiKeySetupTab";
import DashboardTab from "../dashboard/DashboardTab";
import NavBar from '../common/NavBar';
import { goToPage } from '../../utils';
import {getOption, setOption} from "../../api/OptionsRelated";
import FirstTimePage from "./FirstTimePage";
import CustomIcon from "../common/CustomIcon";

function LandingPage() {

    const [activeComponent, setActiveComponent] = useState('');
    const [firstTimeLoading, setFirstTimeLoading] = useState(false);
    const [loading, setLoading] = useState(true); // introduce new state variable


    useEffect(() => {
        fetchFirstTimeLoading();
        const initialHash = window.location.hash;
        if (initialHash === '' || initialHash === '#/dashboard/') {
            window.location.hash = '#/dashboard';
        }
        setActiveComponent(initialHash);

        // Listen for changes to the hash part of the URL
        window.addEventListener("hashchange", handleHashChange);

        // Clean up the event listener on unmount
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const fetchFirstTimeLoading = async () => {
        try {
            const optionValue = await getOption('pressai_first_time_loading');
            if (optionValue.status && optionValue.data) {
                setFirstTimeLoading(false);
            } else {
                setFirstTimeLoading(true);
            }
        } catch (error) {
            console.error('Error failed to fetch an option', error);
            setFirstTimeLoading(true);
        } finally {
            setLoading(false); // set loading to false regardless of success or failure
        }
    };

    const goToConfigDashboardPage = async () => {
        await setOption('pressai_first_time_loading', true);
        goToPage("dashboard");
        setFirstTimeLoading(false);
    };

    const goToConfigAPIPage = async () => {
        goToPage('api-key-config');
    };


    const handleHashChange = () => {
        setActiveComponent(window.location.hash);
    };

    const renderContentBody = () => {
        switch (activeComponent) {
            case "#/dashboard":
                return <DashboardTab goToConfigAPIPage = {() => goToConfigAPIPage()} />;
            case "#/api-key-config":
                return <ApiKeySetupTab />;
            default:
                return null;
        }
    }

    if (loading) { // if still loading, render null or a loading indicator
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CustomIcon iconName="fa-solid fa-spinner" className="animate-spin text-pressai-primary h-12 w-12" />
            </div>
        );
    }

    return (
        firstTimeLoading ? <FirstTimePage goToConfigDashboardPage = {() => goToConfigDashboardPage()} />: (<div className="min-h-screen bg-gray-100">
            <NavBar textNavbar="Dashboard"/>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white p-16 rounded-lg shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-2/2 xl:w-2/3 mx-auto">
                    <div className="w-5 h-5 inline-block mr-1 mb-10">
                        <Logo className="w-10 h-10 inline-block mr-1" />
                    </div>
                    <p className="text-gray-500">GET STARTED WITH PRESS AI</p>
                    <h2 className="text-2xl my-3">Welcome to Press AI.</h2>
                    <p className="mb-6">
                        Welcome to Press AI! To get started, please enter your
                        <a className="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank"> OpenAI API key </a>
                        in the dashboard configuration settings. Once completed, head to the Settings page to customize and configure the modules
                        you'd like to implement on your website. For additional guidance, browse our detailed tutorials, or feel free to
                        reach out if you have any questions. Let's unleash the power of AI together!
                    </p>
                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-pressai-primary text-white py-2 px-4 rounded"
                            onClick={() => goToPage("api-key-config")}
                        >
                            API Key Configuration
                        </button>
                        <a
                            onClick={() => goToPage('settings/main-module')}
                            className="text-pressai-primary cursor-pointer"
                        >
                            Main Settings
                        </a>
                    </div>

                </div>
            </div>


            <div className="flex flex-col md:flex-row w-full">
                <div className="flex flex-col w-full md:flex md:flex-grow mb-4 md:mb-0">
                    <div className="container mx-auto py-8">
                        <div className="relative flex space-x-4 mb-6">
                            <div className="absolute inset-x-0 bottom-0 bg-gray-300" style={{ height: "0.1rem" }}></div>
                            <button
                                type="button"
                                className={`relative z-10 ${
                                    activeComponent === "#/dashboard"
                                        ? "bg-[#f0f0f1] text-black border border-gray-300 border-b-0"
                                        : "bg-gray-200 text-gray-500 border border-gray-300 border-b"
                                } focus:outline-none cursor-pointer font-semibold text-sm py-2 px-4 rounded-t`}
                                onClick={() => goToPage("dashboard")}>
                                Dashboard
                            </button>
                            <button
                                type="button"
                                className={`relative z-10 ${
                                    activeComponent === "#/api-key-config"
                                        ? "bg-[#f0f0f1] text-black border border-gray-300 border-b-0"
                                        : "bg-gray-200 text-gray-500 border border-gray-300 border-b"
                                } focus:outline-none cursor-pointer font-semibold text-sm py-2 px-4 rounded-t`}
                                onClick={() => goToPage("api-key-config")}>
                                Open AI API Configuration
                            </button>
                        </div>
                        {renderContentBody()}
                    </div>
                </div>

                <div className="w-full md:w-1/4 ml-0 md:ml-4 flex flex-col pr-10 md:pr-10" style={{ flexShrink: 0 }}>
                    <div className="h-16"></div>
                    <UpgradePremiumRightBanner />
                    <AcademyBanner />
                </div>
            </div>

            {/*<UpgradePremiumBottomBanner />*/}

        </div>)
    );
}

export default LandingPage;
