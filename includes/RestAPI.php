<?php

namespace PressAI\Includes;

use Exception;
use Orhanerday\OpenAi\OpenAi;
use PressAI;
use WP_REST_Request;
use WP_REST_Response;


class RestAPI {

	const ROUTE_NAMESPACE = 'pressai/v1';
	const HIDDEN_PROBLEMS = PressAI::PREFIX . 'hidden_problems';
	const SHOWN_PROBLEMS = PressAI::PREFIX . 'shown_problems';

	const HIDDEN_ITEMS = PressAI::PREFIX . 'hidden_';
	const SHOWN_ITEMS = PressAI::PREFIX . 'shown_';

	function __construct() {
		add_action('rest_api_init', array($this, 'register_routes'));
	}
	function register_routes(): void {
		register_rest_route( self::ROUTE_NAMESPACE, '/is_feature_available', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){

				$feature = $request->get_param( 'feature' );

				if ( $feature == 'chatbot' && Utils::isModuleEnabled('chat') ) {
					return array( 'status' => true );
				}
				return array( 'status' => false);
			},
			'permission_callback' => '__return_true',
		) );
		register_rest_route( self::ROUTE_NAMESPACE, '/save_api_key', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){
				$api_key = sanitize_text_field($request->get_param( 'api_key' ));
				if ( empty( $api_key ) ) {
					return array( 'status' => false, 'message' => 'API Key is required' );
				}
				try {
					$open_ai = new OpenAi($api_key);
					$response = json_decode($open_ai->listModels());
					if(isset($response->error)) {
						return array( 'status' => false, 'message' => $response->error->message );
					}

					update_option(PressAI::OPTION_API_KEY, $api_key );

					$hiddenItems = json_decode(get_option(self::HIDDEN_PROBLEMS, '[]'), true);
					$shownItems = json_decode(get_option(self::SHOWN_PROBLEMS, '[]'), true);

					// Array to be removed
					$arrayToRemove = [
						'id' => 1,
						'content' => 'You need to set your <a class="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank"> OpenAI API key </a> first, you can do that in the Open AI API Configuration tab.',
					];

					// Find and remove the array from $hiddenItems if it exists
					foreach ($hiddenItems as $key => $item) {
						if ($item == $arrayToRemove) {
							unset($hiddenItems[$key]);
							$hiddenItems = array_values($hiddenItems); // Reindex the array
							break;
						}
					}

					// Find and remove the array from $shownItems if it exists
					foreach ($shownItems as $key => $item) {
						if ($item == $arrayToRemove) {
							unset($shownItems[$key]);
							$shownItems = array_values($shownItems); // Reindex the array
							break;
						}
					}

					// Update the WordPress options
					update_option(self::HIDDEN_PROBLEMS, json_encode($hiddenItems));
					update_option(self::SHOWN_PROBLEMS, json_encode($shownItems));

					return array( 'status' => true, 'message' => 'API Key saved successfully');

				} catch (Exception $e) {
					return array( 'status' => false, 'message' => $e->getMessage() );
				}
			},
			'permission_callback' => '__return_true',
		) );
		// Create an API endpoint to retrieve the value of the 'my_option' option
		register_rest_route( self::ROUTE_NAMESPACE, '/get_option', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){
				$option_name = sanitize_key($request->get_param( 'name' ));

				// if $option_name doesn't have string PressAI::PREFIX, the concat it
				if ( ! str_contains( $option_name, PressAI::PREFIX ) ) {
					$option_name = PressAI::PREFIX . $option_name;
				}

				$option_value = get_option( $option_name);
				if (!empty( $option_value ) && $option_name == PressAI::OPTION_API_KEY) {
					// Get the position of the first "-"
					$pos = strpos($option_value, '-');
					// Get the string till first "-"
					$prefix = substr($option_value, 0, $pos+1);
					// Get the last 4 characters of the string
					$last_four = substr($option_value, -4);
					// Prepare the new string
					$option_value = $prefix."...".$last_four;
				}
				if ( empty( $option_value ) ) {
					return array( 'status' => false, 'message' => 'Option value is empty' );
				}else{
					return array( 'status' => true, 'message' => 'Option value retrieved successfully', 'data' => $option_value );
				}
			},
			'permission_callback' => '__return_true',
		));
		register_rest_route( self::ROUTE_NAMESPACE, '/set_option', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){
				$option_name = sanitize_key($request->get_param( 'name' ));
				$option_value = $request->get_param( 'value' );

//				if $option_name doesn't have string PressAI::PREFIX, the concat it
				if ( ! str_contains( $option_name, PressAI::PREFIX ) ) {
					$option_name = PressAI::PREFIX . $option_name;
				}

				update_option( $option_name, $option_value);
				return array( 'status' => true);
			},
			'permission_callback' => '__return_true',
		));
		register_rest_route( self::ROUTE_NAMESPACE, '/generate_content', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){
				$type = sanitize_text_field($request->get_param('type'));
				$text = sanitize_textarea_field($request->get_param('text'));
				$additionalDataRaw = $request->get_param('additionalData');

				// Initialize sanitized additionalData
				$additionalData = array();

				// Sanitize each element in additionalData
				if (is_array($additionalDataRaw)) {
					foreach ($additionalDataRaw as $key => $value) {
						$additionalData[$key] = sanitize_text_field($value);
					}
				}

				if (empty($type) || empty($text)) {
					return array( 'success' => false, 'message' => 'Missing option or text in not selected' );
				}

				try {
					return Utils::contentGenerationRequestBuilder($type, $text, $additionalData);
				} catch (Exception $e) {
					return array( 'status' => false, 'message' => $e->getMessage() );
				}
			},
			'permission_callback' => '__return_true',
		) );
		register_rest_route(self::ROUTE_NAMESPACE, '/dashboard_items/', array(
			'methods' => 'GET',
			'callback' => function(WP_REST_Request $request){
				$item_name = sanitize_text_field($request->get_param('item_name'));

				$hiddenItems = json_decode(get_option(self::HIDDEN_ITEMS . $item_name, '[]'), true);
				$shownItems = json_decode(get_option(self::SHOWN_ITEMS . $item_name, '[]'), true);

				$openAiApiKey = get_option(PressAI::OPTION_API_KEY);


				if ($item_name == 'problems' && empty($hiddenItems)  && empty($openAiApiKey) && empty($shownItems)) {
					$hiddenItems = [
						[
							'id' => 1,
							'content' => 'You need to set your <a class="text-blue-500" href="https://platform.openai.com/account/api-keys" target="_blank"> OpenAI API key </a> first, you can do that in the Open AI API Configuration tab.',
						]

					];

					update_option(self::HIDDEN_PROBLEMS, json_encode($hiddenItems));
				}

				return new WP_REST_Response([
					'hidden_items' => $hiddenItems,
					'shown_items' => $shownItems,
				]);
			},
			'permission_callback' => '__return_true',
		));
		register_rest_route(self::ROUTE_NAMESPACE, '/dashboard_items/', array(
			'methods' => 'POST',
			'callback' => function(WP_REST_Request $request){


				$itemName = sanitize_text_field($request->get_param('item_name'));
				$hiddenItemsRaw = $request->get_param('hidden_items');
				$shownItemsRaw = $request->get_param('shown_items');

				// Function to sanitize each item
				$sanitize_item = function($item) {

					return [
						'id' => isset($item['id']) ? intval($item['id']) : 0,
						'content' => isset($item['content']) ? wp_kses_post($item['content']) : ''
					];
				};

				// Apply sanitization to each item in the arrays
				$hiddenItems = json_encode(array_map($sanitize_item, $hiddenItemsRaw));
				$shownItems = json_encode(array_map($sanitize_item, $shownItemsRaw));


				update_option(self::HIDDEN_ITEMS . $itemName, $hiddenItems);
				update_option(self::SHOWN_ITEMS . $itemName, $shownItems);

				return new WP_REST_Response([
					'status' => true,
				]);
			},
			'permission_callback' => '__return_true',
		));

	}
}

