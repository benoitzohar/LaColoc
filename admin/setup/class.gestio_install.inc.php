<?php

class Gestio_install {

	
	function Gestio_install($data) {
		
		if (empty($data) || !is_array($data)) return false;
		
		foreach($data as $data_key => $data_value) {
			$this->{$data_key} = $data_value;
		}

	}
	
	public function launchInstall() {
		
		// Connect to DB
		$connect_db = $this->connectDB();
		if ($connect_db !== true) return $connect_db;
		
		//Checking if Smarty templates are writeable
		$smarty = $this->checkSmartyConfig();
		if  ($smarty !== true) return $smarty;
		
		//Save Config Files
		$config_files = $this->generateConfigFiles();
		if ($config_files !== true) return $config_files;

		// get SQL query
		$get_sql = $this->getSql();
		if ($get_sql  !== true) return $get_sql;
		
		// execute SQL
		$execute_sql = $this->executeSql();
		if ($execute_sql !== true) return $execute_sql;
		
		return true;
	}
	
	public function connectDB() {
		
		if (empty($this->gestio_db_host) || !isset($this->gestio_db_user) || !isset($this->gestio_db_pass)) 
			return 'Gestio cannot connect to the database please check the host, user and password.';
		
		try {
			$co = mysql_connect($this->gestio_db_host,$this->gestio_db_user,$this->gestio_db_pass);
		} catch(Exception $e) {
			return $e->getMessage();
		}
		
		return true;
	}
	
	public function generateConfigFiles() {
	
		$config_folder = $this->gestio_path."config/";
		if (!is_dir($config_folder))
			return 'Config directory "'.$config_folder.'" does not exist !';
		if (!is_writable($config_folder))
			return 'Config directory "'.$config_folder.'" is not writable !';
	
		// Config
		$config_tpl = $config_folder."config.inc.php.template";
		if (!is_file($config_tpl))
			return 'Config template : '.$config_tpl.' is missing !';
			
		//DB
		$db_tpl = $config_folder."db.inc.php.template";
		if (!is_file($db_tpl))
			return 'DB Config template : '.$db_tpl.' is missing !';
			
		//Config write	
		$unique_key = $this->uniqueKeyGenerator();
			
		$config_content = file_get_contents($config_tpl);
		$config_content = str_replace('{server_title}',$this->gestio_title,$config_content);
		$config_content = str_replace('{server_unique_key}',$unique_key,$config_content);
		$config_content = str_replace('{server_url}',$this->gestio_url,$config_content);
		$config_content = str_replace('{server_path}',$this->gestio_path,$config_content);
		$config_content = str_replace('{server_lang}',$this->gestio_default_lang,$config_content);
		$config_content = str_replace('{admin_password}',Gestio::encodePassword($this->gestio_admin_password,$unique_key),$config_content);

		$config_dest = $config_folder."config.inc.php";
		if (is_file($config_dest)) {
			rename($config_dest,$config_dest.'.bak');
		}
		
		if (!file_put_contents($config_dest,$config_content))
			return 'Unable to write the config file : '.$config_dest;
		
		
		// DB config write
		$db_content = file_get_contents($db_tpl);
		$db_content = str_replace('{gestio_db_type}',$this->gestio_db_type,$db_content);
		$db_content = str_replace('{gestio_db_host}',$this->gestio_db_host,$db_content);
		$db_content = str_replace('{gestio_db_user}',$this->gestio_db_user,$db_content);
		$db_content = str_replace('{gestio_db_pass}',$this->gestio_db_pass,$db_content);
		$db_content = str_replace('{gestio_db_name}',$this->gestio_db_dbname,$db_content);

		$db_dest = $config_folder."db.inc.php";
		if (is_file($db_dest)) {
			rename($db_dest,$db_dest.'.bak');
		}
		
		if (!file_put_contents($db_dest,$db_content))
			return 'Unable to write db config file : '.$db_dest;
			
		return true;
	}
	
	public function checkSmartyConfig() {
		
		$smarty_path = $this->gestio_path."smarty/";
		$smarty_path_cache = $this->gestio_path."smarty/cache/";
		$smarty_path_template = $this->gestio_path."smarty/templates_c/";
		
		if (is_dir($smarty_path_cache) && is_dir($smarty_path_template)) {
			if (!is_writable($smarty_path_cache))
				return 'The cache directory is not writable. Please change permissions of '.$smarty_path_cache;
				
			if (!is_writable($smarty_path_template))
				return 'The template directory is not writable. Please change permissions of '.$smarty_path_template;
		} else {
			if (!is_writable($smarty_path))
				return 'The Smarty directory is not writable. Please change permissions of '.$smarty_path;		
		}
		
		return true;
	}
	
	public function getSql() {
		if  (empty($this->current_version)) return "Current version not specified";
		
		$sql = '';
		
		if (!empty($this->installed_version)) {
			//@TODO moulinette des sql de version
				
		} else {
			try {
				$sql_array = $this->getSqlForVersion($this->current_version);
			} catch(Exception $e) {
				return $e->getMessage();
			}
		}
		
		if (!empty($sql_array)) $this->sql_queries = $sql_array;
		
		return true;
	}
	
	public function getSqlForVersion($version = false) {
		if  (!$version) return false;
		
		$filename = $this->gestio_path."admin/setup/sql/tables-".$version.".sql";
		
		if (!is_file($filename)) 
			throw new Exception('File '.$filename.' is missing !');
		
		$file_content = file_get_contents($filename);
		
		$file_content = str_replace('{gestio_prefix}','gestio_',$file_content);
		$file_content = str_replace('{gestio_db}',$this->gestio_db_dbname,$file_content);
		
		//remove line endings
		$file_content = str_replace("\n",'',$file_content);
		
		//separate each query
		$sql_array = explode(';',$file_content);

		return $sql_array;
	}
	
	public function executeSql() { 
		if  (!is_array($this->sql_queries) || count($this->sql_queries) < 1)
			return 'SQL queries are not parsed properly.';

		foreach($this->sql_queries as $query) {
			if (!empty($query)) {
				if (!mysql_query($query)) {
					return mysql_error();
				}
			}
		}
		return true;
		
	}
	
	private function uniqueKeyGenerator() {
		return md5(uniqid(rand(), 1));
	}

}


?>