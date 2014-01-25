/**
 *  @description LaColoc UI Core
 *  @author Benoit Zohar
 */

var ui = {

	pictures : 'profile_pictures/',
	available_thumbs : [''],
	
	init : function() {
	
		// disable drag n drop on the page
		$(document).bind('drop dragover', function (e) {  e.preventDefault(); });
	
	},
	
	getObject : function(id) {
		if (typeof(id) == 'string') return $('#'+id);
		return id;
	},
	
	
	/**
	 *	User
	 **/
	
	
	/**
	 *	getUserPicture()
	 *	@param user_id
	 *	@param size (available : 32, 54, 96 [default])
	 **/
	getUserPicture : function(user_id,size,css,as_html) {
		var up = $('<div />').addClass('pp');
		
		if (!size) size = 96;
		if (!css) css = {};
		
		// Source
		var src = com.url+'img/default_user_'+size+'.png'; // default image
		if (user_id && lc.users[user_id] && lc.users[user_id].picture) {
			if (/http/.test(lc.users[user_id].picture)) src = lc.users[user_id].picture;
			else src = com.url+ui.pictures+size+'/'+lc.users[user_id].picture;
		}
		
		// css
		var default_css = {
			//boxShadow : '0 0 0 6px #666',
			//position : 'relative',
			//display : 'inline-block',
			background : 'url('+src+') no-repeat center center',
			backgroundSize: size+'px auto',
			width: size+'px',
			height: size+'px',
			//overflow : 'hidden'
		};
		
		up.css(fn.merge(default_css,css));
		
		up.data('pp_userid',user_id);
		up.data('pp_size',size);
		up.data('pp_css',css);
		
		//show overlay
		up.html('<i />');
		
		if (as_html) return up.html();
		return up;
	},
	
	updateProfilPictures : function() {
		$('.pp').each(function(){
			$(this).replaceWith(ui.getUserPicture($(this).data('pp_userid'),$(this).data('pp_size'),$(this).data('pp_css')));
		})
	},
	
	initProfilPictures : function() {
		$('.icon-user').each(function(){
			var t = $(this);
			if (t.data('pp_userid')) {
				$(this).replaceWith(ui.getUserPicture($(this).data('pp_userid'),$(this).data('pp_size'),$(this).data('pp_css')));
			}
		});
	},
	
	
	/**
	 *	Forms
	 **/
	
	getControlGroupForInput : function(input_id) { 
		var cg = this.getObject(input_id).parents(".control-group");
		if (cg) return cg;
		return false;
	},
	cleanInputStyle : function(id) {
		var cg = this.getControlGroupForInput(id);
		if (cg) { 
			cg.removeClass('warning error success'); 
			return cg;
		}
		return false;
	},
	
	setError : function(id,id1,id2,id3,id4) {
		if (id1) this.setError(id1,id2,id3,id4);
		var cg = this.cleanInputStyle(id);
		if (cg) { cg.addClass('error'); }
	},
	
	setWarning : function(id,id1,id2,id3,id4) {
		if (id1) this.setWarning(id1,id2,id3,id4);
		var cg = this.cleanInputStyle(id);
		if (cg) { cg.addClass('warning'); }
	},
	
	setSuccess : function(id,id1,id2,id3,id4) {
		if (id1) this.setSuccess(id1,id2,id3,id4);
		var cg = this.cleanInputStyle(id);
		if (cg) { cg.addClass('success'); }
	},
	
	doInputTypeTimeout : function(id,reference_value,fn,valid) {
		var t=this;
		if (!id) return false;
		if (valid) {
			if (t.getObject(id).val() != reference_value) return false;
			// make sure we don't validated twice or more in a row
			if (this.last_validated_input_type_timeout_id == id && this.last_validated_input_type_timeout_val == reference_value) return false;
			this.last_validated_input_type_timeout_id = id;
			this.last_validated_input_type_timeout_val = reference_value;
			if (fn) fn();
		}
		else {
			setTimeout(function() {
				t.doInputTypeTimeout(id,reference_value,fn,true);
			},1200);
		}
	},
	
	/**
	 *	Data (in forms)
	 **/
	
	storeOriginalData : function(id,original_data) {
		this.getObject(id).data('original_data',original_data);
	},
	
	getOriginalData : function(id) {
		return this.getObject(id).data('original_data');
	},
	
	isOriginalData : function(id) {
		var od = this.getOriginalData(id);
		var ob = this.getObject(id);
		if (fn.exists(od) && ob && fn.exists(ob.val)) return od == ob.val();
		return true;
	},
	
	restoreOriginalData : function(id){
		var od = this.getOriginalData(id);
		var ob = this.getObject(id);
		if (od && ob && ob.val) ob.val(od);
	},
	

	/**
	 *	Modal
	 */ 
		
	modal : function(div,onHidden,onShown,remote_load_url,remote_load_data,onRemoteLoaded,onHide,onShow) {
		if (!div) return false;
		if (remote_load_url) {
			div.find('div.modal-body').load(remote_load_url,remote_load_data,onRemoteLoaded);
		}
		div.modal();
		if (onHidden) 	div.on('hidden',onHidden);
		if (onShown)	div.on('shown',onShown);
		if (onHide)		div.on('hide',onHide);
		if (onShow)		div.on('show',onShow);
		div.modal('show');
	},
	
	/**
	 *	Feedback
	 **/
	
	openFeedbackModal : function(error_str) {
	
		var span = $("#feedback_modal .well");
		var err_span = $('#feedback_modal .alert');
		var err_input = $('#feedback_modal #error_input');
	
		if (error_str) {
			span.addClass('hide');
			err_span.removeClass('hide');
			err_input.val(error_str);
		}
		else {
			span.removeClass('hide');
			err_span.addClass('hide');
			err_input.val('');
		}
	
		$('#feedback_modal').modal('show');	
	},
	
	onFeedbackSend : function() {
		var f = $('#feedback_modal form');
		
		var user = lc.getCurrentUser(true);
	
		com.send('sendFeedback',{
			title : 'Feedback from '+user.firstname+" "+user.lastname,
			message : $('#feedback_modal #message_input').val(),
			error : $('#feedback_modal #error_input').val()
		},'main');
		
		//close the modal
		$('#feedback_modal').modal('hide');
		
		// reinit fields
		$('#feedback_modal #message_input,#feedback_modal #error_input').val('');	
		
	},
	 
	
	/**
	 *	Alerts and visual informations
	 **/
	
	message : function(msg,type) {
		var div = $('<div />').addClass('lc-popup-alert alert fade in hide')
			.append('<a class="close" data-dismiss="alert" href="#">&times;</a>');
		switch (type) {
			case 'warning' : break;
			case 'error' : div.addClass('alert-error'); break;
			case 'success' : div.addClass('alert-success'); break;
			default : div.addClass('alert-info'); break;
		}
		div.append($('<span />').html(msg));
		$('body').append(div);div.removeClass('hide');
		return 'ok';
	},
	
	loading : function(show) {
		// show
		if (show === true) {
			//@TODO
		}
		// hide
		else {
			//@TODO
		}
	}
	

}
