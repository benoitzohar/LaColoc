<?php

class UI {

	
	//Template
	public $tpl;
	
	
	//Javascript files
	public static $js_files = array(
		// libs
		'libs/jquery-1.7.2.min',
		'libs/bootstrap.min',
		'libs/bootstrap-datepicker',
		'libs/jquery.base64.min',
		'libs/jquery.ui.widget',
		'libs/jquery.iframe-transport',
		'libs/jquery.fileupload',
		
		
		// Core
		'core/lc',
		'core/com',
		'core/fn',
		'core/ui',
		'core/lc.profile',
	);
		
	// CSS files
	public static $css_files = array(
		'bootstrap.min',
		'datepicker',
		'tipTip',
		'lacoloc',
	);
	
	//Errors
	public $errors = array();
	
	public $initial_data = array();
	
	
	public function __construct($options = array()) {
				
	}
	
	public function __destruct() {
		if (count($this->errors)>0) {
			LC::M()->throwError();
		}
	}
	
	public function init_template() {
		
		//check current app
		$current_app_name = false;
		if (LC::M()->app && LC::M()->app->getName()) {
			$current_app_name = LC::M()->app->getName();
		}
		
		$tpl = LC::M()->tpl;
		
		$tpl->template_dir 	= LC::$path.'templates';
		
		$tpl->compile_dir 	= LC::$path.'smarty/templates_c';
		$tpl->cache_dir 	= LC::$path.'smarty/cache';
		$tpl->config_dir 	= LC::$path.'smarty/configs';
		
		$tpl->caching = 0;
		
		$tpl->assign('LC_TPL',	LC::$url.'templates/');
		$tpl->assign('LC_IMG',	LC::$url.'img/');
		$tpl->assign('LC_JS',	LC::$url.'js/');
		$tpl->assign('LC_CSS',	LC::$url.'css/');

		// Javascripts
		$js_include = '';
		foreach(LC::$js_files as $k => $js_file) {
			$js_files[$k] = LC::$url.'js/'.$js_file.'.js';
		}
		//include app specific JS (all files in the folder)
		if ($current_app_name) {
			$current_app_js_folder = 'modules/'.$current_app_name.'/js/';				
			$current_js_files = get_dir_content(LC::$path.$current_app_js_folder);
			foreach($current_js_files as $current_js_file) {
				$js_files[] = LC::$url.$current_app_js_folder.$current_js_file;
			}
		}
		foreach($js_files as $js_file) {
			$js_include .= '<script type="text/javascript" src="'.$js_file.'"></script>'."\n";	
		}
		$tpl->assign('JS_FILES',$js_include);
		
		// Css
		$css_include = '';
		foreach(LC::$css_files as $k => $css_file) {
			$css_files[$k] = LC::$url.'css/'.$css_file;
		}
		//include app specific CSS
		if ($current_app_name) {
			$current_app_css_folder = 'modules/'.$current_app_name.'/css/';
			if (is_file(LC::$path.$current_app_css_folder.$current_app_name.'.css')) 
				$css_files[] = LC::$url.$current_app_css_folder.$current_app_name;
		}
		foreach($css_files as $css_file) {
			$css_include .= '<link rel="stylesheet" href="'.$css_file.'.css" />'."\n";
		}
		
		$tpl->assign('CSS_FILES',$css_include);
		
		$tpl->assign('LC_ADMIN_TPL',LC::$url.'templates/admin/');
		$tpl->assign('LC_ADMIN_IMG',LC::$url.'templates/admin/images/');
		
		$extra_templates = array(
			'HEADER_TPL' 	=> 'header.tpl',
			'FOOTER_TPL' 	=> 'footer.tpl',
			'MENU_TPL' 		=> 'menu.tpl',
			'FEEDBACK_TPL' 	=> 'feedback.tpl'
		);
		
		foreach($extra_templates as $varname => $filename) {
			$cur_tpl_path = LC::$path.'templates/'.$filename;
			if (is_file($cur_tpl_path)) {
				$tpl->assign($varname,$cur_tpl_path);
			}
		}
						
		LC::M()->tpl = $tpl;

	}
	
	public function display($app,$template,$vars = false) {
	
		$this->init_template();
		
		// Set some vars
		$this->tadd('title',LC::$title);
		$this->tadd('LC_URL',LC::$url);
		$this->tadd('LC_CURRENT_APP',(!empty(LC::M()->app)? LC::M()->app->getName() : 'main'));
		$this->tadd('LC_INITIAL_DATA',LC::M()->getInitialData());
		$this->tadd('LC_LANG',LC::getLang(true));
		$this->tadd('LC_LANG_LONG',LC::getLang());
		$this->tadd('LC_SITE_DESCRIPTION',lang('site_description_content'));
		
		$this->tadd('isProd',LC::isProd());
		$this->tadd('isBeta',LC::isBeta());
		$this->tadd('isAlpha',LC::isAlpha());
		
		// Langs
		$this->tadd('lang',LC::M()->lang);
		
		if ($vars) $this->tadd($vars);

		// choose the template to show
		if ($app == 'main') {
			LC::M()->tpl->template_dir = LC::$path.'templates';
		}
		else if (is_dir(LC::$path.'modules/'.$app.'/templates')) {
			LC::M()->tpl->template_dir = LC::$path.'modules/'.$app.'/templates';
		}
		
		// if template exists : show it
		if (is_file(LC::M()->tpl->template_dir.'/'.$template)) {
			LC::M()->tpl->display($template);
		}
		// Fallback if template doesn't exist
		else {
			LC::M()->tpl->template_dir = LC::$path.'templates';
			LC::M()->tpl->display('oops.tpl');
		}
		
	}
	
	public function tadd($name,$value = '') {
		if (is_array($name)) 	LC::M()->tpl->assign($name);
		else 					LC::M()->tpl->assign($name,$value);
		
	}
		
	public function showEditUserPage() {
		if (!LC::M()->user) return false;
		
		$vars = array(
			'firstname' => LC::M()->user->get_var('firstname'),
			'lastname' => LC::M()->user->get_var('lastname'),
			'email' => LC::M()->user->get_var('email'),
			'is_local_user' => (LC::M()->auth->get_var('strategy') == 'lc')
		);
		
		if (LC::M()->user->get_var('email') == '') {
			$vars['standalone'] = true;
			$vars['no_footer'] = true;
			$vars['message'] = lang("Thank_you_for_filling_informations_about_you");
			$vars['has_img'] = (LC::M()->user->get_var('picture') != '');
		}
		
		$this->tadd($vars);
		$this->display(false,'edit_user.tpl',$vars);
		exit();
	}
	
	public function showEditGroupPage() {
	
		$v = array(
		
		);
		
		if (!LC::M()->group) {
			$v['standalone'] = true;
			$v['no_footer'] = true;
		}
	
		$this->display(false,'edit_group.tpl',$v);
		exit();
	}
	
	public function showNoBetaRightsPage() {
		
		$message = 'Vous ne pouvez pas accéder à la version '.(LC::isAlpha()?'Alpha':(LC::isBeta()?'Beta':'')).' de lacoloc.fr';
		
		if (LC::M()->user && $email = LC::M()->user->get_var('email')) {
			$message .= ' avec l\'adresse email : '.$email;
		}
		
		$v = array(
			'standalone' => true,
			'no_footer' => true,
			'message' => $message,
			'link' => LC::$url.'auth/logout',
			'link_text' => lang("Go_back_to_homepage")
		);
		
		$this->display(false,'error_page.tpl',$v);
		exit();
	}
}

?>