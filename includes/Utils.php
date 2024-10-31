<?php

namespace PressAI\Includes;


use Exception;
use Orhanerday\OpenAi\OpenAi;
use PressAI;

class Utils {
	const WRITER_CONFIG = PressAI::PREFIX . 'writer_config';
	const MODULE_SETTING = PressAI::PREFIX . 'module_setting';

	public static function isModuleEnabled($module): bool {
		$module_settings = get_option(self::MODULE_SETTING);
		if (isset($module_settings[$module]) && $module_settings[$module]) {
			return true;
		}
		return false;
	}

	/**
	 * @throws Exception
	 */
	public static function contentGenerationRequestBuilder($type, $text, $additionalData = null): array {

		$commands = array(
			'outline' => 'Generate an outline based on this text',
			'intro' => 'Generate an introduction based on this text',
			'paragraph' => 'Generate a paragraph based on this text',
			'conclusion' => 'Generate a conclusion paragraph based on this text',
			'paraphrase' => 'Paraphrase this text',
			'command' => 'Generate content',
		);

		$open_ai = new OpenAi(get_option(PressAI::OPTION_API_KEY));
		$saved_config = get_option(self::WRITER_CONFIG);
		$model = $saved_config['aiModel'];
		$language = $saved_config['language'];
		$writingStyle = $saved_config['writingStyle'];
		$temperature = $saved_config['temperature'];
		$maxTokens = $saved_config['maxTokens'];
		$stopSequence = $saved_config['stopSequence'];
		$topP = $saved_config['topP'];
		$frequencyPenalty = $saved_config['frequencyPenalty'];
		$presencePenalty = $saved_config['presencePenalty'];

		$parameters = [
			'model' => $model,
			'temperature' => $temperature,
			'max_tokens' => $maxTokens,
			'frequency_penalty' => $frequencyPenalty,
			'presence_penalty' => $presencePenalty,
			'top_p' => $topP,
		];

		if($stopSequence != '') {
			$parameters['stop'] = $stopSequence;
		}

		if ($additionalData != null) {
			$query = $additionalData['action'] . " it " . (isset($additionalData['subAction']) ? "in " .  $additionalData['subAction'] : "") . " text:" . $text;
		} else {
			$query = $commands[$type] . " in " . $language . ". Writing Style: " . $writingStyle . ($type == "command" ? " command: " : " text: ") . $text;
		}


		// if model has 'text' in it, then we will need to add different parameters
		if (str_contains( $model, 'text' ) ) {
			$parameters['prompt'] = $query;
			$response = json_decode($open_ai->completion($parameters));
		} else {
			$parameters['messages'] = [
				[
					"role" => "system",
					"content" => "You are a Content Creator and you generate whatever you are ask to, don't write extra words."
				],
				[
					"role" => "user",
					"content" => $query
				],
			];

			$response = json_decode($open_ai->chat($parameters));
		}

		if(isset($response->error)) {
			return array( 'status' => false, 'message' => $response->error->message );
		}
		return array(
			'status' => true,
			'content' => $response->choices[0]->message->content ?? $response->choices[0]->text,
			'message' => 'Content generated successfully'
		);

	}
}
