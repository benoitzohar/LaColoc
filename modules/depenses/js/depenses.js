apps.depenses = {
	
	data : {},
	handler : false,
		
	init: function (initial_data){
	
		this.handler = $('#depenses_wrapper');
		
		//load initial data
		if (initial_data){
			this.data = initial_data;
		}
		com.send('ping',{some:'data'});
		
		this.showLists();
	},
	
	/*
	 *	dialog()
	 *	param:	action	
	 *	param:	original_data
	 *	param:	res
	 */
	dialog : function(action,original_data,res) {
		switch (action) {
			case 'ping': console.log(action,original_data,res); break;
			default : fn.debug("action non gérée :"+action);
		}
	},

	
	createLists : function() {
		
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
	
	createRow : function() {
		var row = $('<div />').addClass('input-prepend input-append');
		var span_before = $('<span />').addClass('add-on').text('21/12/1098');
		var span_after = $('<span />').addClass('add-on').text('€');
		var button_after = $('<button />').addClass('btn').attr('type','button').html('<i class="icon-cog"></i>');
		var input = $('<input class="span2" size="16" type="text">');
        row.append(span_before,input,span_after,button_after);
        return row;
	},
	
	showLists : function() {
		if (!this.handler) return false;
	
		if (!this.table) this.createLists();
		
	},
	
	
};