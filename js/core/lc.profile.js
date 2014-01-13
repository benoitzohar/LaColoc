/**
 *  @description LaColoc Javascript Core  : Profil form
 *  @author Benoit Zohar
 */

lc.profile = {
	
	div : false,
	form : false,
	
	
	open : function() {
		var t=this;
		t.div = $('#edit_user_modal');
		ui.modal(t.div,function(){
				// after the modal is hided
				t.div.find('div.modal-body').empty();
				
			},false,
			com.url+'page/edit_user',false,function() {
				t.initForm();
			});
	},

	
	initForm : function() {
		var t=this;
		
		// after page is loaded
		t.div = $('#edit_user');
		t.form = t.div.find('form');
	
		if (!t.form) return false;
		
		var input = t.form.find('input');
		if (!input) return false;
		//store initial data
		input.each(function() {
			ui.storeOriginalData($(this),$(this).val());
		});
		input.keyup(function(e){
			t.onInputChange($(this).attr('id'),e);
		});	
		
		t.initProfilPicture();
	},
	
	initProfilPicture : function() {
		
		$('#fileupload').fileupload({
	        dataType: 'json',
	        done: function (e, data) {
	        	
	        	if (!data || !data.result || !data.result.data || !data.result.data.result || !data.result.data.result.files || !data.result.data.result.files[0]) {
	        		var err = L('an_unknown_error_append');
	        		ui.message(err,'error');
	        	}
	        	else {
	        		
	        		var f = data.result.data.result.files[0];
	        		if (f.error) {
	        			ui.message(L(f.error),'error');
	        		}	        		
	        		else { //everything went as expected 
	        			lc.getCurrentUser(true).picture = f.raw_name;
	        			ui.updateProfilPictures();
	        		}
	        	}
	        }
	    });
	    
	   var q = ui.getUserPicture(lc.getCurrentUser(),96,{marginLeft:'auto',marginRight:'auto',display:'block'});
	   this.form.prepend(q);
	   return true;
	},
	
	
	
	onInputChange : function(id,evt) {
		var t=this;
		if (!id) return false;
		var new_val = ui.getObject(id).val();
		
		// email
		if (id == 'profile_email' || id == 'profile_email_valid') {
			var email = ui.getObject('profile_email');
			var email_valid = ui.getObject('profile_email_valid');
			// show the 2nd input
			this.form.find('#profile_email_valid_wrap').removeClass('hide');

			if (!fn.isValidEmail(email.val())) {
				ui.setError(email);
				return false;
			} else ui.setWarning(email);
			
			if (!fn.isValidEmail(email_valid.val())) {
				ui.setError(email_valid);
				return false;
			} else ui.setWarning(email_valid);
			
			if (email.val() != email_valid.val()) {
				ui.setWarning(email);
				ui.setWarning(email_valid);
				return false;
			}
			if (id == 'profile_email_valid') id="profile_email";
		}
		
		/// password
		if (id == 'profile_password' || id == 'profile_password_valid') {
			var passwd = ui.getObject('profile_password');
			var passwd_valid = ui.getObject('profile_password_valid');
			// show the 2nd input
			this.form.find('#profile_password_valid_wrap').removeClass('hide')

			if (passwd.val() != passwd_valid.val()) { 
				ui.setWarning(passwd);
				ui.setWarning(passwd_valid);
				return false;
			}
			if (id == 'profile_password_valid') id="profile_password";
		}
		
	
		if (!ui.isOriginalData(id)) ui.setWarning(id);
		else {
			ui.cleanInputStyle(id);
			return false;
		}

		ui.doInputTypeTimeout(id,new_val,function() {
			t.save(id,new_val);
		});
				
	
		
	},
	
	save : function(id,val) {
		com.send('updateProfil',{ field: id, value: val },'main');
	},
	
	onInputUpdated : function(res,orig_data) {
		var t=this;
		if (res && res.current_user) {
			var cu = lc.getCurrentUser(true);
			for(var k in res.current_user) {
				cu[k] = res.current_user[k];
			}
		}
		if (orig_data  && orig_data.field) {
			
			if (orig_data.field == 'profile_password' || orig_data.field == 'profile_password_valid') {
				ui.setSuccess('profile_password');
				t.form.find('#profile_password_valid_wrap').addClass('hide');
			}
			else if (orig_data.field == 'profile_email' || orig_data.field == 'profile_email_valid') {
				ui.setSuccess('profile_email');
				t.form.find('#profile_email_valid_wrap').addClass('hide');
			}
			else 
				ui.setSuccess(orig_data.field);
		}	
		
		if (t.onNextButtonClick(true)) $('#user_id_continue_button').button('reset');
	},
	
	onNextButtonClick : function(no_reload) {
		$('#user_id_continue_button').button('loading');
		var t=this;
		var errors = [];
		
		var firstname = $('#profile_firstname');
		var email = $('#profile_email');
		var password = $('#profile_password');
		
		if (firstname.length>0 && (firstname.val() == '' || firstname.parents('.warning .error').length > 0)) {
			errors.push(L('Please_fill_your_firstname'));	
		}
		
		if (email.length>0 && (email.val() == '' || email.parents('.warning .error').length > 0)) {
			errors.push(L('Please_fill_your_email'));
		}
		
		if (password.length>0 && (password.val() == '' || password.parents('.warning .error').length > 0)) {
			errors.push(L('Please_fill_your_password'));
		}
	
		if (errors.length > 0) {
			var err_str = L('One_or_more_error_happend')+' :<br /><br />';
			err_str += '- '+errors.join('<br /> - ');
		
			if (!no_reload) ui.message(err_str,'error');
			return false;	
		}
		
		if (!no_reload) window.location.reload();
		$('#user_id_continue_button').button('reset');
		return true;
	}
	

}