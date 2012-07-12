/**
 *  @description LaColoc Javascript Core
 *  @author Benoit Zohar
 */

var apps = {};

var lc = {

	current_app : false,

	init : function(url,app,initial_data) {
		if (com) 	com.init(url);
		if (ui) 	ui.init();
		if (app && app != 'main') {
			var d = false;
			if (initial_data && initial_data[app]) d = initial_data[app];
			this.loadApp(app,d);
		}
		
	},

	loadApp : function(app,initial_data) {
		if (app && apps[app] && apps[app].init && apps[app]) {
			this.current_app = app;
			apps[app].init(initial_data);
		}
	},
	
	getCurrentApp: function(full_object) {
		if (this.current_app != false) {
			if (full_object) return apps[this.current_app];
			else			 return this.current_app;
		}
		return false;
	}

}

