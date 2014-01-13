/**
 *  @description LaColoc Javascript Core  : Group Profil form
 *  @author Benoit Zohar
 */

lc.group_profile = {

	form : false,
	
	
	open : function() {
		var t=this;
		var div = $('#edit_user_modal');
		ui.modal(div,function(){
				// after the modal is hided
				div.find('div.modal-body').empty();
				
			},false,
			com.url+'/page/edit_user',false,function() {
				// after page is loaded
				t.form = div.find('form');
				t.initForm();
			});
	},

	
	initForm : function(form) {
		var t=this;
		if (!this.form) return false;
		
		var input = this.form.find('input');
		if (!input) return false;
		//store initial data
		input.each(function() {
			ui.storeOriginalData($(this),$(this).val());
		});
		input.keyup(function(e){
			t.onInputChange($(this).attr('id'),e);
		});	
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
		else { console.log('clean exit');
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
		if (res && res.current_user) {
			var cu = lc.getCurrentUser(true);
			for(var k in res.current_user) {
				cu[k] = res.current_user[k];
			}
		}
		if (orig_data  && orig_data.field) {
			
			if (orig_data.field == 'profile_password' || orig_data.field == 'profile_password_valid') {
				ui.setSuccess('profile_password');
				lc.profile.form.find('#profile_password_valid_wrap').addClass('hide');
			}
			else if (orig_data.field == 'profile_email' || orig_data.field == 'profile_email_valid') {
				ui.setSuccess('profile_email');
				lc.profile.form.find('#profile_email_valid_wrap').addClass('hide');
			}
			else 
				ui.setSuccess(orig_data.field);
		}	
	}
	

}