const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { createElement, Fragment } = wp.element;
const { BlockControls } = wp.blockEditor;
const { ToolbarButton } = wp.components;

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

let $contextMenu;
const  createContextMenu = () => {
    $contextMenu = jQuery('<div>')
        .attr('id', 'pressai-context-menu')
        .addClass('absolute hidden z-10 bg-white border border-gray-300 rounded-md shadow-lg w-60');

    jQuery('body').append($contextMenu);

    const actions = [
        { name: 'Rewrite'},
        { name: 'Improve'},
        { name: 'Fix Grammar'},
        { name: 'Make Shorter'},
        { name: 'Make Longer'},
        {
            name: 'Translate',
            submenu: [
                { name: 'English'},
                { name: 'Japanese'},
                // Add more languages as needed
            ]
        },
        {
            name: 'Change Tone',
            submenu: [
                { name: 'Excited' },
                { name: 'Sad' },
                { name: 'Formal' },
                { name: 'Informal' },
                { name: 'Friendly' },
                { name: 'Angry' },
                { name: 'Optimistic' },
                { name: 'Pessimistic' },
                { name: 'Confident' },
                { name: 'Concerned' },
                { name: 'Neutral' },
                { name: 'Humorous' },
                { name: 'Serious' },
                { name: 'Professional' },
                { name: 'Casual' },
                { name: 'Sarcastic' },
                { name: 'Sympathetic' },
            ],
        },
    ];

    actions.forEach(action => {
        const $button = jQuery('<button>')
            .text(action.name)
            .addClass('block w-full text-left py-2 px-4 hover:bg-gray-100 cursor-pointer bg-transparent border-none outline-none font-semibold text-md leading-6')
            .click(() => {

                const additionalData = {
                    action: action.name,
                }
                contextMenuItemClickHandler(additionalData);

            });

        $contextMenu.append($button);

        if (action.submenu) {
            const $submenu = jQuery('<div>')
                .addClass('absolute hidden -mt-6 left-full bg-white border border-gray-300 rounded-md shadow-lg z-20 w-60');

            const $arrowIcon = jQuery('<span class="dashicons dashicons-arrow-right-alt2"></span>')
                .addClass('absolute right-0 mr-2 text-gray-500')
                .appendTo($button);


            action.submenu.forEach(subAction => {
                const $subButton = jQuery('<button>')
                    .text(subAction.name)
                    .addClass('block w-full hover:bg-gray-100 text-left  py-2 px-4 cursor-pointer bg-transparent border-none outline-none font-semibold text-md leading-6')
                    .click(() => {

                        const additionalData = {
                            action: action.name,
                            subAction: subAction.name,
                        }
                        contextMenuItemClickHandler(additionalData);

                    });

                $submenu.append($subButton);
            });

            $button.hover(
                function() {
                    $submenu.removeClass('hidden');
                },
                function() {
                    $submenu.addClass('hidden');
                }
            );

            $button.append($submenu);
        }
    });

}

createContextMenu();


const contextMenuItemClickHandler = (additionalData) => {
    // Get the selected text and range
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    $contextMenu.addClass('hidden');

    // If no text is selected, don't make the API call
    if (!selectedText) {
        return;
    }

    // Assuming that `callApi` is a function that returns a promise
    // that resolves with the content to replace the selected text
    const gutenberg = new PressAIGutenberg();
    gutenberg.callApi(selectedText, 'text_selected_menu', -1, additionalData)
        .then(content => {
            // Once we have the content, get the current block
            let block = wp.data.select('core/block-editor').getSelectedBlock();
            if (block) {
                // Create a new block with the corrected content
                let newBlock = wp.blocks.createBlock('core/paragraph', {content: content});

                let allBlocks = wp.data.select('core/block-editor').getBlocks();
                let blockIndex = allBlocks.findIndex(b => b.clientId === block.clientId);

                wp.data.dispatch('core/block-editor').insertBlocks(newBlock, blockIndex + 1, block.rootClientId);

                // Select the new block
                wp.data.dispatch('core/block-editor').selectBlock(newBlock.clientId);
            }
            // Clear selection
            selection.removeAllRanges();
        })
        .catch(err => {
            console.error('API call failed', err);
        });
};



// Add a method to show the context menu
const showContextMenu = (buttonElement) => {
    const rect = buttonElement.getBoundingClientRect();

    $contextMenu.css({
        top: rect.bottom + 'px',
        left: rect.left + 'px'
    });

    $contextMenu.removeClass('hidden');
};

// Add a method to hide the context menu
const hideContextMenu = () => {
    $contextMenu.addClass('hidden');
};

// Show context menu when clicked, and hide it when clicked again
const toggleContextMenu = (buttonElement) => {
    if ($contextMenu.hasClass('hidden')) {
        showContextMenu(buttonElement);
    } else {
        hideContextMenu();
    }
};

const addPressAIButton = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {
            attributes,
            setAttributes,
            isSelected,
            name
        } = props;

        if (name === 'pressai/command-input') {
            // If this is the 'pressai-command-input' block, don't modify it.
            return createElement(BlockEdit, props);
        }

        return createElement(
            Fragment,
            {},
            createElement(BlockEdit, props),
            isSelected && createElement(
                BlockControls,
                {},
                createElement(
                    ToolbarButton,
                    {
                        className: "press-ai-button",
                        label: "Press AI",
                        icon: svgIcon,
                        onClick: (event) => {
                            toggleContextMenu(event.currentTarget);
                            // Prevent the click event from propagating
                            event.stopPropagation();
                        }
                    }
                )
            )
        );
    };
}, 'addPressAIButton');

addFilter(
    'editor.BlockEdit',
    'press-ai/press-ai-button',
    addPressAIButton
);

// Hide context menu when user clicks elsewhere
document.addEventListener('click', (event) => {
    if (!jQuery(event.target).closest('#pressai-context-menu').length &&
        !jQuery(event.target).closest('.press-ai-button').length) {
        hideContextMenu();
    }
});