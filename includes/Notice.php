<?php

namespace PressAI\Includes;

use PressAI;

class Notice {
    function __construct() {
        add_action( 'admin_notices', array($this, 'setup_api_key_admin_notice') );
	    add_action('admin_enqueue_scripts', array($this, 'pressai_enqueue_scripts'));

	    add_filter( 'safe_style_css', array($this, 'allow_svg_style_attributes') );
    }

	function pressai_enqueue_scripts(): void {
		wp_enqueue_script('pressai-admin', PRESSAI_URL . '/dist/js/pressai-admin.js', array('jquery'), '1.0', true);
		wp_localize_script('pressai-admin', 'pressai_ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
	}

	public function allow_svg_style_attributes( $allowed_attr ) {
		return array_merge( $allowed_attr, array( 'fill' ) );
	}

	public function setup_api_key_admin_notice(): void {
        $openai_api_key = get_option(PressAI::OPTION_API_KEY);
        if (empty( $openai_api_key ) ) {
            ?>
            <div class="notice pressai-notice is-dismissible py-3">
                <div class="flex items-center">

                    <div class="flex-none px-5">
				        <?php
				        $svgContent = '<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" id="b" viewBox="0 0 1009 1005"><path d="m721.52,109.92h-419.99c-140.32,0-254.48,114.15-254.48,254.48v540.53l226.94-169.62c7.95-5.94,17.61-9.15,27.53-9.15h419.99c140.32,0,254.48-114.16,254.48-254.48v-107.27c0-140.32-114.16-254.48-254.48-254.48Zm85.85,361.75c0,47.34-38.51,85.85-85.85,85.85h-419.99c-47.34,0-85.85-38.51-85.85-85.85v-107.27c0-47.34,38.51-85.85,85.85-85.85h419.99c47.34,0,85.85,38.51,85.85,85.85v107.27Z" style="fill:#7031f5;"></path><path d="m721.52,186.57h-419.99c-98.06,0-177.83,79.77-177.83,177.83v107.27c0,98.06,79.77,177.83,177.83,177.83h419.99c98.06,0,177.83-79.77,177.83-177.83v-107.27c0-98.06-79.77-177.83-177.83-177.83Zm85.85,285.1c0,47.34-38.51,85.85-85.85,85.85h-419.99c-47.34,0-85.85-38.51-85.85-85.85v-107.27c0-47.34,38.51-85.85,85.85-85.85h419.99c47.34,0,85.85,38.51,85.85,85.85v107.27Z" style="fill:#7031f5;"></path><circle cx="354.89" cy="418.04" r="56.72" style="fill:#7031f5;"></circle><circle cx="668.16" cy="418.04" r="56.72" style="fill:#7031f5;"></circle></svg>';

				        $allowed_svg_tags = [
					        'svg' => [
						        'xmlns' => [],
						        'id' => [],
						        'viewbox' => [],
						        'class' => []
					        ],
					        'path' => [
						        'd' => [],
						        'style' => [],
					        ],
					        'circle' => [
						        'cx' => [],
						        'cy' => [],
						        'r' => [],
						        'style' => [],
					        ],
				        ];


				        $svg_with_classes = str_replace('<svg', '<svg class="w-10 h-10 inline-block mr-1"', $svgContent);
				        echo wp_kses($svg_with_classes, $allowed_svg_tags);

				        ?>
                    </div>

                    <div class="flex-1">
                        <p class="font-bold">Press AI - Making it Easy to Integrate AI Tools and Solutions For WordPress</p>
                        <p>Please configure the Press AI plugin by entering <a class="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank"> OpenAI API</a> on your <span class="font-semibold">dashboard configuration settings</span>. See complete instructions to sign up and get a free API key from the Open AI Website.</p>
                    </div>

                    <div class="flex-none">
                        <a id="configure-pressai-settings" href="<?php echo esc_url( admin_url( 'admin.php?page=pressai' ) ); ?>" class="px-4 py-2 text-white bg-pressai-primary rounded">Configure  Press AI Settings</a>
                    </div>
                </div>
            </div>
            <?php
        }
    }
}

