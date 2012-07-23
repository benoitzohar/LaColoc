/**
 *  @description LaColoc Communication Core
 *  @author Benoit Zohar
 */

var com = {  
	
	url : false,
	file : 'webservice.php',

	/*
	 *	init()
	 */
	init : function(dialog_url) {
		if (dialog_url) this.url = dialog_url;
	},
	
	/*
	 *	dialog()
	 *	param:	action	
	 *	param:	original_data
	 *	param:	res
	 */
	dialog : function(action,original_data,res) {
		switch (action) {
			case 'setPreference': 
				
				break;
			default : fn.debug("action non gérée :"+action);
		}
	},
	
	/*
	 *	onResponse()
	 *	param:	rep	
	 *	param:	status
	 *	param:	xhr
	 */
	onResponse : function(rep, status, xhr) {
		if (!rep || !rep.status || !rep.data) return com.onError(xhr,status,rep);
		if (rep.message) fn.debug('message = ',rep.message);
		var d = rep.data;
		var cur_app = lc.getCurrentApp();
		var target = com;
		if (cur_app && cur_app == d.app) target = apps[d.app];
	
		if (target && target.dialog) target.dialog(d.action,d.params,d.result);
		
		ui.loading(false);
		
		// show alerts
		if (d.result && d.result.type && d.result.message) {
			if (d.result.type == 'alert') alert(d.result.message);
		}
	},
	
	/*
	 *	onError()
	 *	param:	xhr	
	 *	param:	status
	 *	param:	err
	 */
	onError : function(xhr,status,err) {
		fn.debug('Error : ',err.message);
		ui.message('error : '+err.message);
		ui.loading(false);
		return false;
	},
	
	/*
	 *	send()
	 *	param:	action	String
	 *	param:	params	Object/String
	 *	param:	app		String	Name of the app that call
	 */
	send : function(action,params,app) {
		if (!app) {
			if (lc.current_app) 	app = lc.current_app;
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

        if (!this.url ||!this.file) {
            fn.debug("url is not set for ajax request");
            return false;
        }

        if (obj.loading_message) ui.msg(obj.loading_message);
        
        $.ajax({
            url: this.url+this.file,
            data: obj,
            type: 'POST',
            dataType: 'json',
            success: this.onResponse,
            error: this.onError
        });

    }

}
