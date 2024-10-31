import React, {useEffect, useRef, useState} from 'react';
import {getOpenAIAPIKey, getOption, setOpenAIAPIKey, setOption} from '../../api/OptionsRelated';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CustomIcon from "../common/CustomIcon";


function ApiKeySetupTab() {
    const [apiKey, setApiKey] = useState('');
    const [apiKeyStatus, setApiKeyStatus] = useState(true);
    const [apiKeyMessage, setApiKeyMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [visitedStep, setVisitedStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);


    const handleApiKeySubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        const getAPIKey = await setOpenAIAPIKey(apiKey);
        if (getAPIKey.status) {
            setApiKeyStatus(true);
            setVisitedStep(currentStep + 1);
            handleContinueStep(currentStep + 1);
        } else {
            setApiKeyStatus(false);
        }
        setApiKeyMessage(getAPIKey.message);
        setIsSaving(false);
    };

    const handleContinueStep = async (step) => {
        if (step < currentStep) {
            for (let i = step; i < steps.length; i++) {
                const verticalLine = steps[i - 1].ref.current;
                verticalLine.classList.remove('fill');
            }
        }

        setCurrentStep(step);

        async function updateStep() {
            await setOption('api_config_steps', step);
        }
        if (step > visitedStep) {
            updateStep();
        }
    };


    const handleExpandStep = async (step) => {
        if (step > 0 && step <= steps.length) {
            for (let i = steps.length - 1; i >= step - 1; i--) {
                if (steps[i].ref.current) {
                    steps[i].ref.current.classList.remove('fill');
                }
            }

            setCurrentStep(step);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const getCompletedStep = await getOption('api_config_steps');
            if (getCompletedStep.status && getCompletedStep.data) {
                setCurrentStep(parseInt(getCompletedStep.data));
                setVisitedStep(parseInt(getCompletedStep.data));
            } else {
                setCurrentStep(1);
                setVisitedStep(0);
            }

            const apiKeyResponse = await getOpenAIAPIKey();
            setApiKey(apiKeyResponse.data);
        }
        fetchData();
    }, []);


    const onEnter = (node) => {
        node.style.height = '0';
        setTimeout(() => {
            node.style.height = node.scrollHeight + 'px';
        }, 0);
    };


    const onExit = (node) => {
        node.style.height = node.scrollHeight + 'px';
        setTimeout(() => {
            node.style.height = '0';
        }, 0);
    };


    const steps = [
        {
            title: 'Sign up for OpenAI',
            ref: useRef(null),
            content: (
                <p className="text-sm">
                    To get an API key, you need to first create an account with OpenAI. Go to the OpenAI
                    website at{' '}
                    <a href="https://openai.com/" target="_blank" className="text-blue-600">
                        https://openai.com/
                    </a>{' '}
                    and click on the <b>"Sign up"</b> button in the top-right corner of the page.
                </p>
            ),
        },
        {
            title: 'Verify Your Email',
            ref: useRef(null),
            content: (
                <p className="text-sm">
                    After signing up, you'll receive an email from OpenAI with a verification link. Click on the
                    link to verify your email address and complete the sign-up process.
                </p>
            ),
        },
        {
            title: 'Apply for API Access',
            ref: useRef(null),
            content: (
                <p className="text-sm">
                    Once you have signed up and verified your email address, log in to your OpenAI account. Go to
                    the <a href="https://beta.openai.com/signup/" target="_blank" className="text-blue-600">API access</a> page and
                    fill out the form to apply for API access. You may need to provide some personal and
                    professional information, as well as agree to OpenAI's terms and conditions.
                </p>
            ),
        },
        {
            title: 'Wait for Approval',
            ref: useRef(null),
            content: (
                <p className="text-sm">
                    After submitting your API access application, you may have to wait for OpenAI to review your
                    application and grant you access to their API. The waiting time may vary depending on the
                    number of requests and other factors.
                </p>
            ),
        },
        {
            title: 'Retrieve Your API Key',
            ref: useRef(null),
            content: (
                <p className="text-sm">
                    Once your API access application is approved, log in to your OpenAI account and navigate to the{' '}
                    <a href="https://beta.openai.com/account/api-keys/" target="_blank" className="text-blue-600">
                        API Keys
                    </a>{' '}
                    page. You should see a generated API key, which you can copy to use with this plugin.
                </p>
            ),
        },
        {
            title: 'Save the API Key',
            ref: useRef(null),
            content: (
                <>
                    <p className="text-sm">
                        To use this plug-in input your API key in the input box below and save it!
                    </p>
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
                </>
            ),
        },
    ];



    return (
        <div>
            <div className="flex flex-col">
                <div className="w-full md:w-2/3 border border-gray-300 rounded-xl p-5 bg-white">

                    <TransitionGroup component="ol" className="mt-8 space-y-8">
                        {steps.map((step, index) => {
                            const isActive = index + 1 === currentStep;
                            const isCompleted = (index + 1 < currentStep) || (index < visitedStep);

                            return (
                                <li key={index} className={`pb-8 mb-0 relative max-w-none`}>
                                    {index !== steps.length - 1 && (
                                        <div
                                            ref={step.ref}
                                            className={`ml-px absolute left-3.5 w-0.5 h-full bg-slate-300 -bottom-8 vertical-line ${
                                                index + 1 < currentStep ? 'fill' : ''
                                            }`}
                                            aria-hidden="true"
                                        ></div>

                                    )}

                                    <div className="relative flex items-center group">


                                        <span className="flex items-center">
                                          <span className="relative z-10 w-8 h-8 rounded-full">
                                            <span
                                                className={`${isActive ? 'bg-white' : isCompleted ? 'bg-pressai-primary' : 'bg-white'} transition-opacity duration-500 absolute inset-0 border-2 flex items-center justify-center rounded-full ${
                                                    isActive ? 'border-pressai-primary' : isCompleted ? 'border-pressai-primary bg-pressai-primary' : 'border-slate-300'
                                                }`}
                                            >
                                              {isActive ? (
                                                  <CustomIcon iconName="fa-solid fa-circle" className="text-pressai-primary" />

                                              ) : isCompleted ? (
                                                  <CustomIcon iconName="fa-solid fa-check" className="text-white" />

                                              ) : ('')
                                              }
                                            </span>
                                          </span>
                                        </span>


                                        <span className="ml-4 min-w-0 flex flex-col">
                                            <span
                                                className={`transition-colors duration-500 text-xs font-bold tracking-wide uppercase text-slate-900`}
                                            >
                                                {step.title}
                                            </span>
                                        </span>
                                        {!isActive && steps.length <= visitedStep && (
                                            <button
                                                onClick={() => handleExpandStep(index + 1)}
                                                className="absolute right-0 py-1 px-2 bg-white text-gray-500  border border-gray-300 rounded-md shadow-md hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                                            >
                                                Expand
                                            </button>

                                        )}
                                    </div>
                                    <CSSTransition
                                        in={isActive}
                                        timeout={600}
                                        classNames="fade"
                                        unmountOnExit
                                        mountOnEnter
                                        onEnter={(node) => onEnter(node)}
                                        onExit={(node) => onExit(node)}
                                    >


                                    <div className="ml-12 mt-4 pb-1">
                                            {step.content}
                                            {index !== steps.length - 1 && (
                                                <button
                                                    onClick={() => handleContinueStep(currentStep + 1)}
                                                    className="mt-4 py-2 px-4 bg-pressai-primary text-white rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                                >
                                                    Continue
                                                </button>
                                            )}
                                            {steps.length > visitedStep && index !== steps.length - 1 && index !== 0 && (
                                                <button
                                                    onClick={() => handleContinueStep(currentStep - 1)}
                                                    className="mt-4 ml-4 py-2 px-4 text-gray-500 border border-gray-300 rounded-md shadow-md hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                                                >
                                                    Go Back
                                                </button>
                                            )}
                                        </div>
                                    </CSSTransition>
                                </li>
                            );
                        })}
                    </TransitionGroup>



                </div>
            </div>
        </div>
    );

}

export default ApiKeySetupTab;