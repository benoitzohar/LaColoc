<div id="feedback_button">
	<button class="btn pull-right" onclick="ui.openFeedbackModal();" style="text-transform:uppercase;margin-right:40px;">{$lang.Feedback}</button>
</div>

<div class="modal fade hide" id="feedback_modal">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">x</button>
		<h3>{$lang.Feedback}</h3>
	</div>
	<div class="modal-body" style="height:360px;">
		<div class="well">{$lang.Feedback_welcome_txt}</div>
		<div class="alert hide">{$lang.Feedback_error_txt}</div>
		<form class="form-horizontal">
			<div class="control-group">
				<label class="control-label">{$lang.Message}</label>
				<div class="controls"><textarea id="message_input" class="input-xlarge" rows="10">{$lang.Feedback_defaut_input}</textarea></div>
			</div>
			<input type="hidden" id="error_input" value=""/>
		</form>

	</div>
	<div class="modal-footer">
		<a href="#" class="btn" data-dismiss="modal">{$lang.Close}</a>
		<a href="#" class="btn btn-primary" onClick="ui.onFeedbackSend();">{$lang.Send}</a>
	</div>
</div>