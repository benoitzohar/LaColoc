apps.depenses = {
	
	users : {},
	total : 0,
	
	handler : false,
		
	init: function (initial_data){
	
		this.handler = $('#dep_wrapper');
		this.modal_add_form = $('#dep_add_form');
		//this.modal_add_form.modal({show:false});
		
		//load initial data
		if (initial_data){
			this.loadData(initial_data);
		}
		
		this.updateAll();
	},
	
	refreshAll : function() { 
		// add animation to button
		$('#dep_refresh i').addClass('rotate180');
		setTimeout(function() {
			$('#dep_refresh i').removeClass('rotate180');
		},700);
		// launch request
		com.send('getAllInfos');
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
		this.updateAll();
	},
	
	loadData : function(raw) { console.log('raw:',raw);
	
		if (!raw) return false;
		
		//load users data
		if (raw.users){
			for(var k in raw.users) {
				if (!this.users[k]) this.users[k] = {};
				var user = raw.users[k];
				this.users[k].balance = user.balance;
				if(user.depenses && user.depenses.length) {
					this.users[k].to_update = true;
					for(var l in user.depenses) {
						if (user.depenses[l] && user.depenses[l].id) {
							if (!this.users[k].depenses) this.users[k].depenses = {};
							if (!this.users[k].depenses[user.depenses[l].id]) this.users[k].depenses[user.depenses[l].id] = {};
							for(var m in user.depenses[l]) {
								this.users[k].depenses[user.depenses[l].id][m] = user.depenses[l][m];
							}
							
						}
					}
				}
			}
		}

		// load total
		if (raw.total) this.total = raw.total;
	},

	
	createList : function(user_id) {
		if (!user_id) return false;
		var u = this.users[user_id];
		if (!u || u.list) return false;
		
		u.list = {
			'table' : $('<table />').addClass('table table-striped'),
			'thead' : $('<thead />'),
			'tbody' : $('<tbody />')
		};
		
		u.list.thead.append(
			$('<tr />').append($('<th>'+lc.getUser(user_id).firstname+'</th>'))
		);
		
		u.list.tbody.append(this.createRow().tr_td);
		
		u.list.table.append(u.list.thead,u.list.tbody);
		
		this.handler.append(u.list.table);
	},
	
	createRow : function() {
	
		// create dom
		var row = {
			tr_td : $('<tr><td></td></tr>'),
			div : $('<div />').addClass('input-prepend input-append'),		
			span_before : $('<span />').addClass('add-on'),
			span_after : $('<span />').addClass('add-on'),
			button_after : $('<button />').addClass('btn').attr('type','button').html('<i class="icon-cog"></i>'),
			input : $('<input class="span2 cost_input" size="16" type="text">')
		};
		
		// add dom to row div
        row.div.append(
        	row.span_before,
        	row.input,
        	row.span_after,
        	row.button_after
        );
        
        // bind events
        row.input.keyup(function(e){
        	console.log('e keyup',e);
        });
        
        row.tr_td.append(row.div);
        
        return row;
	},
	
	updateList : function(user_id) {
		if (!user_id) return false;
		var u = this.users[user_id];
		if (!u || !u.depenses) return false;
		
		
		for(var k in u.depenses) {
			var d = u.depenses[k];
			if (!d) continue;
			if (!d.row) {
				d.row = this.createRow();
				u.list.tbody.append(d.row.tr_td);
			}
			this.updateRow(d.row,d);
		}
		
	},
	
	updateRow : function(row,data) {
		row.input.val(data.cost);
	},

	updateAll : function() {
		if (!this.handler) return false;
		
		// update each lists
		for(var k in this.users) {
			if (!this.users[k].list) this.createList(k);
			if (this.users[k].to_update) {
				this.users[k].to_update = false;
				this.updateList(k);
			}
		}
		
		// update total
		
		
	},
	
	
	/* MODAL ADD FORMULAIRE */
	openAddForm : function() {
		this.modal_add_form.modal('show');
	},
	
	onAddFormValid : function() {
	
		var valid = true;
		var errors = [];
		
		var cost = $('#add_form_cost').val();
		var comment  = $('#add_form_title').val();
		var repeat = 0;
		var targeted_users = '';
	
		if (!valid) return this.displayAddFormErrors(errors);
	
		com.send('addDepense',{	cost : cost, comment: comment,  repeat: repeat, targeted_users: targeted_users },'depenses');
		this.modal_add_form.modal('hide');
	},
	
	onAddFormCancel : function() {
		
	}
	
	
};