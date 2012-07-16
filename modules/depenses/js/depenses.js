apps.depenses = {
	
	users : {},
	data : {},
	total : 0,
	
	handler : false,
		
	init: function (initial_data){
	
		this.handler = $('#dep_wrapper');
		this.modal_add_form = $('#dep_add_form');
		this.modal_add_form.modal({show:false});
		
		//load initial data
		if (initial_data){
			//this.data = initial_data;
		}
		
		this.updateAll();
	},
	
	/*
	 *	dialog()
	 *	param:	action	
	 *	param:	original_data
	 *	param:	res
	 */
	dialog : function(action,original_data,res) { console.log('res from "'+action+'":',res);
		switch (action) {
			case 'addDepense' :
				this.loadData(res); 
				break;
			case 'editDepense' : 
				this.loadData(res);
				break;
			case 'deleteDepense' : 
				this.loadData(res);
				break;
			case 'getAllInfos' : 
				this.loadData(res);
				break;
			default : fn.debug("action non gérée :"+action);
		}
	},
	
	loadData : function(raw) {
	
		if (!raw) return false;
		
		//load users data
		if (raw.users){
			for(var k in raw.users) {
				if (!this.users[k]) this.users[k] = {};
				var user = raw.users[k];
				this.users[k].balance = user.balance;
				if(user.depenses && user.depenses.length) {
					for(var l in user.depenses) {
						if (user.depenses[l] && user.depenses[l].id) {
							if (!this.users[k].depenses) this.users[k].depenses = {};
							this.users[k].depenses[user.depenses[l].id] = user.depenses[l];
						}
					}
				}
			}
		}
		
		// load total
		if (raw.total) this.total = raw.total;
	},

	
	createList : function(user) {
		
		this.table = $('<table />').addClass('table table-striped');
		this.thead = $('<tr />');
		this.tbody = $('<tbody />');
		
		this.thead.append('<th>Benoit</th>');
		this.tbody.append($('<tr />').append($('<td />').append(this.createRow())));
		this.tbody.append($('<tr />').append($('<td />').append(this.createRow())));
		this.tbody.append($('<tr />').append($('<td />').append(this.createRow())));
		this.tbody.append($('<tr />').append($('<td />').append(this.createRow())));
		
		this.table.append(this.thead.wrap('<thead />'),this.tbody);
		this.handler.append(this.table);
	},
	
	createRow : function(list,data) {
	
		var row = $('<div />').addClass('input-prepend input-append');
		var span_before = $('<span />').addClass('add-on').text('21/12/1098');
		var span_after = $('<span />').addClass('add-on').text('€');
		var button_after = $('<button />').addClass('btn').attr('type','button').html('<i class="icon-cog"></i>');
		var input = $('<input class="span2" size="16" type="text">');
        row.append(span_before,input,span_after,button_after);
        return row;
	},
	
	updateAll : function() {
		if (!this.handler) return false;
	
		
		
	},
	
	
	/* MODAL ADD FORMULAIRE */
	openAddForm : function() {
		this.modal_add_form.modal('show');
	}
	
	
};