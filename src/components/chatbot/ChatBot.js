import React, {useEffect, useRef, useState} from 'react';
import CustomIcon from '../common/CustomIcon';
import { sendMessage } from './ChatBotAPI';
import TypingAnimation from './TypingAnimation';
import UserTextBubble from "./UserTextBubble";
import BotTextBubble from "./BotTextBubble";
import {getOption} from "../../api/OptionsRelated";
import Logo from '../../../dist/images/PressAI.svg'

// Import the CSS here

export const ChatBot = (props) => {
    // Manage conversation state internally
    const [conversation, setConversation] = useState(props.conversation);
    const [chatOpen, setChatOpen] = useState(false);
    const [isAssistantTyping, setIsAssistantTyping] = useState(false);
    const lastMessageRef = useRef();
    const [chatbotSettings, setChatbotSettings] = useState({});
    const [isHoveredClearButton, setIsHoveredClearButton] = useState(false);
    const [isHoveredCloseButton, setIsHoveredCloseButton] = useState(false);



    let textRef = React.createRef();

    useEffect(() => {
        if (textRef.current) {
            textRef.current.focus();
        }
    }, [conversation]);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getOption("pressai_chatbot_config");
            setChatbotSettings(settings.data);
        };
        loadSettings();

    }, []);

    const toggle = (e) => {
        setChatOpen(!chatOpen);

        if (!chatOpen && conversation.length === 0) {
            // first time when use will open the chat popup
            initConversation();
        }
    };

    const closeChatBox = () => {
        setChatOpen(false);
    };

    const cleanChatHistory = async () => {
        setConversation(conversation.slice(0, 2));
    };
    const initConversation = async () => {
        // Use the WordPress API to fetch the current page content
        const contentType = determineContentType(window.location.pathname);
        const apiUrl = fetchContentAPI(contentType);

        if (apiUrl) {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const systemMessage = generateSystemMessage(contentType, data)

            const systemMessageObject = {
                role: 'system',
                content: systemMessage,
                timestamp: new Date().toISOString(),
            };
            setConversation([...conversation, systemMessageObject]);
            await conversationAssistant(systemMessageObject);
        } else {
            setConversation([...conversation, { role: 'assistant', content: "We are sorry, but we are unable to help you at this time."}]);
            scrollToBottom();
        }
    };

    function generateSystemMessage(contentType, data) {
        let initMessage = "You are a helping chat-bot, designed to answer user questions based on the specific given context only." +
            " If a user asks a question that doesn't relate to the given context, please redirect them back to the topic at hand, " +
            "and remind them to stay within the parameters of the provided information. Answering questions unrelated to the" +
            " topic is not your purpose. Do not attempt to provide information that isn't available in the context provided."


        if (chatbotSettings.language !== "English") {
            initMessage += "Behave like a chatbot who always speaks " + chatbotSettings.language + ". ";
        }

        let allContentLength = 0;
        data.forEach(post => {
            allContentLength += post.content.rendered.length;
        });

        let tokenAllowance = 3000 - initMessage.length; // reserving tokens for initial message and additional stuff
        let contentProportion = tokenAllowance / allContentLength;

        if (contentType.type === 'post' || contentType.type === 'page') {
            initMessage += "First greet user based on page content. Here is the page content: \n";
            if (data && data[0] && data[0].title) {
                initMessage += "Title: " + data[0].title.rendered + "\n";
            } else {
                console.error("Unexpected data structure", data);
            }

            let substringLength = Math.floor(data[0].content.rendered.length * contentProportion);
            initMessage += "Content: " + data[0].content.rendered.substring(0, substringLength);
        } else if (contentType.type === 'homepage' || contentType.type === 'archive') {
            let contentTypeName = contentType.type === 'homepage' ? 'homepage' : 'archive';
            let taxonomyName = contentType.taxonomy === 'category' ? 'Category' : 'Tag';
            initMessage += `First greet user based on the ${contentTypeName} content. Here are the latest posts: \n`;
            if (contentType.type === 'archive') {
                initMessage += `Here are the posts in the ${taxonomyName} '${contentType.taxonomySlugOrId}': \n`;
            }
            data.forEach(post => {
                initMessage += "Title: " + post.title.rendered + "\n";
                let substringLength = Math.floor(post.content.rendered.length * contentProportion);
                initMessage += "Content: " + post.content.rendered.substring(0, substringLength) + "\n\n";
            });
        }

        return initMessage;
    }



    function fetchContentAPI(contentType) {
        let apiUrl;
        if (contentType.type === 'post' || contentType.type === 'page') {
            apiUrl = `/wp-json/wp/v2/${contentType.type}s?slug=${contentType.slugOrId}`;
        } else if (contentType.type === 'homepage') {
            // Fetch the homepage content, for example, the latest posts
            apiUrl = '/wp-json/wp/v2/posts?per_page=10';
        } else if (contentType.type === 'archive') {
            const taxonomyQueryParam = contentType.taxonomy === 'category' ? 'categories' : 'tags';
            apiUrl = `/wp-json/wp/v2/posts?${taxonomyQueryParam}=${contentType.taxonomySlugOrId}`;
        }

        return apiUrl;
    }

    function determineContentType(pathname) {
        const pathArray = pathname.split('/').filter(part => part !== '');

        if (pathArray.length === 0) {
            return { type: 'homepage' };
        } else if (pathArray.includes('category') || pathArray.includes('tag')) {
            const taxonomy = pathArray.includes('category') ? 'category' : 'tag';
            const taxonomySlugOrId = pathArray[pathArray.indexOf(taxonomy) + 1];
            return { type: 'archive', taxonomy, taxonomySlugOrId };
        } else {
            const lastPart = pathArray[pathArray.length - 1];
            const isId = !isNaN(lastPart);
            const slugOrId = isId ? 'p=' + lastPart : lastPart;
            const isPage = pathArray.includes('page');
            const type = isPage ? 'page' : 'post';

            return { type, slugOrId };
        }
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && textRef.current.value.trim() !== '') {
            handleSend();
        }
    };

    const handleSend = (e) => {
        const userMessage = textRef.current.value;
        textRef.current.value = ''; // Clear input field

        // Add user message to the conversation array
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
        };
        setConversation((prevConversation) => [
            ...prevConversation,
            newUserMessage,
        ]);

        // Update conversation with the assistant's response
        conversationAssistant(newUserMessage);
    };


    // TO-DO: Need to uncomment this
    const conversationAssistant = async (message) => {
        // Scroll to bottom after updating conversation
        scrollToBottom();
        setIsAssistantTyping(true);
        // Call the API to get the assistant's response


       const assistantResponse = await sendMessage({ conversation: [...conversation, message] });

        setIsAssistantTyping(false);


        // Check if the assistantResponse is not undefined and has the content property
        if (assistantResponse && assistantResponse.hasOwnProperty('content')) {
            // Add assistant message to the conversation array
            if(conversation.length <= 1 && chatbotSettings.firstMessage !== "") {
                const firstMessage = {
                    role: 'assistant',
                    content: chatbotSettings.firstMessage,
                    timestamp: new Date().toISOString(),
                };
                setConversation((prevConversation) => [
                    ...prevConversation,
                    firstMessage,
                ]);
            }else {
                setConversation((prevConversation) => [
                    ...prevConversation,
                    {
                        ...assistantResponse,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }
            // Scroll to bottom after updating conversation
            scrollToBottom();
        } else {
            console.error("Invalid assistant response: ", assistantResponse);
        }

        //alert(JSON.stringify(conversation));
    }

    const scrollToBottom = () => {
        if (lastMessageRef.current) {
            setTimeout(() => {
                lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
            <div>
                <div className={`fixed bottom-20 ${chatbotSettings.buttonAlignment === 'right' ? 'right-4' : 'left-4'}  ${chatOpen ? '' : 'hidden'}`} style={{ zIndex: 9999 }}>
                    <div className="flex h-96 flex-1 overflow-hidden border border-gray-200 bg-white shadow-xl sm:h-[80dvh] sm:rounded-xl" style={{ width: '400px' }}>

                    <div className="flex w-full flex-1 overflow-hidden border border-gray-200 bg-white shadow-xl sm:h-[80dvh] sm:max-w-md sm:rounded-xl">
                            <div className="flex min-h-0 flex-1 flex-col">

                                {/* chatbox header */}
                                <div className="shrink-0 px-4 py-3 border-b">
                                    <div className="flex items-center justify-between gap-6">


                                        <p className="min-w-0 flex-1 text-lg font-bold text-gray-900">
                                            {chatbotSettings.name || "Press AI"}
                                        </p>

                                        <div className="flex items-center justify-end gap-4">



                                            <button
                                                onClick={cleanChatHistory}
                                                onMouseEnter={() => setIsHoveredClearButton(true)}
                                                onMouseLeave={() => setIsHoveredClearButton(false)}
                                                className={`inline-flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 p-1.5 shadow-sm transition-all duration-150 focus:outline-none ${
                                                    isHoveredClearButton ? "text-white" : "text-gray-900"
                                                }`}
                                                style={{
                                                    backgroundColor: isHoveredClearButton
                                                        ? chatbotSettings.color || "#7031f5"
                                                        : "transparent",
                                                }}
                                            >
                                                <CustomIcon iconName="fa-solid fa-trash-can" className="w-3 h-3"/>
                                            </button>

                                            <button
                                                onClick={closeChatBox}
                                                onMouseEnter={() => setIsHoveredCloseButton(true)}
                                                onMouseLeave={() => setIsHoveredCloseButton(false)}
                                                className={`-m-1.5 inline-flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 p-1.5 shadow-sm transition-all duration-150 focus:outline-none ${
                                                    isHoveredCloseButton ? "text-white" : "text-gray-900"
                                                }`}
                                                style={{
                                                    backgroundColor: isHoveredCloseButton
                                                        ? chatbotSettings.color || "#7031f5"
                                                        : "transparent",
                                                }}
                                            >
                                                <CustomIcon iconName="fa-solid fa-xmark" />
                                            </button>



                                        </div>
                                    </div>
                                </div>

                                {/* end of chatbox header  */}


                                {/*  chat box body  */}
                                <div id="chat-bubble-container" className="flex flex-1 flex-col space-y-6 overflow-y-auto p-4">


                                    {/*{alert(JSON.stringify(chatbotSettings))}*/}

                                    {chatbotSettings.description && (
                                        <div
                                            className="bg-pressai-light text-pressai-primary border-pressai-primary border p-4 rounded-md mb-4"
                                        >
                                            <p className="text-sm text-center">{chatbotSettings.description}</p>
                                        </div>
                                    )}


                                    {conversation.map((msg, i) => {
                                        if (msg.role !== 'system') {
                                            return (
                                                <div key={i} ref={i === conversation.length - 1 ? lastMessageRef : null}>
                                                    {msg.role === 'user' ? (
                                                        <UserTextBubble content={msg.content} timestamp={msg.timestamp}  chatbotSettings={chatbotSettings} />
                                                    ) : (
                                                        <BotTextBubble content={msg.content} timestamp={msg.timestamp} chatbotSettings={chatbotSettings} />
                                                    )}
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}

                                    {/* Render the typing animation based on the isAssistantTyping state */}
                                    { isAssistantTyping && (
                                        <div className="assistant">
                                        <TypingAnimation />
                                        </div>
                                    )}

                                </div>
                                {/*  end of chatbox body  */}





                                <div className="shrink-0 px-4 py-3">
                                <div className="relative">
                                    <div>
                                        <label className="sr-only">Write message</label>
                                        <input
                                            ref={textRef}
                                            onKeyDown={handleKeyPress}
                                            type="text"
                                            placeholder="Ask me anything about this site..."
                                            className="block w-full resize-none rounded-full border-transparent bg-gray-100 py-3 pl-4 pr-24 text-base text-gray-900 caret-blue-500 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            aria-label="Write message"
                                            autoComplete="off"/>
                                    </div>

                                    <div className="absolute inset-y-0 right-1 flex items-center">
                                        <button
                                            onClick={handleSend}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent p-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            style={{ backgroundColor: chatbotSettings.color || "#7031f5" }}
                                        >
                                            <CustomIcon iconName="fa-solid fa-paper-plane" size="xl" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                                {chatbotSettings.showBranding && (
                                    <div className="flex items-center justify-center gap-1.5 px-4 pb-3">
                                        <p className="text-sm tracking-tight text-gray-400">
                                            Powered by
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Logo className="h-4 w-auto" />

                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://press.ai"
                                                className="isomorphic-link isomorphic-link--external text-sm font-medium tracking-tight text-gray-500 transition-all duration-150 hover:text-blue-500 hover:underline"
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                Press AI
                                            </a>

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                </div>


                {
                    Object.keys(chatbotSettings).length !== 0 && (
                        <button
                            onClick={toggle}
                            className={`fixed bottom-4 ${chatbotSettings.buttonAlignment === 'right' ? 'right-4' : 'left-4'} text-white ${chatbotSettings.showButtonText && !chatOpen ? 'w-auto' : 'w-14'} h-14 flex items-center justify-center rounded-full px-4`}
                            style={{ backgroundColor: chatbotSettings.color || "#7031f5" }}
                        >
                            {chatOpen ? (
                                <CustomIcon iconName="fa-solid fa-xmark" size="xl" />
                            ) : (
                                <>
                                    <CustomIcon iconName={chatbotSettings.buttonIcon || "fa-solid fa-robot"} size="xl" />
                                    {chatbotSettings.showButtonText && (
                                        <span className="ml-2">{chatbotSettings.buttonText || 'Chat'}</span>
                                    )}
                                </>
                            )}
                        </button>
                    )
                }

            </div>
    );
};

ChatBot.defaultProps = {
    conversation: [],
};