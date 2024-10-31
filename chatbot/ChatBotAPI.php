<?php
namespace PressAI\ChatBotAPI;

use Exception;
use Orhanerday\OpenAi\OpenAi;
use PressAI;
use WP_REST_Request;

/**
* Class ChatBotAPI
*/
class ChatBotAPI {

	function __construct() {
		add_action('rest_api_init', array($this, 'register_routes'));
	}

	function register_routes(): void {
		register_rest_route( 'pressai/v1', '/send_message', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){
				$conversation = sanitize_text_field($request->get_param('conversation'));

				//return array('role' => 'assistant', 'content' => (array)$conversation);

				try {
					$open_ai = new OpenAi(get_option(PressAI::OPTION_API_KEY));

					$response = json_decode($open_ai->chat([
						'model' => 'gpt-3.5-turbo',
						'messages' => $conversation,
						'temperature' => 1.0,
						'max_tokens' => 1000,
						'frequency_penalty' => 0,
						'presence_penalty' => 0,
					]));



					if(isset($response->error)) {
						return array("role" => "assistant", "content" => esc_html($response->choices[0]->message));
					}

					return esc_html($response->choices[0]->message);

				} catch (Exception $e) {
					return array('role' => 'assistant', 'content' => esc_html($e->getMessage()));
				}
			},
			'permission_callback' => '__return_true',
		) );
	}

}