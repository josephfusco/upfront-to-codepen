<?php
/**
 * Plugin Name:    Upfront To CodePen
 * Plugin URI:     https://github.com/josephfusco/upfront-to-codepen/
 * Description:    Create a new pen containing a style guide for Upfront theme's colors & typography settings.
 * Version:        1.0
 * Author:         Joseph Fusco
 * Author URI:     https://josephfus.co/
 * License:        GPLv2 or later
 * License URI:    http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:    upfront-to-codepen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Upfront_To_CodePen {

	private $settings;

	function __construct() {
		$this->load_menu_page();
		$this->load_upfront_theme_settings();
		$this->load_settings_page_link();
		$this->load_styles_and_scripts();
	}

	function load_menu_page() {
		add_action( 'admin_menu', array( $this, 'register_menu_page' ), 900 );
	}

	function load_upfront_theme_settings() {
		$theme_settings = include get_stylesheet_directory() . '/settings.php';
		$this->settings = $this->strip_slashes( $theme_settings );
	}

	function load_settings_page_link() {
		add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'add_action_links' ) );
	}

	function load_styles_and_scripts() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles_and_scripts' ) );
	}

	function register_menu_page() {
		add_submenu_page(
			'upfront',
			'Upfront To CodePen',
			'Upfront To CodePen',
			'manage_options',
			'upfront_to_codepen',
			array( $this, 'submenu_page' )
		);
	}

	function submenu_page() {
		?>
		<div class="wrap card">
			<h1>Upfront To CodePen</h1>
			<form id="codepen_form" action="https://codepen.io/pen/define" method="POST" target="_blank">
				<p>Create a new pen containing a style guide of the theme colors &amp; typography settings. All Google font variants will be added within the <strong>"Stuff for &lt;head&gt;"</strong> section in the pen settings.</p>
				<!-- <p>
					<input type="checkbox" id="codepen_some_option" value="">
					<label for="codepen_some_option">Some Option</label>
				</p> -->
				<p class="submit">
					<input type="hidden" id="codepen_form_data" name="data" value="">
					<input type="submit" id="codepen_submit" class="button button-primary" value="Create New Pen">
				</p>
			</form>
		</div>
		<?php
	}

	function add_action_links( $links ) {
		$plugin_links = array(
			'<a href="' . admin_url( 'admin.php?page=upfront_to_codepen' ) . '">Settings</a>',
		);

		return array_merge( $links, $plugin_links );
	}

	function enqueue_styles_and_scripts() {
		$theme = wp_get_theme();

		wp_enqueue_script( 'uf2cp-script', plugins_url( '/js/main.js', __FILE__ ), array( 'jquery' ), '1.0', true );
		wp_localize_script( 'uf2cp-script', 'uf2cp_object',
			array(
				'theme_name'     => $theme->get( 'Name' ),
				'theme_version'  => $theme->get( 'Version' ),
				'theme_url'      => get_stylesheet_directory_uri(),
				'theme_settings' => $this->settings,
			)
		);
	}

	function strip_slashes( $input ) {
		if ( is_array( $input ) ) {
			$input = array_map( array( $this, 'strip_slashes' ), $input );
		} elseif ( is_object( $input ) ) {
			$vars = get_object_vars( $input );

			foreach ( $vars as $k => $v ) {
				$input->{$k} = $this->strip_slashes( $v );
			}
		} else {
			$input = stripslashes( $input );
		}

		return $input;
	}

}

$upfront_to_codepen = new Upfront_To_CodePen();
