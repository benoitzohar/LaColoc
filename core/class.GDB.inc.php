<?

class GDB {

	static $gdb;
	
	function GDB($gestio_db_config){
		$db_conn = ADONewConnection($gestio_db_config['type']);
		//$db_conn->debug = true;
		$db_conn->createdatabase = true ;
		$res = $db_conn->Connect($gestio_db_config['host'],$gestio_db_config['user'],$gestio_db_config['pass'],$gestio_db_config['database']);

		self::$gdb =& $db_conn;
		return $db_conn;
	}

	public static function db(){
		if (is_object(self::$gdb))
			return self::$gdb;
		else
			exit("There is a problem with the database...");
	}
	
	
	// Manually extends ADODB functions (in order to customize them)
	
	public static function Execute($param) {
		if (!self::$gdb) return false;
		return self::$gdb->Execute($param);
	}
	
	public static function ErrorMsg() {
		if (!self::$gdb) return false;
		return self::$gdb->ErrorMsg();
	}
	
	// Automagical DB functions
	
	public static function Select($table,$where,$column = '*',$limit = false,$extra = false) {	
	}
	
	public static function Insert($table,$data) {
		if (!self::$gdb) return false;
		return self::$gdb->AutoExecute($table,$data,'INSERT');
	}
	
	
	public static function Update($table,$data,$where) {
		if (!self::$gdb) return false;
		return self::$gdb->AutoExecute($table,$data,'UPDATE',$where);
	}
	
	
}


?>