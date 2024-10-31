<?php

namespace PressAI\Editor;

class Components {
    public static function pressai_editor_button(): void {
        static $cache = null;

        if($cache === null) {
            $cache = true;
        } else {
            return;
        }
        ?>



        <button id="pressai_main_button" type="button" class="bg-pressai-primary mx-2 px-2.5 py-1.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">

                <span class="flex items-center justify-center">
                    PressAI
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="h-4 w-4 text-white group-hover:text-indigo-600 transition-colors ml-2" aria-hidden="true">
                        <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" fill="currentColor"/>
                    </svg>
                </span>


                <div class="pressai-action-list-container">

                    <div class="absolute left-1/2 z-20 flex w-screen max-w-max -translate-x-1/2 ml-2">
                        <div class="w-screen max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                            <div class="px-4 pt-4">


                                <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 ai-button-item">

                                    <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-6 w-6 text-pressai-primary group-hover:text-pressai-primary" fill="currentColor" stroke-width="1.5">
                                            <path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/>
                                        </svg>
                                    </div>

                                    <div class="text-left">
                                        <a  data-value="command" class="font-semibold text-gray-900">
                                            Press AI Writer
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600">Generate content with your command</p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center bg-pressai-light text-black pl-8 py-3">
                                <span class="text-xs font-semibold">Please select some text to use the following options</span>
                            </div>

                            <div class="px-4 p-b">

                                <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 ai-button-item">

                                    <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6 text-pressai-primary group-hover:text-pressai-primary" fill="none" stroke-width="1.5" stroke="currentColor">
                                            <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" fill="currentColor" />
                                        </svg>
                                    </div>

                                    <div class="text-left">
                                        <a  data-value="outline" class="font-semibold text-gray-900">
                                            Outline
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600">Generate an outline from a title</p>
                                    </div>
                                </div>

                                <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 ai-button-item">

                                    <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="h-6 w-6 text-pressai-primary group-hover:text-pressai-primary" fill="none" stroke-width="1.5" stroke="currentColor">
                                             <path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z" fill="currentColor" />
                                        </svg>
                                    </div>

                                    <div class="text-left">
                                        <a  data-value="intro" class="font-semibold text-gray-900">
                                            Intro
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600">Generate an introduction from a title</p>
                                    </div>
                                </div>


                                <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 ai-button-item">

                                    <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6 text-pressai-primary group-hover:text-pressai-primary" fill="none" stroke-width="1.5" stroke="currentColor">
                                            <path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z" fill="currentColor"/>
                                        </svg>
                                    </div>

                                    <div class="text-left">
                                        <a  data-value="paragraph" class="font-semibold text-gray-900">
                                            Paragraph
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600">Generate a paragraph</p>
                                    </div>
                                </div>

                                <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 ai-button-item">

                                    <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6 text-pressai-primary group-hover:text-pressai-primary" fill="none" stroke-width="1.5" stroke="currentColor">
                                            <path d="M32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" fill="currentColor"/>
                                        </svg>
                                    </div>

                                    <div class="text-left">
                                        <a  data-value="conclusion" class="font-semibold text-gray-900">
                                            Conclusion
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600">Generate a conclusion paragraph</p>
                                    </div>
                                </div>

                                <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 ai-button-item">

                                    <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="h-6 w-6 text-pressai-primary group-hover:text-pressai-primary" fill="none" stroke-width="1.5" stroke="currentColor">
                                            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" fill="currentColor"/>
                                        </svg>
                                    </div>

                                    <div class="text-left">
                                        <a  data-value="paraphrase" class="font-semibold text-gray-900">
                                            Paraphrase
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600">Paraphrase a paragraph</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

            </div>
        </button>

	    <?php
    }



    /**
     * Notification popup template.
     *
     * @return void
     */
    public static function popup_template(): void {
        static $cache = null;

        if($cache === null) {
            $cache = true;
        } else {
            return;
        }

        ?>
        <div id="pressai_modal" class="fixed inset-0 z-50 flex items-center justify-center hidden p-4 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl w-96">
                <div class="flex items-center justify-between px-4 py-3 border-b bg-pressai-primary text-white border-gray-200">
                    <h5 class="modal-title text-lg font-semibold"></h5>
                    <button type="button" class="modal-close focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body p-4">

                </div>
                <div class="modal-footer flex justify-center px-4 py-3 border-t border-gray-200">
                    <button type="button" class="btn-close modal-close text-white bg-pressai-primary hover:bg-pressai-primary rounded px-4 py-2">Close</button>
                </div>
            </div>
        </div>

	    <?php
    }




}