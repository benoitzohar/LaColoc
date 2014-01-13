<?php

class Dialog {

	public function sendFeedback($p) { error_log(__METHOD__.':'.__LINE__."\n".print_r($p,true));
		if (!is_array($p) || !LC::M()->user) return false;
		$fb = new Feedback(false,
			array(
			'user_id' => LC::M()->user->getId(),
			'title' => $p['title'],
			'message' => $p['message'],
			'error' => $p['error'],
			'date' => time()
			)
		);
		
		if (!empty(LC::$admin_email)) {
			mail(LC::$admin_email,"[LaColoc] Feedback de ".LC::M()->user->getFullname(),"Message=\n".$p['message']."\n \n \n \n Error=\n\n".$p['error']);
		}
		return array('result_text'=> lang("Thanks_for_the_feedback"));
	}
	
	public function getPreference($p) {
		$pref = LC::M()->getPreference($p['name'],$p['app']);
		return $pref;
	}
	
	public function setPreference($p) {
		$res = LC::M()->setPreference($p['name'],$p['value'],$group = false,$p['app']);
		if (!$res) return null;
		return $this->getPreference($p);
	}
	
	public function updateProfil($p) {
		if (!is_array($p) || !$p['field'] || !LC::M()->user) return false;
		$prf = 'profile_'; // field prefix in the html
		$val = $p['value'];
		switch($p['field']) {
			case $prf.'firstname': 	LC::M()->user->set_var('firstname',$val); break;
			case $prf.'lastname': 	LC::M()->user->set_var('lastname',$val);break;
			case $prf.'email' : 	LC::M()->user->set_var('email',$val);break;
			case $prf.'password' : 	LC::M()->user->setPassword($val); break;
		}
		return array('current_user' => LC::M()->user->toArray(false,true));
	}
	
	public function switchGroup($p) {
		if (!is_array($p) || empty($p['new_group_id']) || !LC::M()->user) return false;
		
		$res = Group::switchGroup(LC::M()->user,$p['new_group_id']);
		
		return array('group_switched' => $res);
	}
	
	public function profilePicture($p) {
		// Include Libs
		require_once(LC::$path.'libs/UploadHandler.php');
		$upload_handler = new UploadHandler(array(
            'script_url' => LC::$url,
            'upload_dir' => LC::$path.'profile_pictures/',
            'upload_url' => LC::$url.'profile_pictures/',
            'mkdir_mode' => 0755,
            'param_name' => 'files',
            'delete_type' => 'DELETE',
            'access_control_allow_origin' => '*',
            'access_control_allow_credentials' => false,
            'access_control_allow_methods' => array('OPTIONS', 'HEAD', 'GET','POST','PUT','PATCH','DELETE'),
            'access_control_allow_headers' => array('Content-Type','Content-Range','Content-Disposition'),
            // Defines which files (based on their names) are accepted for upload:
            'accept_file_types' => '/\.(gif|jpe?g|png)$/i',
            'min_width' => 96,
            'min_height' => 96,
            'image_versions' => array(
            	'24' => array(
                    'max_width' => 24,
                    'max_height' => 24
                ),
            	'54' => array(
                    'max_width' => 54,
                    'max_height' => 54
                ),
                '96' => array(
                    'max_width' => 96,
                    'max_height' => 96
                ),
            )
        ),false);
		
		$res = $upload_handler->initialize();
		
		if ($res['files'] && $res['files'][0]) {
			
			$obj = $res['files'][0];
			if (!$obj->error) {
				if (LC::M()->user && $obj->name) {
					$raw_name = rawurlencode($obj->name);
					LC::M()->user->set_var('picture',$raw_name);
					$obj->raw_name = $raw_name;
				}
			}	
		}
			
		return $res;
	}
	
}


?>