<?

class User extends Entity {
	
	public static $classname = 'User';
	public static $fields = array('id','login','passwd','firstname','lastname','last_login_time','last_login_ip','group_id','created','updated','deleted');
	public static $table = 'lc_users';
	
	protected $_classname;
	protected $_fields;
	protected $_table;
		
	private $error_msg = array();
	private $warning_msg = array();

	
	protected $id;
	protected $login;
	protected $passwd;
	protected $firstname;
	protected $lastname;
	protected $last_login_time;
	protected $last_login_ip;
	protected $group_id;
	protected $created;
	protected $updated;
	protected $deleted;

	public function __construct($id,$infos = false){
		$this->_classname = self::$classname;
		$this->_fields = self::$fields;
		$this->_table = self::$table;
	
		parent::__construct($id,$infos);
	}
	
	public function getGroup($only_id = false) {
		if ($only_id) return $this->get_var('group_id');
		return new Group($this->get_var('group_id'));
	}
	
    public static function get_user($login,$passwd = false){
    	$login = mysql_real_escape_string($login);
    	if (isset($passwd) && $passwd !== false) {
    		$passwd = mysql_real_escape_string($passwd);
    		$query = "SELECT id FROM ".self::$table." WHERE login = '{$login}' AND passwd = '{$passwd}' LIMIT 1;";
    	}
    	else {
    		$query = "SELECT id FROM ".self::$table." WHERE login = '{$login}' LIMIT 1;";
    	}
    	$sql = GDB::Execute($query);
    	if (!$sql->EOF){
    		return new User($sql->fields['id']);
    	}
    	return false;
    }
    
    public static function is_in_group($user_id = false,$group_id = false){
	    if ($user_id === false || $group_id === false) return false;
	    $group = new Group($group_id);
	    $users_in_group = $group->getUsers(true); // get only IDs
	    return in_array($user_id,$group_id);
    }
   
	static public function get_lang_fields(){
		$res = array();
		foreach (self::$fields as $field)
			array_push($res,lang($field));
		return $res;
	}
}

?>