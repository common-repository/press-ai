<?php
if (!defined('ABSPATH')) {
	exit;
}

/**
 * @link              https://press.ai/wordpress/
 * @since             1.0.0
 * @package           pressai
 *
 * @wordpress-plugin
 * Plugin Name:       Press AI
 * Plugin URI:        https://press.ai/
 * Description:       Press AI makes it easy to integrate Generative AI tools and solutions into your website. Add content generator, AI writer, chatbots and other capabilities with our native WordPress integration.
 * Version:           1.0.0
 * Author:            Press AI
 * Author URI:        https://press.ai/wordpress/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       press-ai
 * Domain Path:       /languages
 */

if(!defined('PRESSAI_PLUGIN_FILE')) {
    define('PRESSAI_PLUGIN_FILE', __FILE__);
}

require_once 'vendor/autoload.php';
require_once 'config.php';
require_once 'includes/Utils.php';
require_once 'includes/Notice.php';
require_once 'includes/RestAPI.php';

use PressAI\ChatBot\ChatBot;
use PressAI\ChatBotAPI\ChatBotAPI;

use PressAI\Editor\Classic;
use PressAI\Editor\Gutenberg;
use PressAI\Includes\Notice;
use PressAI\Includes\RestAPI;
use PressAI\Includes\Utils;


class PressAI {

    const PREFIX = 'pressai_';
    const MENU_SLUG = 'pressai';

    const OPTION_API_KEY = self::PREFIX . 'openai_api_key';

    protected static ?PressAI $instance = null;
    private bool $gutenberg = true;
    private bool $classic = true;

    public function __construct() {

        add_action('admin_menu', array($this, 'add_menu_page'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));

		new RestAPI();
		new Notice();

        if (get_option(self::OPTION_API_KEY)) {
            // WP editor related
	        if (Utils::isModuleEnabled( 'writer' ) ) {
		        if ( $this->gutenberg) {
			        include_once('editor/Gutenberg.php');
			        new Gutenberg();
		        }
		        if ($this->classic) {
			        include_once('editor/Classic.php');
			        new Classic();
		        }
	        }

            // Chatbot related
	        if (Utils::isModuleEnabled('chat')) {
		        include_once('chatbot/ChatBot.php');
		        new ChatBot();
				require_once 'chatbot/ChatBotAPI.php';
				new ChatBotAPI();
	        }
        }
    }


    public function add_menu_page(): void {

	    $svg = file_get_contents( plugins_url( '/dist/images/pressai-icon.svg', __FILE__ ) ); // Get the contents of your SVG file
	    $icon_url = 'data:image/svg+xml;base64,' . base64_encode( $svg ); // Encode into base64


	    add_menu_page(
		    esc_html__('Press AI', 'pressai'),
		    esc_html__('Press AI', 'pressai'),
		    'manage_options',
		    self::MENU_SLUG,
		    array($this, 'pressai_render_app'),
		    $icon_url,
		    100
	    );
	    add_submenu_page(
		    self::MENU_SLUG,
		    esc_html__('Dashboard', 'pressai'),
		    esc_html__('Dashboard', 'pressai'),
		    'manage_options',
		    self::MENU_SLUG,
		    array($this, 'pressai_render_app')
	    );

	    add_submenu_page(
		    self::MENU_SLUG,
		    esc_html__('Settings', 'pressai'),
		    esc_html__('Settings', 'pressai'),
		    'manage_options',
		    self::MENU_SLUG . '#/settings/main-module',
		    array($this, 'pressai_render_app')
	    );

	    add_submenu_page(
		    self::MENU_SLUG,
		    esc_html__('Premium', 'pressai'),
		    esc_html__('Premium', 'pressai'),
		    'manage_options',
		    esc_url('https://press.ai/wordpress/')
	    );


    }

	public function pressai_render_app(): void {
		echo '<div class="full-body container-fluid py-5 bg-body-secondary"><div id="' . esc_attr('pressai-plugin-app') . '"></div></div>';
	}


	public function admin_enqueue_scripts(): void {

	    wp_enqueue_style(
		    self::PREFIX . 'open_sans',
		    esc_url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700,800&display=swap'),
		    array(),
		    null
	    );

	    wp_enqueue_style(
		    self::PREFIX . 'pressai_css',
		    esc_url(PRESSAI_URL . '/dist/css/pressai.min.css'),
		    array(self::PREFIX . 'open_sans'),
		    PRESSAI_VERSION
	    );

	    wp_enqueue_script(
		    self::PREFIX . 'react',
		    esc_url(PRESSAI_URL . '/dist/js/pressai.min.js'),
		    array('wp-element'),
		    PRESSAI_VERSION,
		    true
	    );

	    wp_script_add_data(self::PREFIX . 'react', 'type', 'module');
    }


    public static function get_instance(): ?PressAI {
        if(null == self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }


}

const WRITER_CONFIG = PressAI::PREFIX . 'writer_config';
const CHATBOT_CONFIG = PressAI::PREFIX . 'chatbot_config';
const MODULE_SETTING = PressAI::PREFIX . 'module_setting';

add_action("plugins_loaded", array('PressAI', 'get_instance'));

register_activation_hook(PRESSAI_PLUGIN_FILE, 'pressai_activation_redirect');

function pressai_activation_redirect(): void {
	set_transient('_pressai_activation_redirect', true, 30);
}

add_action('admin_init', 'pressai_do_activation_redirect');

function pressai_do_activation_redirect(): void {


	// save default settings for writer
	$writerSettings = get_option( WRITER_CONFIG);
	if ( ! $writerSettings ) {
		$defaultSettings = array(
			"aiModel"          => "gpt-3.5-turbo",
			"language"         => "English",
			"writingStyle"     => "Informative",
			"temperature"      => 1.0,
			"maxTokens"        => 2040,
			"topP"             => 1.0,
			"frequencyPenalty" => 0.0,
			"presencePenalty"  => 0.0,
			"stopSequence"     => null,
		);
		update_option(WRITER_CONFIG, $defaultSettings );
	}

	// save default settings for chatbot
	$chatbotSettings = get_option( CHATBOT_CONFIG );
	if ( ! $chatbotSettings ) {
		$defaultSettings = array(
			"description" => "",
			"color" => "#7031f5",
			"firstMessage" => "Hello! How can I help?",
			"buttonIcon" => "fa-solid fa-robot",
			"buttonText" => "",
			"showButtonText" => false,
			"buttonAlignment" => "right",
			"botAvatar" => "fa-solid fa-comment",
			"customSupportLink" => "",
			"language" => "English",
			"showBranding" => true,
		);
		update_option( CHATBOT_CONFIG, $defaultSettings );
	}

	// save default settings for module
	$moduleSettings = get_option(MODULE_SETTING );
	if ( ! $moduleSettings ) {
		update_option( MODULE_SETTING, array("writer" => true));
	}


	if (!get_transient('_pressai_activation_redirect')) {
		return;
	}

	delete_transient('_pressai_activation_redirect');
	exit(wp_redirect(admin_url('admin.php?page=pressai#/dashboard')));
}






