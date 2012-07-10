/**
 *  @description LaColoc Communication Core
 *  @author Benoit Zohar
 */

var com = {  
	
	url : false,
	file : 'webservice.php',

	init : function(dialog_url) {
		if (dialog_url) this.url = dialog_url;
	},
	
	dialog : function(action,original_data,res) {
		switch (action) {
			case 'a': break;
			default : fn.debug("action non gérée :"+action);
		}
	},
	
	onResponse : function(rep, status, xhr) {
		
	},
	
	onError : function(xhr,status,err) {
		
	},
	
	/*
	 *	send()
	 *	
	 */
	send : function(action,params,app) {
		if (!app) {
			if (this.current_app) 	app = this.current_app;
			else					app = 'main';
		}
		
		var obj = {
			app : app,
			action : action,
			params : params				
		};

		this.ajaxRequest(obj);
	},
	
    
    /*
     *	ajaxRequest: execute an ajax request with a queue
     *	@param: obj: object: object that wants to execute an ajax request
     *	@return: boolean: return false if the url is not set for ajax request
     */
    ajaxRequest: function (obj) {

        if (!this.url) {
            fn.debug("url is not set for ajax request");
            return false;
        }

        if (obj.loading_message) ui.msg(obj.loading_message);
        
        $.ajax({
            url: this.url+this.file,
            data: obj,
            type: 'POST',
            dataType: 'json',
            success: function (reponse, status, xhr)
            {
                //console.log('ajaxRequest Response:',reponse);
                if (!reponse)
                {
                    ui.message(vmthis.lang('server_did_not_respond'),'error');
                    fn.debug('Server did not respond for: ' + obj.action);
                }
                else {
	                ui.loading(false);
                }
            },
            error: function (xhr, status, err)
            {	
            	fn.debug('AJAX ERROR. XHR=' +xhr+', STATUS='+status+', ERR='+err);
                // Test if user is not logged anymore
                if (err && typeof(err) === 'string' && err.match('class="login_input"')) {
                	window.location.reload();
                }

                if (status == 'parsererror') status = vmthis.lang('fatal_error_occured_on_server');
                vmthis.display('message', 'err', status);
                vmthis.display('loading_wheel', 'hide');
            }
        });

    }

}
