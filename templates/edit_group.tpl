{if $standalone} {include file="$HEADER_TPL"} {/if}
<div id="edit_group">
	{if $message}<span>{$message}</span>{/if}
	<form class="form-horizontal">
		{if not $standalone || not $has_img}
		<div class="control-group">
			<input id="fileupload" type="file" name="files[]" data-url="/api/main/groupPicture" style="opacity:0;position:absolute;top:50px;right:150px;left:150px;height: 120px;cursor:pointer" multiple>
		</div>
		{/if}
		<div class="control-group">
			<label class="control-label">{$lang.Select_a_group}</label>
			<div class="controls"><input class="span2" type="text" id="profile_firstname" value="{$firstname}" /></div>
		</div>
		<div class="control-group">
			<label class="control-label">{$lang.Lastname}</label>
			<div class="controls"><input class="span2" type="text" id="profile_lastname" value="{$lastname}" /></div>
		</div>
		{if not $standalone || $email eq ''}
			<div class="control-group">
				<label class="control-label">{$lang.Email}</label>
				<div class="controls"><input class="span3" type="text" id="profile_email" value="{$email}" /></div>
			</div>
			
			<div class="control-group hide" id="profile_email_valid_wrap" >
				<label class="control-label">{$lang.Email} ({$lang.Validation})</label>
				<div class="controls"><input class="span3" type="email" id="profile_email_valid" value="" /></div>
			</div>
		{/if}
		
		{if $standalone}
			<button type="button" id="group_edit_continue_button" onclick="lc.group_profile.onNextButtonClick();" class="control-group btn btn-primary btn-large" style="display:block;" data-loading-text="{$lang.Continue}" disabled="disabled">{$lang.Continue}</button>
		{/if}
</div>

{if $standalone}
	
	{include file="$FOOTER_TPL"} 
	<script> 
		$(document).ready(function() {
			
		});
	</script>
{/if}