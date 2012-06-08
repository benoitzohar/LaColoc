<?

class gestio_user {

	static public $fields = array("id","login","passwd","last_login_time","last_login_ip");
	private $id;
	private $login;
	private $passwd;
	private $last_login_time;
	private $last_login_ip;

	public function __construct($id,$infos = false){
		if (!$id && is_array($infos)){
			$query = "INSERT INTO gestio_users ";
			$infos['last_login_ip'] = $_SERVER['REMOTE_ADDR'];
			$query.= get_insert_query_values(self::$fields, $infos);
			if (!GDB::Execute($query)) {
				exit(GDB::ErrorMsg());
			}
		}
		else {
			$this->id = $id;
			$res = GDB::Execute('SELECT * FROM gestio_users WHERE id = '.$id.' LIMIT 1;');
			if(!$res->EOF){
				foreach (self::$fields as $field){
					$this->{$field} = $res->fields[$field];
				}
			}
		}	
	}
	
	public function get_vars(){
		$res = array();
		foreach (self::$fields as $field){
			$res[$field] = $this->{$field};
		}
		return $res;
	}
	
	public function get_var($var){
		return $this->{$var};
	}
	
	public function set_var($var,$val){
		$res = GDB::Execute("UPDATE gestio_users SET ".$var." = '".mysql_real_escape_string($val)."' WHERE id = ".$this->id." LIMIT 1;");
		if ($res)
			return $this->{$var} = $val;
		else 
			exit(GDB::ErrorMsg());
	}
	
	public function to_array($keys = false){
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
	
	public function delete() {
		$query = "DELETE FROM gestio_users WHERE id = ".$this->id." LIMIT 1;";
		if (!GDB::Execute($query)) {
			exit(GDB::ErrorMsg());
		}
	}

    public static function get_all($order = false) {
    	$res = array();
    	$order = $order? "ORDER BY ".mysql_real_escape_string($order)." ;" : ";";
    	$sql = GDB::Execute("SELECT id FROM gestio_users ".$order);
    	while (!$sql->EOF){
    		array_push($res,new gestio_user($sql->fields['id']));
    		$sql->MoveNext();
    	}
    	return $res;
    }
    public static function get_user($login,$passwd = false){
    	$login = mysql_real_escape_string($login);
    	if (isset($passwd) && $passwd !== false) {
    		$passwd = mysql_real_escape_string($passwd);
    		$query = "SELECT id FROM gestio_users WHERE login = '{$login}' AND passwd = '{$passwd}' LIMIT 1;";
    	}
    	else {
    		$query = "SELECT id FROM gestio_users WHERE login = '{$login}' LIMIT 1;";
    	}
    	$sql = GDB::Execute($query);
    	if (!$sql->EOF){
    		return new gestio_user($sql->fields['id']);
    	}
    	return false;
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