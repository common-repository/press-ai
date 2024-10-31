import React, {useState} from 'react';
import SidebarMenu from './SidebarMenu';
import Logo from '../../../assets/images/PressAIText.svg';
import SearchModal from "./SearchModal";

const Sidebar = ({ menuItems, expandedMenu}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto mt-16 px-6">
            <div className="flex h-16 shrink-0 items-center justify-content-start">
                <Logo className="w-auto h-12"/>
            </div>

            {/*<button*/}
            {/*    onClick={() => setIsModalOpen(true)}*/}
            {/*    id="button-search"*/}
            {/*    type="button"*/}
            {/*    className="w-full flex items-center bg-white text-sm leading-6 text-gray-500 rounded-md border border-gray-300 shadow-sm py-1.5 pl-2 pr-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"*/}
            {/*>*/}
            {/*    <svg*/}
            {/*        xmlns="http://www.w3.org/2000/svg"*/}
            {/*        fill="none"*/}
            {/*        viewBox="0 0 24 24"*/}
            {/*        strokeWidth="2"*/}
            {/*        stroke="currentColor"*/}
            {/*        aria-hidden="true"*/}
            {/*        className="flex-none w-5 h-5 mr-3 text-gray-400"*/}
            {/*        role="img"*/}
            {/*    >*/}
            {/*        <path*/}
            {/*            strokeLinecap="round"*/}
            {/*            strokeLinejoin="round"*/}
            {/*            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"*/}
            {/*        ></path>*/}
            {/*    </svg>*/}
            {/*    <span className="overflow-hidden whitespace-nowrap text-ellipsis">*/}
            {/*        Quick search...*/}
            {/*    </span>*/}
            {/*    <span className="ml-auto flex-none text-xs font-semibold text-gray-400">*/}
            {/*        ⌘K*/}
            {/*    </span>*/}
            {/*</button>*/}

            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {menuItems.map((item) => (
                        item.active ? (
                            <SidebarMenu key={item.title} menu={item} expandedMenu={expandedMenu} />
                        ) : null
                    ))}

                </ul>
            </nav>

            <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Sidebar;
