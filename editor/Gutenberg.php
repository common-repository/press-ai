<?php

namespace PressAI\Editor;

use PressAI;


/**
 * Class Gutenberg
 */
class Gutenberg {
    function __construct() {
        add_action( 'enqueue_block_editor_assets', array( $this, 'gutenberg_assets' ) );
        add_action( 'admin_footer', array( $this, 'editor_components' ) );
    }

    /**
     * Include scripts and styles.
     *
     * @return void
     */
	public function gutenberg_assets(): void {
		wp_enqueue_script(PressAI::PREFIX . 'gutenberg_js', PRESSAI_URL . '/dist/js/gutenberg.js', array(
			'wp-plugins',
			'wp-edit-post',
			'jquery',
		), PRESSAI_VERSION, true);

		wp_enqueue_script( PressAI::PREFIX . 'gutenberg_toolbar_js', PRESSAI_URL . '/dist/js/gutenberg-toolbar.js', array(
			'wp-blocks',
			'wp-dom',
			PressAI::PREFIX . 'gutenberg_js',
			'jquery',
		), PRESSAI_VERSION, true );
	}


	/**
     * Print the frontend components in editor.
     *
     * @return void
     */
	public function editor_components(): void {
        if ( !class_exists('\\PressAI\\Editor\\Commons') ) {
            include_once PRESSAI_DIR . 'editor/Commons.php';
        }
		if (method_exists('\\PressAI\\Editor\\Commons', 'filtering_editor_button_components') ) {
			$filtering = Commons::filtering_editor_button_components();
            echo wp_kses($filtering['popup_html'], $filtering['allowed_tags']);
			?>
            <script id="gutenberg-pressai-button" type="text/html">
				<?php
                echo wp_kses($filtering['button_html'], $filtering['allowed_tags']);
				?>
            </script>
			<?php
		}
	}

}
