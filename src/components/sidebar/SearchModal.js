import React, {useState} from 'react';
import { Dialog, Transition } from '@headlessui/react';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) {
        return null;
    }


    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={onClose}
            >
                {/* Overlay */}
                <div className="min-h-screen px-4 text-center bg-black bg-opacity-40">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* Modal */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                    <div className="inline-block w-full max-w-md my-8 p-6 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-lg relative">

                    <div className="relative">
                            <button
                                onClick={onClose}
                                className="absolute top-1/2 right-4 text-gray-500 hover:text-gray-700 transform -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                    role="img"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="absolute top-1/2 left-4 h-5 w-5 text-gray-400 transform -translate-y-1/2"
                                role="img"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>

                            <input
                                placeholder="Search..."
                                aria-label="Search"
                                className="h-14 w-full border-0 rounded-lg sm:text-sm bg-transparent px-11 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="input-search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                        </div>
                        <div className="border-t border-gray-100 p-6 py-12 space-y-3 text-center text-sm">
                            <span className="block font-semibold text-gray-900">Search</span>
                            <p className="text-gray-500">
                                Please enter a search term with at least 3 characters.
                            </p>
                        </div>


                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default SearchModal;

