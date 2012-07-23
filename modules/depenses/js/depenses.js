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
		
		//u.list.tbody.append(this.createRow().tr_td);
		
		u.list.table.append(u.list.thead,u.list.tbody);
		
		this.handler.append(u.list.table);
	},
	
	createRow : function(data,editable) {
		if (!data || !data.id) return false;
		var t = this;
		
		// get date
		var date_str = fn.getDate(data.date || new Date(),'string_no_hours');
	
		// create dom
		var row = {
			tr_td : $('<tr><td></td></tr>'),
			div : $('<div />').addClass('input-prepend input-append '),		
			span_before : $('<span />').addClass('add-on').text(date_str),
			span_after : $('<span />').addClass('add-on').text(lc.getCurrentGroup(true).devise),
			
							//$('<button />').addClass('btn').attr('type','button').html('<i class="icon-cog"></i>'),
			input : $('<input class="span2 cost_input numbered" size="16" type="text">'),
			id : data.id
		};
		
		// add dom to row div
		row.div.append(
			row.span_before,
			row.input,
			row.span_after
		);
		
	  
		
		row.tr_td.append(row.div);
		
		if (editable) {
			 
			 // add menu
			 var button_after = $('<span />').addClass('add-on btn-group');
			 var dropdown_link = $('<a />').addClass('dropdown-toggle').attr('data-toggle','dropdown').attr('href','#')
			 					.css({
								 'margin': '-7px',
								 'padding-top': '6px',
								 'padding-bottom': '6px',
								 'padding-left': '13px',
								 'padding-right': '13px'
								})
							 	.append($('<i />').addClass('icon-cog'));
			var dropdown_menu = $('<ul />').addClass('dropdown-menu')
								.append($('<li />').append($('<a />').click(function(e) { t.deleteCost(e,row); }).text(L('Delete'))));
			 
			 button_after.append(dropdown_link,dropdown_menu);
			 
			 row.button_after = button_after;
			 row.div.append(row.button_after);
			 
			 // bind events
			 row.input.keyup(function(e){ 
			 	t.onCostChange(e,row);
			 }).focus(function(e) { var a=this; setTimeout(function() { a.select(); },100); });
			 
			 // bind date
			 row.span_before
			 		.attr('data-date-format',lc.getPreference('dateformat','dd/mm/yyyy'))
					.attr('data-date',date_str)
					.datepicker({
					 	format : lc.getPreference('dateformat','dd/mm/yyyy'),
					 	weekStart : lc.getPreference('weekstart',1)
					 }).on('changeDate', function(e) { t.onDateChange(e,row); });
		}
		
		return row;
	},
	
	onCostChange : function(e,r) {
		if (!r || !r.input) return false;
		var val = r.input.val();
		if (!/^[0-9]*(\.|,)*[0-9]{0,2}$/.test(val)) {
			r.input.val(r.input.data('last_val'));
		}
		else {
			r.input.data('last_val',val);
		}
	},
	
	onDateChange : function(e,r) {
		console.log('date change',e);	
		if (r.span_before)
			r.span_before.text(fn.getDate(e.date,'string_no_hours'));
		
	},
	
	deleteCost : function(e,r) {
		if (confirm(L('do_you_really_want_to_delete?'))) {
			com.send('deleteDepense',{ id: r.id });
			console.log(this.users,"this.users");console.log(this.users[lc.getCurrentUser()],"this.users[lc.getCurrentUser()]");
			if (this.users[lc.getCurrentUser()].depenses
				&& this.users[lc.getCurrentUser()].depenses[r.id]
				&& this.users[lc.getCurrentUser()].depenses[r.id].row) { 
				this.users[lc.getCurrentUser()].depenses[r.id].row.tr_td.remove();
				this.users[lc.getCurrentUser()].depenses[r.id] = false;
			}
		}
	},
	
	updateList : function(user_id) {
		if (!user_id) return false;
		var u = this.users[user_id];
		if (!u || !u.depenses) return false;
		
		var editable = user_id == lc.getCurrentUser();
		
		for(var k in u.depenses) {
			var d = u.depenses[k];
			if (!d) continue;
			if (!d.row) {
				d.row = this.createRow(d,editable);
				u.list.tbody.append(d.row.tr_td);
			}
			this.updateRow(d.row,d);
		}
		
	},
	
	updateRow : function(row,data) {
	
		//state
	
		//input
		row.input.val(data.cost).data('last_val',data.cost);
		
		//date
		var date_str = fn.getDate(data.date || new Date(),'string_no_hours');
		row.span_before.data('initial_value',date_str).attr('data-date',date_str);
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