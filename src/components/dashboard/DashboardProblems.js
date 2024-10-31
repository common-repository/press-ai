import React, {useEffect, useState} from 'react';
import CustomIcon from "../common/CustomIcon";
import {fetchDashboardItems, updateDashboardItems} from "../../api/OptionsRelated";

function DashboardProblems() {
    const [showProblems, setShowProblems] = useState(false);

    const [hiddenProblems, setHiddenProblems] = useState([]);
    const [shownProblems, setShownProblems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDashboardItems('problems');

            setHiddenProblems(data.hidden_items);
            setShownProblems(data.shown_items);
        };

        fetchData();
    }, []);

    useEffect(() => {
        updateDashboardItems(hiddenProblems, shownProblems, 'problems');
    }, [hiddenProblems, shownProblems]);


    const toggleProblem = (id) => {
        const targetProblem = hiddenProblems.find((item) => item.id === id);
        if (targetProblem) {
            setHiddenProblems(hiddenProblems.filter((item) => item.id !== id));
            setShownProblems([...shownProblems, targetProblem]);
        } else {
            const targetShownProblem = shownProblems.find((item) => item.id === id);
            setShownProblems(shownProblems.filter((item) => item.id !== id));
            setHiddenProblems([...hiddenProblems, targetShownProblem]);
        }
    };

    // Rest of the code related to problems ...

    return (
        <div className="w-full border border-gray-300 bg-white mb-4 pb-4">

            <h3 className="text-black text-lg p-4 pl-6">
                {shownProblems.length > 0 ? (
                    <span className="dashicons dashicons-flag text-red-500"></span>
                ) : (
                    <span className="dashicons dashicons-yes text-red-500"></span>
                )}
                Thank you for using Press AI Plugin
            </h3>
            <hr className="border-gray-300 border-t-1 my-2" />
            <p className="p-4">Please configure your <a className="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank"> OpenAI API </a> settings in the configuration tab on this page. You can then configure the modules that you want to implement on your website on the Settings page.</p>



            {shownProblems.map((problems) => (
                <div key={problems.id} className="px-4 pb-4">
                    <div className="relative border-l-4 border-red-500">
                        <p className="pl-2" dangerouslySetInnerHTML={{ __html: problems.content }}></p>
                        <button
                            type="button"
                            className="absolute top-0 right-0 pr-2"
                            onClick={() => toggleProblem(problems.id)}
                        >
                            <span className="screen-reader-text">Hide this item.</span>
                            <CustomIcon iconName="fa-solid fa-eye-slash" />
                        </button>
                    </div>
                </div>
            ))}

            {shownProblems.length === 0 && (
                <p className="p-4">Good job! No problem has been detected.</p>
            )}


            {hiddenProblems.length > 0 && (
                <div className="px-4 pt-4">
                    <button
                        className="w-full text-left text-lg flex items-center justify-between shadow border-l-4 border-red-500 p-4"
                        onClick={() => setShowProblems(!showProblems)}
                    >
                        You have {hiddenProblems.length} hidden problem:
                        <span className="dashicons dashicons-arrow-down-alt2 text-gray-500"></span>
                    </button>
                </div>
            )}

            {showProblems && (
                <div className="pb-4">
                    {hiddenProblems.map((problem) => (
                        <div key={problem.id} className="px-4 pb-4">
                            <div className="relative border-l-4 border-red-500 bg-gray-100">
                                <p className="pl-2" dangerouslySetInnerHTML={{ __html: problem.content }}></p>
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 pr-2"
                                    onClick={() => toggleProblem(problem.id)}
                                >
                                    <span className="screen-reader-text">Show this item.</span>
                                    <CustomIcon iconName="fa-solid fa-eye" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default DashboardProblems;
