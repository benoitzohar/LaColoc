<?php

abstract class Entity {

	public function __construct($id,$infos = false){
		if (!$id && is_array($infos)){
			$query = "INSERT INTO ".$this->_table." ";
			$infos['created'] = time();
			$infos['updated'] = time();
			$query.= $this->get_insert_query_values($infos);
			if (!GDB::db()->Execute($query)) {
				exit(GDB::db()->ErrorMsg());
			}
			$this->id = $this->get_last_insert_id();
		}
		else {
			$this->id = $id;
			if (is_array($infos)) {
				foreach ($this->_fields as $field){
					$this->{$field} = $infos[$field];
				}
			}
			else {
				$res = GDB::db()->Execute('SELECT * FROM '.$this->_table.' WHERE id = '.$id.' LIMIT 1;');
				if(!$res->EOF){
					foreach ($this->_fields as $field){
						$this->{$field} = $res->fields[$field];
					}
				}
			}
		}	
	}
	
	public function get_insert_query_values($values){
		$not_first = false;
		$res_fields = '(';
		$res_vals .= 'VALUES(';
		foreach($this->_fields as $field){
			if (isset($values[$field])){
				if ($not_first){
					$res_vals.= ", ";
					$res_fields .= ", ";
				}
				$res_fields.= $field;
				$res_vals.= "'".mysql_real_escape_string($values[$field])."'";
				$not_first = true;
			}
		}
		$res_fields .= ') ';
		$res_vals .= ') ';
		return $res_fields.$res_vals;
	}
	
	public function get_last_insert_id(){
		$res = false;
		$res = GDB::db()->Execute('SELECT LAST_INSERT_ID();');

		if (!empty($res->fields[0]))
			return $res->fields[0];
		
		return false;
	}

	public function getId() {
		return $this->id;
	}
	
	public function get_vars(){
		$res = array();
		foreach ($this->_fields as $field){
			$res[$field] = $this->{$field};
		}
		return $res;
	}
	
	public function get_var($var,$default = null){
		if (empty($this->{$var}) && $default !== null) return $default;
		return $this->{$var};
	}
	
	public function set_var($var,$val){
	
		if (empty($this->id)) return false;
	
		$res = GDB::db()->Execute("UPDATE ".$this->_table." SET ".$var." = '".mysql_real_escape_string($val)."' ,updated = '".time()."' WHERE id = ".$this->id." LIMIT 1;");
		if ($res)
			return $this->{$var} = $val;
		else 
			exit(GDB::db()->ErrorMsg());
	}
	
	public function to_array($keys = false){
		$res = array();
		if ($keys){
			return $this->get_vars();
		}
		else {
			foreach ($this->_fields as $field){
				$res[$field] = $this->{$field};
			}
			return $res;
		}
		return false;
	}
	
	public function toArray($keys = false) { return $this->to_array($keys); }
	
	public function delete() {
		$query = "DELETE FROM ".$this->_table." WHERE id = ".$this->id." LIMIT 1;";
		if (!GDB::db()->Execute($query)) {
			exit(GDB::db()->ErrorMsg());
		}
	}
	
	public static function get($classname = '',$where = false,$order = false, $as_array = false, $include_deleted = false) {
    	if (empty($classname)) return array();
    	if (empty($where)) return self::get_all($classname,$order,$as_array);
        $db = GDB::db();
    	$res = array();
    	
    	$deleted_str = (!$include_deleted?' AND ifnull(deleted,0) <> 1 ':'');
    	
    	$where_str = '';
    	if (is_array($where)) {
    		foreach($where as $wh_key => $wh_val) {
    			$where_str .= 'AND '.$wh_key." = '".$wh_val."' ";
    		}
    		if (!empty($where_str)) {
    			$where_str = 'WHERE '.substr($where_str,3).$deleted_str;
    		}
    	} else if (!empty($where)){
    		$where_str = 'WHERE '.$where.$deleted_str;
    	}
    	
    	$order = $order? "ORDER BY ".mysql_real_escape_string($order)." ;" : ";";
    	$sql = $db->Execute("SELECT id FROM ".$classname::$table." ".$where_str." ".$order);
    	while (is_object($sql) && !$sql->EOF){
    		$obj = new $classname($sql->fields['id']);
    		if ($as_array) $obj = $obj->to_array();
    		array_push($res,$obj);
    		$sql->MoveNext();
    	}
    	return $res;
    }


    public static function get_all($classname = '',$order = false, $as_array = false, $include_deleted = false) {
    	if (empty($classname)) return array();
        $db = GDB::db();
    	$res = array();
    	$deleted_str = (!$include_deleted?' WHERE ifnull(deleted,0) <> 1 ':'');
    	$order = $order? " ORDER BY ".mysql_real_escape_string($order)." ;" : ";";

    	$sql = $db->Execute("SELECT id FROM ".$classname::$table.$deleted_str.$order);
    	
    	if ($sql) {
	    	while (!$sql->EOF){
	    		$obj = new $classname($sql->fields['id']);
	    		if ($as_array) $obj = $obj->to_array();
	    		array_push($res,$obj);
	    		$sql->MoveNext();
	    	}
    	}
    	return $res;
    }

	static public function get_fields(){
		return $this->_fields;
	}

}

?>