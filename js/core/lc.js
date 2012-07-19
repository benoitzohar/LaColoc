/**
 *  @description LaColoc Javascript Core
 *  @author Benoit Zohar
 */

var apps = {};

var lc = {

	current_app : false,
	current_user : false,
	
	users : {},
	group : false,

	init : function(url,app,initial_data) {
		if (com) 	com.init(url);
		if (ui) 	ui.init();
		if (initial_data && initial_data['main']) this.loadData(initial_data['main']);
		if (app && app != 'main') {
			var d = false;
			if (initial_data && initial_data[app]) d = initial_data[app];
			this.loadApp(app,d);
		}
		
	},
	
	loadData : function(raw) {
		if (!raw) return false;
		console.log('loadData from MAIN:',raw);
		// load simple data
		var keys = ['current_user','group'];
		for(var k in keys){
			var r = raw[keys[k]];
			if (typeof r != 'undefined' && r !== null) {
				if (typeof r != 'array' && typeof r != 'object') 	this[keys[k]] = r;
				else	$.extend(true,this[keys[k]],r);
			}
		}
		
		// load users
		if (raw.users) {
			for(var k in raw.users) {
				if (raw.users[k] && raw.users[k].id) {
					if (!this.users[raw.users[k].id]) this.users[raw.users[k].id] = {};
					this.users[raw.users[k].id] = $.extend(true,this.users[raw.users[k].id],raw.users[k]);
				}
			}
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
	},
	
	getCurrentUser : function(full_object) {
		if (this.current_user != false) {
			if (full_object) return this.users[this.current_user];
			else			 return this.current_user;
		}
		return false;
	}

}

