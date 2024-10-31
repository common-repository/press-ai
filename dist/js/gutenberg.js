class PressAIGutenberg {
    constructor($) {
        this.$ = $;
        this.cache = {};
    }

    cacheElements() {
        this.cache.$gutenberg = this.$('#editor');
        this.cache.$$aiButtonContainer = this.$(jQuery('#gutenberg-pressai-button').html());
        this.cache.$aiButton = this.cache.$$aiButtonContainer.find('#pressai_main_button');
        this.cache.$actionButtons = this.cache.$$aiButtonContainer.find('.ai-button-item');
        this.cache.enabledButtons = false;
        this.bindEvents();


        wp.data.subscribe(() => {
            setTimeout(() => {
                this.buildPanel();
            }, 1);
        });

        // Subscribe to block editor's changes
        const { subscribe } = wp.data;
        subscribe(() => {
            // Get the selected block
            const selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
            // Check if there is a selected block
            if (selectedBlock) {
                const { clientId, attributes: { content } } = selectedBlock;
                // Check if the content is exactly two spaces
                if (content === '  ') {
                    // Dispatch the 'replaceBlocks' action to replace the current block with the custom block
                    wp.data.dispatch('core/block-editor').replaceBlocks(
                        clientId,
                        wp.blocks.createBlock('pressai/command-input')
                    );
                }
            }
        });
    }

    bindEvents() {
        jQuery('.modal-close').on('click', () => {
            jQuery('#pressai_modal').addClass('hidden');
        });

        this.cache.$actionButtons.on('click', (e) => {
            let data = this.getSelectionData();
            let type = jQuery(e.currentTarget).find('a').data("value");
            if (type === "command") {
                this.showCommandBlock(this.getBlockCount());
            } else if(data.selectionText) {
                this.callApi(data.selectionText, type, data.index);
            }
        });

        jQuery(document).on('mouseenter', '#pressai_main_button', () => {
            this.updateButtonState();
        });
    }

    updateButtonState() {
        this.cache.enabledButtons = !!this.getSelectionData();
        // disable AI action buttons if no text is selected
        this.cache.$actionButtons.each((_, element) => {
            let type = jQuery(element).find('a').data("value");
            let $svg = jQuery(element).find('svg');
            this.toggleButtonState(element, $svg, this.cache.enabledButtons || type === "command");
        });
    }

    toggleButtonState(button, svg, isActive) {
        let activeClasses = ["opacity-50", "cursor-not-allowed"];
        let svgClass = isActive ? 'text-pressai-primary group-hover:text-pressai-primary' : 'text-indigo-300';

        if (isActive) {
            button.classList.remove(...activeClasses);
            button.removeAttribute("disabled");
        } else {
            button.classList.add(...activeClasses);
            button.setAttribute("disabled", "");
        }

        svg.removeClass('text-pressai-primary group-hover:text-pressai-primary text-indigo-300');
        svg.addClass(svgClass);
    }

    buildPanel() {
        if (!jQuery("body").hasClass("elementor-editor-active") && !this.cache.$gutenberg.find('#pressai_menu_container').length) {
            this.cache.$gutenberg.find('.edit-post-header-toolbar').append(this.cache.$$aiButtonContainer);
        }
    }

    removeBlock(index) {
        let allBlocks = wp.data.select('core/block-editor').getBlocks();
        if (index < 0 || index >= allBlocks.length) {
            console.log("Index out of range");
            return;
        }

        let blockClientId = allBlocks[index].clientId;
        wp.data.dispatch('core/block-editor').removeBlock(blockClientId);
    }

    async callApi(text, type, index = 0, additionalData = {}) {
        let $pressAIModal = jQuery('#pressai_modal');
        if (type !== "command") {
            $pressAIModal.find('.modal-title').text('Loading...');
            $pressAIModal.find('.modal-body').html('<div class="flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" class="w-12 h-12 text-pressai-primary" style="animation: spin 2s linear infinite;"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg></div>');
            $pressAIModal.removeClass('hidden');
        }

        try {
            const response = await fetch('/wp-json/pressai/v1/generate_content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    type: type,
                    additionalData: additionalData
                }),
            });

            if (!response.ok) {
                throw new Error('There is something wrong with the connectivity');
            }

            const data = await response.json();

            if (data.status) {
                let output = data.content.trim();

                if (output.length === 0) {
                    // Update modal content
                    $pressAIModal.find('.modal-title').text('Ops!');
                    $pressAIModal.find('.modal-body').html('No content generated!.');
                    return;
                }

                $pressAIModal.addClass('hidden');

                if (type === "outline") {
                    this.addOutlineBlock(index, output);
                } else if (type === "text_selected_menu") {
                    return output;
                } else {
                    if (type === "command"){
                        this.removeBlock(index);
                    }
                    // Split the output by newline and filter out the empty strings
                    const outputArray = output.split('\n').filter(item => item.trim() !== '');

                    // Loop through each item and add a new block
                    for (let i = 0; i < outputArray.length; i++) {
                        await this.addParagraphBlock(index + i, outputArray[i].trim());
                    }
                }
            } else {
                // Update modal content
                if (type === "command"){
                    $pressAIModal.removeClass('hidden');
                }
                $pressAIModal.find('.modal-title').text('Ops!');
                $pressAIModal.find('.modal-body').html(data.message);
            }
        } catch(error) {
            // Update modal content
            if (type === "command"){
                $pressAIModal.removeClass('hidden');
            }
            $pressAIModal.find('.modal-title').text('Ops!');
            $pressAIModal.find('.modal-body').html(error.message);
        }
    }


    // Select the text of the given container.
    selectText(that) {
        var doc = document;
        var element = that[0];
        if (doc.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (document.getSelection) {
            var selection = document.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }


    // Get selected text data ( block_id, text, index of block).
    getSelectionData() {
        let selectionData = document.getSelection();
        let selectionText = jQuery.trim(selectionData.toString());
        let blockID;
        if ( selectionText !== "" ) {
            let parentElementId = jQuery(window.getSelection().focusNode).closest("[id^='block-']");

            if ( parentElementId.length > 0 ) {
                let selectionID = parentElementId.attr("id").split("block-")[1];
                blockID = selectionID;
                let allBlocks = wp.data.select('core/block-editor').getBlocks();
                let index = allBlocks.map(function (block) {
                    return block.clientId === selectionID;
                }).indexOf(true) + 1;

                if ( index === 0 ) {
                    allBlocks.forEach(function (blockType, key) {
                        let innerBlock = blockType.innerBlocks
                        innerBlock.forEach(function (innerBlockType) {
                            if (selectionID === innerBlockType.clientId) {
                                index = key + 1;
                                blockID = blockType.clientId;
                            }
                        });
                    });
                }
                return {
                    blockID: blockID,
                    selectionText: selectionText,
                    index: index
                };
            } else {
                return {
                    blockID: 0,
                    selectionText: selectionText,
                    index: 0
                };
            }
        }
        return "";
    }

    // Add new paragraph block in given position.
    addParagraphBlock(index, content) {
        return new Promise(resolve => {
            // Put the generated content in temp container to make insert it with flick.
            const newBlock = wp.blocks.createBlock("core/paragraph", {
                content: '',  // Initial content is an empty string
            });
            wp.data.dispatch("core/block-editor").insertBlocks(newBlock, index);
            jQuery("#block-" + newBlock.clientId).addClass("hidden");

            // Run the flick effect on the generated text, then resolve the promise
            this.wordFlick(content, index, "#block-" + newBlock.clientId, false, () => {
                // After the wordFlick has completed, update the block content using Gutenberg's dispatch
                wp.data.dispatch('core/block-editor').updateBlockAttributes(newBlock.clientId, { content: content });
                resolve();
            });
        });
    }


    // Add new outline in given position.
    async addOutlineBlock(index, content) {
        let contentArray = content.split('\n');
        for(let i = 0; i < contentArray.length; i++) {
            let item = contentArray[i];
            // Remove leading '•' or '-' from the item
            if (item.charAt(0) === '•' || item.charAt(0) === '-') {
                item = item.substring(1);
            }
            // Trim extra whitespaces
            item = item.trim();
            // Add heading block only if the item is not an empty string
            if (item !== "") {
                await this.addHeadingBlock(index + i, item);
            }
        }
    }


    addHeadingBlock(index, content) {
        return new Promise(resolve => {
            const headingBlock = wp.blocks.createBlock("core/heading", {
                level: 2,
                fontSize: 'large',
                content: '',  // Initial content is an empty string
            });

            wp.data.dispatch("core/block-editor").insertBlocks(headingBlock, index);
            jQuery("#block-" + headingBlock.clientId).addClass("hidden");

            // Run the flick effect on the generated text, then resolve the promise
            this.wordFlick(content, index, "#block-" + headingBlock.clientId, false, () => {
                // After the wordFlick has completed, update the block content using Gutenberg's dispatch
                wp.data.dispatch('core/block-editor').updateBlockAttributes(headingBlock.clientId, { content: content });
                resolve();
            });
        });
    }


    wordFlick(content, index, blockSelector, hidden, doneCallback) {
        // Add a delay to allow the element to be rendered
        setTimeout(() => {
            const blockElement = document.querySelector(blockSelector);
            // Check if blockElement exists
            if (!blockElement) {
                console.error('No element found with selector:', blockSelector);
                return;
            }
            let i = 0;
            let text = '';
            const intervalId = setInterval(() => {
                if (i < content.length) {
                    text += content.charAt(i);
                    blockElement.innerText = text;
                    i++;
                } else {
                    clearInterval(intervalId);
                    // If the block should be hidden after the text is typed
                    if (hidden) {
                        blockElement.style.visibility = 'hidden';
                    }
                    // Call the done callback
                    doneCallback();
                }
            }, 1);  // Adjust this value to change the typing speed
        }, 1);  // Adjust this delay as needed
    }

    getBlockCount() {
        let allBlocks = wp.data.select('core/block-editor').getBlocks();
        if (allBlocks.length === 0) { // No blocks exist
            return 0;
        }else{
            return allBlocks.length - 1;
        }
    }
    showCommandBlock(index) {
        const commandBlock = wp.blocks.createBlock("pressai/command-input", {});
        wp.data.dispatch("core/block-editor").insertBlocks(commandBlock, index);
    }

    registerCommandBlock() {
        const { registerBlockType } = wp.blocks;
        const { createElement } = wp.element;
        const { withSelect } = wp.data;

        const svgIcon = createElement('svg', {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 1009 1005"
            },
            createElement('path', {
                fill: "#7031f5",
                d: "m721.52,109.92h-419.99c-140.32,0-254.48,114.15-254.48,254.48v540.53l226.94-169.62c7.95-5.94,17.61-9.15,27.53-9.15h419.99c140.32,0,254.48-114.16,254.48-254.48v-107.27c0-140.32-114.16-254.48-254.48-254.48Zm85.85,361.75c0,47.34-38.51,85.85-85.85,85.85h-419.99c-47.34,0-85.85-38.51-85.85-85.85v-107.27c0-47.34,38.51-85.85,85.85-85.85h419.99c47.34,0,85.85,38.51,85.85,85.85v107.27Z"
            }),
            createElement('path', {
                fill: "#7031f5",
                d: "m721.52,186.57h-419.99c-98.06,0-177.83,79.77-177.83,177.83v107.27c0,98.06,79.77,177.83,177.83,177.83h419.99c98.06,0,177.83-79.77,177.83-177.83v-107.27c0-98.06-79.77-177.83-177.83-177.83Zm85.85,285.1c0,47.34-38.51,85.85-85.85,85.85h-419.99c-47.34,0-85.85-38.51-85.85-85.85v-107.27c0-47.34,38.51-85.85,85.85-85.85h419.99c47.34,0,85.85,38.51,85.85,85.85v107.27Z"
            }),
            createElement('circle', {
                fill: "#7031f5",
                cx: "354.89",
                cy: "418.04",
                r: "56.72"
            }),
            createElement('circle', {
                fill: "#7031f5",
                cx: "668.16",
                cy: "418.04",
                r: "56.72"
            })
        );

        registerBlockType('pressai/command-input', {
            title: 'Press AI Writer',
            icon: svgIcon,
            category: 'common',
            attributes: {
                content: {type: 'string', default: ''},
                isLoading: {type: 'boolean', default: false} // Added this line
            },
            edit: withSelect((select, ownProps) => ({
                blockIndex: select('core/block-editor').getBlockIndex(ownProps.clientId),
            }))((props) => {

                return createElement('div', {
                        id: 'pressai-command-input',
                        style: {
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            position: 'relative'
                        }
                    },
                    createElement('input', {
                        value: props.attributes.content,
                        onChange: (e) => props.setAttributes({content: e.target.value}),
                        onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                props.setAttributes({isLoading: true}); // Enable loading state
                                let content = props.attributes.content;
                                this.callApi(content, "command", props.blockIndex).then(() => {
                                    props.setAttributes({isLoading: false});
                                });
                            }
                        },
                        placeholder: 'What to you want to write about?',
                        style: {
                            width: '100%',
                            border: 'none',
                            fontSize: '16px',
                            lineHeight: '24px',
                            outline: 'none',
                            resize: 'none', /* Remove resizable feature */
                            padding: '16px', /* Add padding */
                            boxSizing: 'border-box', /* Include padding and border in element's total width and height */
                            verticalAlign: 'middle', /* Vertically center align */
                        },
                        disabled: props.attributes.isLoading, // Disable the input while loading
                    }),
                    props.attributes.isLoading && createElement('div', { // Container for loading animation
                        style: {
                            position: 'absolute',
                            top: '30%',
                            right: '16px',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '40px',
                        },
                    }, [
                        createElement('div', { // Dot 1
                            style: {
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#7031f5',
                                borderRadius: '50%',
                                animation: 'bounce 1s ease-in-out infinite',
                            },
                        }),
                        createElement('div', { // Dot 2
                            style: {
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#7031f5',
                                borderRadius: '50%',
                                animation: 'bounce 1s ease-in-out 0.33s infinite',
                            },
                        }),
                        createElement('div', { // Dot 3
                            style: {
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#7031f5',
                                borderRadius: '50%',
                                animation: 'bounce 1s ease-in-out 0.66s infinite',
                            },
                        }),
                    ]),
                    createElement('div', {
                        style: {
                            width: '100%',
                            color: '#bdbdbd',
                            fontSize: '14px',
                            backgroundColor: '#fafafa',
                            bottom: '8px',
                            left: '16px',
                            padding: '8px 16px',
                        }
                    }, 'Write your command and press "Enter" to generate content.')
                );
            }),
            save: (props) => {
                // This block is not meant to be saved, it will always be replaced with a paragraph block.
                return null;
            },
        });

    }


    init() {
        this.registerCommandBlock();
        this.cacheElements();
        // this.$(document).mouseup(this.highlightHandler.bind(this));
    }
}

const pressAIGutenberg = new PressAIGutenberg(jQuery);
pressAIGutenberg.init();
