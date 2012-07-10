<?php

class gestio_app {

	static private $modules_tablename = 'gestio_modules';
	static private $modules_users_tablename = 'gestio_modules_users';
	
	private $error_msg = array();
	private $warning_msg = array();

	private $name;
	private $title;
	private $version;
	private $last_edit;
	private $logo;
	private $page_setup;
	private $page_admin;
	private $page_main;
	private $tables;
	
	public function __construct($name=null,$title=null,$version=null,$last_edit=null,$logo=null,$page_setup=null,$page_admin=null,$page_main=null,$tables=array()) {
		if (!empty($name)) {
			
			if(isset($title,$version)) {
				$this->name			= $name;
				$this->title 		= $title;
				$this->version 		= $version;
				$this->last_edit 	= $last_edit;
				$this->logo			= $logo;
				$this->page_setup 	= $page_setup;
				$this->page_admin 	= $page_admin;
				$this->page_main  	= $page_main;
				$this->tables		= $tables;
			}
			else {
		       	$res = GDB::db()->Execute("SELECT * FROM ".self::$modules_tablename."  WHERE name='{$name}' LIMIT 1;");
		    	if (!$res->EOF){
		    		$this->name			= $name;
		    		$this->title 		= $res->fields['title'];
					$this->version 		= $res->fields['version'];
					$this->last_edit 	= $res->fields['last_edit'];
					$this->logo		 	= $res->fields['logo'];
					$this->page_setup 	= $res->fields['page_setup'];
					$this->page_admin 	= $res->fields['page_admin'];
					$this->page_main  	= $res->fields['page_main'];
					$this->tables		= @unserialize($res->fields['tables']);
		    	}
		    	else return null;
			}
		}
		else return null;
	
	}
	
	public function __destruct() {
		if (count($this->error_msg)>0) {
			debug($this->error_msg,__FILE__,__LINE__);
		}
	}

	public function getName() { return $this->name; } 
	public function getTitle() { return $this->title; } 
	public function getVersion() { return $this->version; } 
	public function getLastEdit() { return $this->last_edit; } 
	public function getLogo() { 
		if (!empty($this->logo))
			return Gestio::$url.'modules/'.$this->name.'/'.$this->logo;
		else if (is_file(Gestio::$path.'modules/'.$this->name.'/img/logo.png')) {
			return Gestio::$url.'modules/'.$this->name.'/img/logo.png';
		}
	 } 
	public function getPageSetup() {
		if (!$this->page_setup) return '';
		if (is_file(Gestio::$path.'modules/'.$this->name.'/'.$this->page_setup)) {
			return Gestio::$path.'modules/'.$this->name.'/'.$this->page_setup;
		}
		else $this->error_msg[] = lang('Setup page ("'.$this->page_setup.'") does not exist... [app '.$this->name.']'); 
	} 
	public function getPageAdmin() {
		if (!$this->page_admin) return '';
		if (is_file(Gestio::$path.'modules/'.$this->name.'/'.$this->page_admin)) {
			return Gestio::$path.'modules/'.$this->name.'/'.$this->page_admin;
		}
		else $this->error_msg[] = lang('Admin page ("'.$this->page_admin.'") does not exist... [app '.$this->name.']'); 
	} 
	public function getPageMain() {
		if (!$this->page_main) return '';
		if (is_file(Gestio::$path.'modules/'.$this->name.'/'.$this->page_main)) {
			return Gestio::$path.'modules/'.$this->name.'/'.$this->page_main;
		}
		else $this->error_msg[] = lang('Main page ("'.$this->page_main.'") does not exist... [app '.$this->name.']');
	}
	
	
	public function getPublicLink() {
		return Gestio::$url.'app/'.$this->name;
	}
	
	
	public function getTables() { return $this->tables; } 
	public function setName($x) { $this->name = $x; } 
	public function setTitle($x) { $this->title = $x; } 
	public function setVersion($x) { $this->version = $x; } 
	public function setLastEdit($x) { $this->last_edit = $x; }
	public function setLogo($x) { $this->logo = $x; }
	public function setPageSetup($x) { $this->page_setup = $x; } 
	public function setPageAdmin($x) { $this->page_admin = $x; } 
	public function setPageMain($x) { $this->page_main = $x; } 
	public function setTables($x) { $this->tables = $x; } 
	
	public function write() {
		$res = GDB::db()->Replace(	self::$modules_tablename,
								array('name'=> $this->name,
								'title' 	=> $this->title,
								'version'	=> $this->version,	
								'last_edit'	=> $this->last_edit,
								'logo'		=> $this->logo,
								'page_setup'=> $this->page_setup,
								'page_admin'=> $this->page_admin,
								'page_main' => $this->page_main,
								'tables'	=> serialize($this->tables)),
								'name',true);
		return $res;
	}

	public function remove() {
		if (!GDB::db()->Execute("DELETE FROM ".self::$modules_tablename." WHERE name = '{$this->name}' LIMIT 1;")) {
			$this->error_msg[] = lang('unable to delete module %s',$this->name);
			return false;
		}
		foreach($this->tables as $table) {
			if (!GDB::db()->Execute("DROP TABLE {$table};")) {
				$this->error_msg[] = lang('unable to delete module %s - table ',$this->name,$table);
				return false;
			}
		}
		return true;
	}
	
	static public function get_all($user = false,$order = false, $only_names = false) {

		$res = array();
    	
    	$order = $order? "ORDER BY ".mysql_real_escape_string($order)." ;" : ";";
    	
    	if(!empty($user) && $user !== false) {
    		$user_filter = ", ".self::$modules_users_tablename." WHERE ".self::$modules_users_tablename.".id_module = ".self::$modules_tablename.".id AND ".self::$modules_users_tablename.".id_user = '".intval($user)."' ";
    	} else $user_filter = '';
    	
    	$request = "SELECT * FROM ".self::$modules_tablename." ".$user_filter." ".$order;

    	$sql = GDB::db()->Execute($request);
    	if ($sql)
	    	while (!$sql->EOF){
	    		if ($only_names) array_push($res,$sql->fields['name']);
		    	else array_push($res,new gestio_app($sql->fields['name'],$sql->fields['title'],$sql->fields['version'],$sql->fields['last_edit'],$sql->fields['logo'],$sql->fields['page_setup'],$sql->fields['page_admin'],$sql->fields['page_main'],$sql->fields['tables']));
	    		$sql->MoveNext();
	    	}
    	return $res;

	}

}