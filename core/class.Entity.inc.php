<?php
// TODO !
abstract class Entity {

    public function init($attributes=null) {
		if ($attributes !== NULL) {
		    if (is_array($attributes) && count($attributes) > 0) {
				if (isset($attributes[0])) $attributes = $attributes[0];
	
				foreach ($attributes as $attribute => $attributeValue) {
				    if ($attribute !== NULL && strlen($attribute) > 0 && intval($attribute) == 0) {
						$this->$attribute = $attributeValue;
				    }
				}
		    } 
		    else if (intval($attributes) > 0) {
				if(!is_object($attributes))  $this->init($this->getById($attributes)->toArray());
				else $this->init($attributes->toArray());
		    }
		}
    }

    /**
     * 	toArray(): method that returns the current object as an array
     * 	@param: for_json: true if the array is intended to be passed as JSON
     * 				(see specific toArray() methods in entity for details)
     * 	@param: avoid_subarrays : if true, array attributes will not be returned
     * 			(this is used to pass the array to the database)
     * 	@return: Array or false if and error occured or there is no attributes
     * */
    public function toArray($for_json = false, $avoid_subarrays = false) {
	$mapping = array();
	if ($this->__attributes !== NULL && is_array($this->__attributes) && count($this->__attributes) > 0) {
	    foreach ($this->__attributes as $attribute) {
		if ($this->$attribute instanceof Entity && !$avoid_subarrays) {
		    $mapping[$attribute] = $this->$attribute->toArray($for_json);
		} else if (is_array($this->$attribute) && count($this->$attribute) > 0) {
		    foreach ($this->$attribute as $item) {
			if ($item instanceof Entity) {
			    if (!empty($item->__identifier)) {
				$identifier = $item->__identifier;
				if (!$avoid_subarrays)
				    $mapping[$attribute][$item->$identifier] = $item->toArray($for_json);
				else
				    $mapping[$attribute][$item->$identifier] = $item;
			    }
			    else {
				if (!$avoid_subarrays)
				    $mapping[$attribute][] = $item->toArray($for_json);
				else
				    $mapping[$attribute][] = $item;
			    }
			}
		    }
		}
		else if (!is_array($this->$attribute) || !$avoid_subarrays) {
		    $mapping[$attribute] = $this->$attribute;
		}
	    }
	    if (isset($this->__toarray)) {
		foreach ($this->__toarray as $key => $value) {
		    $mapping[$key] = $this->$value();
		}
	    }
	    if (is_array($mapping)) {
		return $mapping;
	    }
	    else
		return false;
	}
	return false;
    }

    public function formatKeys($onlyNotNull=false) {
	$keys = $this->pk;
	$conditionsArray = false;
	if ($keys && is_array($keys) && count($keys) > 0) {
	    foreach ($keys as $key) {
		if ($onlyNotNull && $this->$key) {
		    $conditionsArray[$key] = $this->$key;
		} else if (!$onlyNotNull) {
		    $conditionsArray[$key] = $this->$key;
		}
	    }
	} elseif (!is_array($keys) && $keys > 0) {
	    $conditionsArray[$key] = $this->$key;
	}

	return $conditionsArray;
    }

    //utilise pour savoir plus rapidement is un element est deja present dans une liste
    public function formatDataKeys() {
	$keys = $this->pk;
	$dataLinear = "#";
	$conditionsArray = array();
	if ($keys && is_array($keys) && count($keys) > 0) {
	    foreach ($keys as $key) {
		$conditionsArray[] = $this->$key;
	    }
	} elseif (!is_array($keys) && $keys > 0) {
	    $conditionsArray[] = $this->$key;
	}
	$dataLinear = implode("#", $conditionsArray);
	return $dataLinear;
    }

    /**
     * 	save(): method that update or insert an object into DB
     * 	@param: $fields : Array of fields to update
     * 	@return: boolean: true if operation succeeded
     */
    public function save($fields = false) {

	$mapping = false;
	$mapping = $this->toArray(false, true);

	if ($mapping !== NULL && is_array($mapping) && count($mapping) > 0) {

	    // filter fields
	    foreach ($mapping as $key => $content) {
		if ($fields && is_array($fields) && count($fields) > 0) {
		    if (!in_array($key, $fields)) {
			unset($mapping[$key]);
		    }
		    continue;
		}
	    }

	    //Save the sub objects and
	    foreach ($mapping as $key => $content) {
		if (is_array($content)) {
		    foreach ($content as $subcontent) {
			//error_log("save==".print_r($subcontent->toArray(),true));
			if ($subcontent instanceof Object) {

			    $subcontent->save();
			}
		    }
		} else if ($content instanceof Object) {

		    $content->save();
		}
	    }

	    //test valeurs des ids
	    $keys = $this->pk;
	    if (!empty($keys) && !is_array($keys)) {
		$keys = array($keys);
	    }
	    $conditionsArray = false;

	    if ($keys && is_array($keys) && count($keys) > 0) {
		//on garde les clefs
		$keysFormatted = $this->formatKeys(false);
		if ($keysFormatted && is_array($keysFormatted) && count($keysFormatted) > 0) {
		    $mapping = array_merge($keysFormatted, $mapping);
		}
		$update = true;
		if ($keysFormatted && is_array($keysFormatted) && count($keysFormatted) > 0) {
		    foreach ($keysFormatted as $key => $value) {
		//	error_log("save $key => $value");

			if (!$value || empty($value) || $value <= -2) {

			    $update = false;
			}
		    }
		}

		if ($update) {
		    //on test pour le cas des tables d'associations
		    $resultAssoc = $this->getById($this->formatKeys());
		    if ($resultAssoc) {
			
			return $this->so->updateSQL($this->table, $mapping, $this->formatKeys());
		    } else {
			
			$id = $this->so->insertIntoSQL($this->table, $mapping, false);
			if ($id && $id > 0) {
				if (!$keys[0]) return true;
			    return $this->so->get_last_insert_id($this->table, $keys[0]);
			}
		    }
		} else {
		   
		    $id = $this->so->insertIntoSQL($this->table, $mapping, false);
		    if ($id && $id > 0) {
				if (!$keys[0]) return true;
			    return $this->so->get_last_insert_id($this->table, $keys[0]);
		    }
		}
	    }
	}
	return false;
    }

    public function read($id = false) {
		if (!$id) {
		    if (is_array($this->pk))
			$pk = $this->pk[0];
		    else
			$pk = $this->pk;
		    if (!empty($this->$pk))
			$id = $this->$pk;
		}
		$this->init($this->getById($id));
    }

    public function getById($id) {
		if (!is_array($id) && $id > 0) {
		    if (is_array($this->pk))
			$pk = $this->pk[0];
		    else
			$pk = $this->pk;
		    $find = $this->select(array($pk => $id));
		    if ($find && is_array($find) && count($find) > 0) {
			return $find[0];
		    }
		} 
		else if (is_array($id)) {
		    $find = $this->select($id);
		    if ($find && is_array($find) && count($find) > 0) return $find[0];
		   	return $find[0];
		}
		return false;
    }

    public function getAll() {
		return $this->select();
    }

	public function getAttr($attr='') {
		return $this->$attr;
	}

    public function get($conditions=array(), $ordre=null) {
		return $this->select($conditions, $ordre);
    }

    public function select($conditions=array(), $ordre=null) {
		if (is_array($conditions) || (is_string($conditions) && $conditions != '')) {
		    $objects = $this->so->selectFromSQL($this->table, $conditions, $ordre);
		    if ($objects != null && is_array($objects)) {
			$_objects = array();
			foreach ($objects as $object) {
			    array_push($_objects, $this->createNew($object));
			}
			return $_objects;
		    }
		}
		return array();
    }

    public function delete() {

	$arr = $this->formatKeys();


	//error_log("delete " . print_r($this->formatKeys(), true));
	return $this->so->deleteFromSQL($this->table, $this->formatKeys());
    }

    public function deleteAll() {
		$conditions = array('1' => '1');
		return $this->so->deleteFromSQL($this->table, $conditions);
    }
    
    
    /*
     *	DATABASE GLOBAL FUNCTIONS
     */
     
     
     	/******
	* Fonctions pour interagir avec la BDD
	* - pour l'ordre, plusieurs schémas sont possibles :
	*   1 - On passe une chaine de caractères qui sera ajoutée en l'état à la fin de la requête
	*   2 - On passe un tableau de champs et d'ordre. Chaque entrée du tableau doit soit :
	* 		- être de la forme 'champ' => 'ordre' (ex : 'founisseur_id' => 'asc')
	* 		- être de la forme 'champ'. Dans ce cas, ce champ sera automatiquement ascendant  
	* 	  array('fournisseur_id'=>'desc', 'type_produit') pour avoir un classement par fournisseur en ordre descendant
	*     puis un classement par type de produit en ordre ascendant.
	* - pour la limitation, on passe un tableau avec deux arguments : offset et number
	*   ex : $limit['offset'] = 20; $limit['number'] = 10;
	*   correspond à un LIMIT 20,10 en SQL
	* - $selecteur est utilisé pour réaliser des opérations de sélection spéciales comme count, max et autres. La syntaxe est celle du SQL
	*   ex: $selecteur = 'COUNT(*)'
	*/
	public function selectFromSQL($table,$conditions=array(),$ordre=null, $limit=null, $selecteur = null){
		if ($ordre != null && is_array($ordre) && count($ordre) > 0){
			$tableau_ordre = '';
			foreach ($ordre as $key => $val){
				if (trim(strtolower($val)) == 'asc' || trim(strtolower($val)) == 'desc'){
					//si on a la première forme 
					$tableau_ordre[] = $key . " " . $val;
				} else {
					$tableau_ordre[] = $val . " ASC";
				}
			}
			$ordre = " ORDER BY ".implode(',',$tableau_ordre);
		} else if ($ordre != null && !is_array($ordre)) {
		    $ordre = " ORDER BY ".$ordre." ASC";
		}
		if ($limit != null && is_array($limit) && $limit['offset'] !== null && $limit['number'] !== null){
			$offset = $limit['offset'];
			$num_rows = $limit['number'];
		} else {
			$offset = false;
			$num_rows = 0;
		}
		if ($selecteur === null){
			$selecteur = '*';
		}

		$success = $this->db->select($table,$selecteur,$conditions,__LINE__,__FILE__, $offset, $ordre, false, $num_rows);
		$data = array();
		if (!$success->EOF){
			while($this->db->next_record())
			{
				$data[] = array_map("stripslashes",$this->db->Record);
			}
			
			//Suppression des clés numériques;
			if(is_array($data) && count($data) > 0){
				foreach($data as $oneRecord => $array){
					foreach($array as $key => $value){
						if(is_string($key)==false) unset($data[$oneRecord][$key]);
					}
				}
				return $data;
			}
		}
		else return false;
		return $success;
		
	}
	
	public function insertIntoSQL($table,$parametres=array(),$conditions=false,$app=self::appname){
	
	    $state = $this->db->insert($table,$parametres,$conditions,__LINE__,__FILE__,$app);
		return $state === false ? $state:true;
	}
	
	public function updateSQL($table,$parametres,$conditions,$app=self::appname){
		$state = $this->db->update($table,$parametres,$conditions,__LINE__,__FILE__,$app);
		return $state === false ? $state : true;
	}
	
	public function deleteFromSQL($table,$conditions,$app=self::appname){
	
		$state =  $this->db->delete($table,$conditions,__LINE__,__FILE__,$app);	

		return $state === false ? $state : true;
		
	}
	
	public function get_last_insert_id($table, $field) {
		if (!$field) return true;
		return $this->db->get_last_insert_id($table, $field);
	}

}

?>