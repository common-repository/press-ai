<?php

namespace PressAI\Editor;

class Commons {

	public static function filtering_editor_button_components(): array {
		// Define the custom list of allowed HTML tags and attributes
		$allowed_tags = wp_kses_allowed_html('post');
		$allowed_svg_tags = array(
			'svg' => array(
				'xmlns' => true,
				'viewbox' => true,
				'class' => true,
				'aria-hidden' => true,
				'fill' => true,
				'stroke-width' => true,
				'stroke' => true,
			),
			'path' => array(
				'd' => true,
				'fill' => true,
				'stroke-width' => true,
				'stroke' => true,
			),
		);

		// Merge the custom SVG tags with the default allowed tags
		$allowed_tags = array_merge($allowed_tags, $allowed_svg_tags);

		if ( !class_exists('\\PressAI\\Editor\\Components') ) {
			include_once PRESSAI_DIR . 'editor/Components.php';
		}

		ob_start();
		if ( method_exists('\\PressAI\\Editor\\Components', 'pressai_editor_button') ) {
			Components::pressai_editor_button();
		}
		$button_html = ob_get_clean();

		ob_start();
		if ( method_exists('\\PressAI\\Editor\\Components', 'popup_template') ) {
			Components::popup_template();
		}
		$popup_html = ob_get_clean();

		return ['button_html' => $button_html, 'popup_html' => $popup_html, 'allowed_tags' => $allowed_tags];

	}
}