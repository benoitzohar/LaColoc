<?

class Conso {
	
	function __construct() {
		$this->current_user_id = Gestio::$user->get_var('id');
		$this->periods = array('Hors repas','Petit d&eacute;jeuner','Midi','Go&ucirc;ter','Diner');
	}
	
	function get_elements($order_by = ' label ASC') {
		$elements = array();
		$res_elements = GDB::db()->Execute("SELECT * FROM gestio_conso_elements ORDER BY ".$order_by);
		while (!$res_elements->EOF){
			$elements[$res_elements->fields['id']] = $res_elements->fields['label'];
			$res_elements->MoveNext();
		}
		return $elements;
	}
	
	function get_elements_for_user($user_id = 0) {
		if (empty($user_id)) $user_id = $this->current_user_id;

		$res_elements = GDB::db()->Execute("SELECT * 
											FROM gestio_conso_elements_per_user cepu,
												gestio_conso_elements ce
											WHERE cepu.element_id = ce.id
											AND	cepu.user_id = {$user_id} ");
		if ($res_elements) {
			while (!$res_elements->EOF){
				
				$color = $res_elements->fields['color'];
				if (!empty($color)) $color = 'style="background-color:'.$color.'"';
			
				$elements_per_user[] = array( 	'quantity' => $res_elements->fields['element_count'] ,
												'label' => $res_elements->fields['label'] ,
												'period' => $this->periods[$res_elements->fields['period']] ,
												'date' => date('d/m/Y',$res_elements->fields['date']) ,
												'style' => $color
					);
				$res_elements->MoveNext();
			}
		
		}
		
		return $elements_per_user;
	}
	
	function add_element($conso_new_label) {
		$sql = "INSERT INTO gestio_conso_elements (date_created,date_modified,label)
			VALUES(".time().",".time().",'".$conso_new_label."');";
		GDB::db()->Execute($sql);
	}
	
	function add_element_for_user($conso_element = 0,$conso_date = 0,$conso_quantity = 0,$conso_period = 0,$conso_color = '') {
		if (empty($conso_element)) return false;
		$conso_date = $this->get_date_as_timestamp($conso_date);
	
		$sql = "INSERT INTO gestio_conso_elements_per_user (id,element_id,user_id,date_created,date_modified,date,element_count,period,color)
				VALUES('',".$conso_element.",".$this->current_user_id.",".time().",".time().",".$conso_date.",".$conso_quantity.",".$conso_period.",'".$conso_color."');";
		GDB::db()->Execute($sql);
	}
	
	
	function get_weights() {
		$res = GDB::db()->Execute("SELECT * 
									FROM gestio_conso_weight w
									WHERE w.user_id = {$this->current_user_id}");
		$weights = array();
		if ($res) {
			while (!$res->EOF){
				$weights[] = array( 	'weight' => $res->fields['weight'] ,
										'date' => date('d/m/Y',$res->fields['date'])
					);
				$res->MoveNext();
			}
		
		}
		return $weights;
	
	}
	
	function add_weight($weight,$date) {
		$date = $this->get_date_as_timestamp($date);
		$sql = "INSERT INTO gestio_conso_weight (date_created,user_id,date,weight)
			VALUES(".time().",{$this->current_user_id},{$date},{$weight});";
		GDB::db()->Execute($sql);
	}
	
	function get_google_chart() {
		
		return 'https://chart.googleapis.com/chart?cht=p3&chd=t:60,40&chs=250x100&chl=Ton|Poids';
	}
	
	function display() {
		
	}
	
	function get_date_as_timestamp($date = '') {
		if (empty($date)) return time();
		list($day,$month,$year) = explode('/',$date);
		return mktime(0,0,0,$month,$day,$year);
	}

}

?>