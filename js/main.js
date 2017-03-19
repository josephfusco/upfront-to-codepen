(function($) {

	var settings         = uf2cp_object.theme_settings;
	var theme_colors_obj = JSON.parse(settings.theme_colors);
	var theme_colors     = theme_colors_obj.colors;
	var typography       = JSON.parse(settings.typography);

	// Check if non default fonts have been set
	if(settings.theme_fonts){
		var theme_fonts = JSON.parse(settings.theme_fonts);
	} else {
		var theme_fonts = '';
	}

	$('#codepen_submit').click(function(){

		var codepen_html = get_html();
		var codepen_scss = get_scss();
		var codepen_js   = '/* https://github.com/josephfusco/upfront-to-codepen */';
		var codepen_obj  = '';

		var codepen_head = get_google_fonts_used();
		var codepen_css  = get_theme_color_sass_variables();

		// Send data to codepen form
		codepen_obj = {
			"title": uf2cp_object.theme_name + ' v' + uf2cp_object.theme_version,
			"description": "",
			"head": codepen_head,
			"html": codepen_html,
			"css_starter": "normalize",
			"css_pre_processor": "scss",
			"css": codepen_scss,
			"js": codepen_js
		}
		$('#codepen_form_data').val(JSON.stringify(codepen_obj));

	});

	function get_google_fonts_used() {
		var google_fonts = '';

		// Get all fonts used in theme
		for(var i = 0; i < theme_fonts.length; i++) {
			var fontFamily  = theme_fonts[i].font.family;
			var fontVariant = theme_fonts[i].variant;

			// Prepare font family names with spaces for URL
			fontFamily = fontFamily.replace(' ', '+');

			// Create link elements for use in codepen head - easier to just make each variant separately since this isn't for production
			google_fonts += '<link href="https://fonts.googleapis.com/css?family='+fontFamily+':'+fontVariant+' rel="stylesheet">\n';
		}

		// Monospaced font for pen
		google_fonts += '<link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">\n';

		return google_fonts;
	}

	function get_element_style(el) {
		var scss = '';

		scss += el+' {\n';

		if(typography[el]["color"]){
			scss += '\tcolor: '+clean_ufc(typography[el]["color"])+';\n';
		}

		if(typography[el]["font_face"]){
			scss += '\tfont-family: "'+typography[el]["font_face"]+'", '+typography[el]["font_family"]+';\n';
		}

		if((typography[el]["line_height"] != false) && (typography[el]["line_height"])){
			scss += '\tline-height: '+typography[el]["line_height"]+'em;\n';
		}

		if((typography[el]["size"] != false) && (typography[el]["size"])) {
			scss += '\tfont-size: '+typography[el]["size"]+'px;\n';
		}

		if(typography[el]["style"]){
			scss += '\tfont-style: '+typography[el]["style"]+';\n';
		}

		if(typography[el]["weight"]){
			scss += '\tfont-weight: '+typography[el]["weight"]+';\n';
		}

		scss += '}\n\n';

		return scss;
	}

	function get_typography_styles() {
		var scss = '';

		scss += get_element_style('h1');
		scss += get_element_style('h2');
		scss += get_element_style('h3');
		scss += get_element_style('h4');
		scss += get_element_style('h5');
		scss += get_element_style('h6');
		scss += get_element_style('p');
		scss += get_element_style('a');
		scss += get_element_style('a:hover');
		scss += get_element_style('ul');
		scss += get_element_style('ol');
		scss += get_element_style('blockquote');
		scss += get_element_style('blockquote.upfront-quote-alternative');

		return scss;
	}

	function get_theme_color_sass_variables() {
		var scss = '';

		// Construct sass variables
		for(var i = 0; i < theme_colors.length; i++) {
			scss += '$ufc'+i+': '+theme_colors[i].color+';\n';
		}

		scss += '\n';

		return scss;
	}

	function get_scss() {
		var scss = '';

		scss += get_theme_color_sass_variables();
		scss += get_typography_styles();

		scss += '.container {\n';
		scss += '\tpadding: 15px;\n';
		scss += '}\n\n';

		scss += '.typography {\n';
		scss += '\tmax-width: 700px;\n';
		scss += '}\n\n';

		scss += '.theme-colors {\n';
		scss += '\tpadding: 0;\n';
		scss += '\tmargin: 0;\n';
		scss += '\tdisplay: flex;\n';
		scss += '\tlist-style-type: none;\n';
		scss += '\ttext-align: center;\n';
		scss += '}\n\n';

		scss += '.theme-colors li {\n';
		scss += '\tflex: 1;\n';
		scss += '\tborder: 1px solid #eee;\n';
		scss +=	'\tpadding: 0 0 15px;\n';
		scss += '\tborder-radius: 4px;\n';
		scss += '\toverflow: hidden;\n';
		scss += '}\n\n';

		scss += '.theme-colors li + li {\n';
		scss += '\tmargin-left: 15px;\n';
		scss += '}\n\n';

		for(var i = 0; i < theme_colors.length; i++) {
			scss += '.theme-colors li.ufc'+i+' span {\n';
			scss += '\tbackground-color: $ufc'+i+';\n';
			scss += '}\n\n';
		}

		scss += '.theme-colors p {\n';
		scss += '\tmargin: 0;\n';
		scss += '\tcolor: #777;\n';
		scss += '\tfont-family: Inconsolata, monospace;\n';
		scss += '}\n\n';

		scss += '.theme-colors span {\n';
		scss += '\tdisplay: block;\n';
		scss += '\twidth: 100%;\n';
		scss += '\theight: 60px;\n';
		scss += '\tmargin: 0 auto 15px;\n';
		scss += '}\n\n';

		return scss;
	}

	function get_html() {
		var html = '';

		// Open Container
		html += '<div class="container">\n';

		// Theme colors
		html += '\t<ul class="theme-colors">\n';
		for(var i = 0; i < theme_colors.length; i++) {
			html += '\t\t<li class="ufc'+i+'"><span></span><p>#ufc'+i+'</p><p>'+theme_colors[i].color+'</p></li>\n';
		}
		html += '\t</ul>\n';

		// Typography
		html += '\t<div class="typography">\n';

		html += '\t\t<h1>Heading 1 - Lorem ipsum dolor sit amet</h1>\n';
		html += '\t\t<h2>Heading 2 - Lorem ipsum dolor sit amet</h2>\n';
		html += '\t\t<h3>Heading 3 - Lorem ipsum dolor sit amet</h3>\n';
		html += '\t\t<h4>Heading 4 - Lorem ipsum dolor sit amet</h4>\n';
		html += '\t\t<h5>Heading 5 - Lorem ipsum dolor sit amet</h5>\n';
		html += '\t\t<h6>Heading 6 - Lorem ipsum dolor sit amet</h6>\n';

		html += '\t\t<a href="#">Link - Lorem ipsum dolor sit amet</a>\n';

		html += '\t\t<p>Paragraph - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n';

		html += '\t\t<ul>\n';
		html += '\t\t\t<li>List Item</li>\n';
		html += '\t\t\t<li>List Item</li>\n';
		html += '\t\t\t<li>List Item</li>\n';
		html += '\t\t</ul>\n';

		html += '\t\t<ol>\n';
		html += '\t\t\t<li>List Item</li>\n';
		html += '\t\t\t<li>List Item</li>\n';
		html += '\t\t\t<li>List Item</li>\n';
		html += '\t\t</ol>\n';

		html += '\t\t<blockquote>Blockquote - Lorem ipsum dolor sit amet, but legends are forever.</blockquote>\n';
		html += '\t\t<blockquote class="upfront-quote-alternative">Blockquote Alternative - Lorem ipsum dolor sit amet.</blockquote>\n';

		// Close typography
		html += '\t</div>\n';

		// Close container
		html += '</div>\n';

		return html;
	}

	function clean_ufc(val) {
		var before = '';

		// Check if ufc color was set - if not, use the default Upfront value (#000000)
		if (val.substring(0, 4) == "#ufc") {
			if (val.charAt(0) === '#') {
				before = '$';
			}

			while(val.charAt(0) === '#'){
				val = val.substr(1);
			}
		}

		return before + val;
	}

})(jQuery);
