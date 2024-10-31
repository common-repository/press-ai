<?php

namespace PressAI\Editor;

use PressAI;


/**
 * Class Classic
 */
class Classic {
    function __construct() {
        add_action('media_buttons', array($this, 'classic_editor'));
    }

    public function classic_editor(): void {
        wp_enqueue_script(PressAI::PREFIX . 'button', PRESSAI_URL . '/dist/js/classic.js', array('pressai_custom_css'), PRESSAI_VERSION, true);
        wp_enqueue_style(PressAI::PREFIX . 'bootstrap_css');

	    $filtering = Commons::filtering_editor_button_components();
	    echo wp_kses($filtering['button_html'], $filtering['allowed_tags']);
    }
}




