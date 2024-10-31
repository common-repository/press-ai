<?php

namespace PressAI\ChatBot;

use PressAI;

/**
 * Class ChatBot
 */
class ChatBot {
    function __construct() {
        add_action('wp_footer', array( $this, 'pressai_chatbot_popup' ));
        add_action('wp_enqueue_scripts', array( $this, 'pressai_chatbot_scripts' ));

    }

    // Enqueue chatbot script
    function pressai_chatbot_scripts(): void {
	    wp_enqueue_style(PressAI::PREFIX . 'chatbot_css', PRESSAI_URL . '/dist/css/pressai.min.css', null,PRESSAI_VERSION);
	    wp_enqueue_script(PressAI::PREFIX . 'react', PRESSAI_URL . '/dist/js/pressai.min.js', null, PRESSAI_VERSION, true);
	    wp_script_add_data(PressAI::PREFIX . 'react', 'type', 'module');
    }


    /**
     * Add chatbot popup to every page.
     *
     * @return void
     */
	public function pressai_chatbot_popup(): void {
		echo '<div id="' . esc_attr('pressai-chatbot-popup') . '"></div>';
	}

}
