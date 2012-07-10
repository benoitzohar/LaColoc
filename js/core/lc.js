/**
 *  @description LaColoc Javascript Core
 *  @author Benoit Zohar
 */

var lc = {

	current_app : false,

	init : function(url,app) {
		if (com) 	com.init(url);
		if (ui) 	ui.init();
		if (app) { 
			this.loadAdd(app);
		}
		
	},

	loadApp : function(app) {
		if (app && apps[app] && apps[app].init) {
			apps[app].init();
			this.current_app = app;
		}
	}

}
