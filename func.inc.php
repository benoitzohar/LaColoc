<?

function lang(){	
	$params = func_get_args();
	$key = array_shift($params);
	$current_lang = LC::$default_lang;//@TODO
	
	$lang = get_lang_array($current_lang);
	
	// Temporary : add missing key to the end of the file
	if (empty($lang[$key])){
		$content = file_get_contents(LC::$path.'lang/'.$current_lang);
		$content = str_replace('<?php','',$content);
		$content = str_replace('?>','',$content);
		file_put_contents(LC::$path.'lang/'.$current_lang, '<?php'.$content."\n".'$lang["'.$key.'"] = "'.$key.'"; '."\n".'?>');
		include (LC::$path.'lang/'.$current_lang);
	}
	
	// Should not append : avoid returning empty translated string
	if (empty($lang[$key])){
		return $key;
	}
	
	return call_user_func_array('sprintf',array_merge(array($lang[$key]),$params));
}

function get_lang_array($clang) {
	if (!is_file(LC::$path.'lang/'.$clang)){
		$clang = LC::$default_lang;
	}
	include(LC::$path.'lang/'.$clang);
	return $lang;
}

function include_all_in($path){
	$handle = opendir(LC::$path.$path);
	while ($file = readdir($handle)) {
		if (is_file(LC::$path.$path.$file)){
			include_once(LC::$path.$path.$file);
		}
	}
}

function get_insert_query_values($fields,$values){
	$not_first = false;
	$res_fields = '(';
	$res_vals .= 'VALUES(';
	foreach($fields as $field){
		if (!empty($values[$field])){
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

function clean_array($origin_array,$keys_to_preserve = array()) {
	$res = array();
	foreach($keys_to_preserve as $k) {
		if (array_key_exists($k,$origin_array)) $res[$k] = $origin_array[$k];
	}
	return $res;
}

/******    DEBUG FUNCTIONS  **********/

function debug($val,$file = '',$line = ''){
	if (is_array($val)){
		error_log($file.($line?':'.$line:'')." ".print_r($val,true));
	}
	else
		error_log($file.($line?':'.$line:'')." ".$val);
}

/******** FILE MANAGEMENT FUNCTIONS *********/

function get_dir_content($dir){
	$res = array();
    $handle = opendir($dir);
	while ($mod = readdir($handle)) {
		if ($mod != '.' && $mod != '..')
			array_push($res,$mod);
	}
	if ($handle) closedir($handle);
	return $res;
}

function get_readable_size($size, $retstring = null) {
        $sizes = array('Octets', 'ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo');
        if ($retstring === null) { $retstring = '%01.2f %s'; }
        $lastsizestring = end($sizes);
        foreach ($sizes as $sizestring) {
                if ($size < 1024) { break; }
                if ($sizestring != $lastsizestring) { $size /= 1024; }
        }
        if ($sizestring == $sizes[0]) { $retstring = '%01d %s'; }
        return sprintf($retstring, $size, $sizestring);
}

/******* Error Handling *******/
function ajax_exit(){
	header("HTTP/1.0 403 Bad Request");
	exit;
}


/******** Posted Data Handling ******/

function request_vars_not_empty(){
	$args = func_get_args();
	
	if (is_array($args)){
		foreach ($args as $arg){
			debug($_REQUEST);
			if (empty($_REQUEST[$arg])){
				return false;
			}
		}
		return true;
	}
	else return false;
} 
?>