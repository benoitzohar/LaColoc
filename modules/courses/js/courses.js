apps.courses = {
	
	paniers : {},
	current_panier : false,
	
	handler : false,
	list : false,
	
	new_row_exists : false,
		
	init: function (initial_data){
	
		this.handler = $('#cou_wrapper');
		this.list = $('#cou_wrapper #todolist');
		
		//load initial data
		if (initial_data){
			this.loadData(initial_data);
		}
		
		this.updateAll();
		
		// add new panier item
		var new_row = this.createRow(false);
		$('#cou_wrapper #todolist_add').append(new_row.li);
	},
	
	refreshAll : function() { 

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
			case 'addPanier' :
				this.loadData(res); 
				break;
			case 'editPanier' : 
				this.loadData(res);
				break;
			case 'deletePanier' : 
				this.loadData(res);
				break;
			case 'addPanierItem' :
				this.loadData(res); 
				break;
			case 'editPanierItem' : 
				this.loadData(res);
				break;
			case 'deletePanierItem' : 
				this.loadData(res);
				break;
			case 'getAllInfos' : 
				this.loadData(res);
				break;
			default : fn.debug("action non gérée :"+action);
		}
		this.updateAll();
	},
	
	loadData : function(raw) { //console.log('raw:',raw);
	
		if (!raw) return false;
		
		//load users data
		if (raw.paniers){
			for(var k in raw.paniers) {
				var panier = raw.paniers[k];
				if (!this.current_panier) this.current_panier = k; // by default: the current panier is the first one send
				if (!this.paniers[k]) {
					this.paniers[k] = panier;
					this.paniers[k].to_update = true;
				}
				else {
					// update panier infos
					for(var l in panier) {
						if (l == 'items') continue;
						this.paniers[k][l] = panier[l];
					}
					// update panier items
					if (!this.paniers[k].items) this.paniers[k].items = {};
					if (panier.items) {
						for(var l in panier.items) {
							if (!this.paniers[k].items[l]) {
								this.paniers[k].items[l] = panier.items[l];
							}
							else {
								for(var m in panier.items[l]) {
									this.paniers[k].items[l][m] = panier.items[l][m];
								}
							}
							this.paniers[k].items[l].to_update = true;
						}
						this.paniers[k].to_update = true;
					}	
				}
			}
		}
		
	},

	
	createRow : function(id) {
	
		var t = this;
		
	
		// create dom
		var row = {
			li : $('<li />'),
			text_input : $('<input class="span2" size="16" type="text">'),
			check_button : $('<a href="javascript:void(0);" class="toggle"></a>'),
		};
		
		if (id) row.id = id;
		else	row.check_button.css('opacity','0.3');
		
		// add dom to row div
		row.li.append(
			row.check_button, //check
			row.text_input // text
		);

		 // bind events
		if (id) {
			row.check_button.click(function(e){
				t.onCheckToggle(e,row);
			});
		}
		row.text_input.keyup(function(e){ 
			t.onTextChange(e,row);
		}).focus(function(e) { var a=this; setTimeout(function() { a.select(); },100); });
		
		row.text_input.blur(function(e) { t.onTextBlur(e,row); });
		
		return row;
	},

	
	updateList : function(pid) {
		var t=this;
		if (!pid) return false;
		var p = this.paniers[pid];
		if (!p || !p.items) return false;

		for(var k in p.items) {
			var d = p.items[k];
			if (!d) continue;
			if (!d.row) {
				d.row = this.createRow(d.id);
				t.list.append(d.row.li);
			}
			this.updateRow(d.row,d);
		}
		
	},
	
	updateRow : function(row,data) {
		var t=this;
		if (!row || !data) return false;
		// store data in row

		if (data.checked == 1) row.li.addClass('done');
		else row.li.removeClass('done');
		row.text_input.val(data.title);
	},

	updateAll : function() {
		var t=this;
		if (!t.handler) return false;
		
		// update total
		if (t.current_panier && t.paniers[t.current_panier]){
			var p = t.paniers[t.current_panier];
			if (p.to_update) {
				p.to_update = false;
				t.updateList(t.current_panier);
			}
		}
		
	},
	
	onCheckToggle : function(e,r) {
		if (!r) return false;
		if (r.li.hasClass('done')) { // uncheck
			r.li.removeClass('done');
		}	
		else { //check
			r.li.addClass('done');
		}
		this.saveRow(r);
	},
	
	onTextChange : function(e,r) {
		var t=this;
		if(e.keyCode == 13) {
			this.saveRow(r);
		}
	},
	onTextBlur : function(e,r) {
		this.saveRow(r);
	},
	
	
	onRowEdit : function(r) {
		var t=this;		
	},
	
	saveRow : function(r) {
		var t=this;
		if (!r) return false;
		// create new row
		if (!r.id) {
			if (r.text_input.val() == '') return false;
			
			//send data
			com.send("addPanierItem",{
				checked : false,
				title : r.text_input.val(),
				panier_id : t.current_panier
			});
			
			//clean row
			r.text_input.val('');
		}
		// update row
		else if (t.current_panier && t.paniers[t.current_panier]) { // panier exists
			var p = t.paniers[t.current_panier];
			if (p && p.items && p.items[r.id]) { // row exists
				var it = p.items[r.id];
				
				if (r.text_input.val() == '') { //if empty => remove the row
					
					com.send('deletePanierItem',{id:r.id});
					r.li.remove();
					delete p.items[r.id];
								
				} else {
							
					
					var edit_data = {};
					if (r.li.hasClass('done') && it.checked != 1) {
						edit_data['checked'] = 1;
					}
					else if (!r.li.hasClass('done') && it.checked == 1) {
						edit_data['checked'] = 0;
					}
					if (r.text_input.val() != it.title) {
						edit_data['title'] = r.text_input.val();
					}
					if (fn.size(edit_data) > 0) {
						com.send('editPanierItem',fn.merge({
							id : r.id
						},edit_data));
					}
				}
			}
		}
	}
	
};