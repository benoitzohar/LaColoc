<?

class Module {

	private $error_msg = array();
	private $warning_msg = array();

	/**
	 *	File
	 **/
	 
	//private $name;
	private $has_module_structure;
	
	/**
	 *	Database
	 **/
	
	private $name;
	
	private $is_installed;
	private $properties = array();
	
	/**
	 *	Constructor
	 **/

	public function __construct($name){
		if (empty($name)) return false;
		
		$this->name = mysql_real_escape_string($name);
		$this->has_module_structure = $this->is_installed = false;
		
		if (!$this->has_module_structure()) {
			$this->error_msg[] = lang("module_%s_does_not_match_require_format",$name);
			return $this;
		}
		$this->import_module_configuration();
		$this->is_installed();
	}
	
	public function __destruct() {
		if (count($this->error_msg)>0) {
			debug($this->error_msg,__FILE__,__LINE__);
		}
	}
	
	/**
	 *		File Inclusion part
	 **/
	 
	public function has_module_structure() {
		if ($this->has_module_structure)
			return true;
    	$module_path = LC::$path.'modules/';
    	$dir_exists = is_dir($module_path.$this->name);
    	$conf_file_exists = is_file($module_path.$this->name.'/'.$this->name.'.php');
    	if ($dir_exists && $conf_file_exists) {
    		$this->has_module_structure = true;
    		return true;
    	}
		return false;
	}
	
	public function import_module_configuration() {
		$module_path = LC::$path.'modules/';
		if (!is_file($module_path.$this->name.'/'.$this->name.'.php')) {
			$this->error_msg[] = lang("could_not_include_file_%S",$module_path.$this->name.'/'.$this->name.'.php');
			return false;
		}
		require_once($module_path.$this->name.'/'.$this->name.'.php');
		if (!empty($lc_module[$this->name]) && is_array($lc_module[$this->name])) {
			$this->properties = $lc_module[$this->name];
		}
	}
	
	/**
	 *		Properties Testing part
	 **/	
	
	function get_property($property = false) {
		if (!$property) return false;
		if (!empty($this->properties[$property])) {
			return $this->properties[$property];
		}
		return false;
	}
	
	function get_version() {
		return $this->properties['version'];
	}
	
	function convert_last_edit() {
		$last_edit = $this->get_property('last_edit');
		if (is_int($last_edit)) return $last_edit;
		list($day,$month,$year) = explode('-',$last_edit);
		$res =  mktime(0,0,0,$month,$day,$year);
		return $res;
	}
	
	
	/**
	 *		Database part
	 **/
	
	public function is_installed() {
		if ($this->is_installed) return true;
		$app_installed  = new App($this->name);
		$app_installed_name = $app_installed->getName();
		$this->is_installed = !empty($app_installed_name);
		return $this->is_installed;
	}
	
	public function install($current_version = 1.0) {
		for($v = $current_version;$v<=$this->get_version();$v = $v+0.1) {
			$fic = LC::$path.'modules/'.$this->name.'/setup/tables-'.number_format($v,1).'.sql';

			if (is_file($fic)) {
				$sql_contents = file_get_contents($fic);
				if (!empty($sql_contents)) {
					$sql_contents = str_replace(array("\n","\r"),'',$sql_contents);
					$sql_contents = explode(';',$sql_contents);
					if (is_array($sql_contents)) {
						foreach($sql_contents as $sql_content) {
							if (!empty($sql_content) && !GDB::db()->Execute($sql_content)) {
								$this->error_msg[] = lang("sql_error: ").GDB::db()->ErrorMsg();
								return false;
							}
						}
					}
				}
			}
		}
		
		$new_app = new App(	$this->name,
									$this->get_property('title'),
									$this->get_property('version'),
									$this->convert_last_edit(),
									$this->get_property('logo'),
									$this->properties['pages']['setup'],
									$this->properties['pages']['admin'],
									$this->properties['pages']['main'],
									$this->properties['tables']);
									
		if (!$new_app->write()) {
			return false;
		}
		return $new_app;
	}
	
	public function update() {
		$app_to_update = new App($this->name);
		return $this->install($app_to_update->getVersion());
	}
	
	public function uninstall() {
		$app_to_uninstall = new App($this->name);
		return $app_to_uninstall->remove();
	}
	
	public function get_vars(){
		if (!$this->is_installed) {
			$this->error_msg[] = lang("could_not_get_vars");
			$this->error_msg[] = lang("module_is_not_installed");
			return false;
		}
		$res = array();
		foreach (self::$fields as $field){
			$res[$field] = $this->{$field};
		}
		return $res;
	}
	
	public function get_var($var){
	/*	if (!$this->is_installed) {
			$this->error_msg[] = lang("could_not_get_vars");
			$this->error_msg[] = lang("module_is_not_installed");
			return false;
		} */
		return $this->{$var};
	}
	
	public function set_var($var,$val){
		if (!$this->is_installed) {
			$this->error_msg[] = lang("could_not_set_vars");
			$this->error_msg[] = lang("module_is_not_installed");
			return false;
		}
		return $this->{$var} = $val;
	}
	
	public function to_array($keys = false){
		/*if (!$this->is_installed) {
			$this->error_msg[] = lang("could_not_get_vars");
			$this->error_msg[] = lang("module_is_not_installed");
			return false;
		}*/
		$res = array();
		if ($keys){
			return $this->get_vars();
		}
		else {
			foreach (self::$fields as $field){
				array_push($res,$this->{$field});
			}
			return $res;
		}
		return false;
	}
	
	/***
	 *		Static part
	 **/
	
    public static function get_installed_modules($user = false,$order = false,$only_names = false) {
    	return App::get_all($user,$order,$only_names);
    }
    
    public static function get_available_modules(){
    	$res = array();
    	$module_path = LC::$path.'modules/';
    	$dir_content = get_dir_content($module_path);
		foreach($dir_content as $fic){
			$dir = $module_path.$fic;
			if (is_dir($dir)){
				$module = new Module($fic);
				if ($module->has_module_structure() && !$module->is_installed())
					array_push($res, $module);
			}

		}
		return $res;
    }
        
    static public function get_fields(){
		return self::$fields;
	}
	
	static public function get_lang_fields(){
		$res = array();
		foreach (self::$fields as $field)
			array_push($res,lang($field));
		return $res;
	}

}

?>