{include file="$GESTIO_HEADER_TPL"}

<div id="dep_wrapper"></div>

<div id="dep_buttonbar">
	<button id="dep_refresh" class="btn btn-inverse" type="button" onclick="apps.depenses.refreshAll();"><i class="icon-refresh icon-white"></i></button>
	<button id="dep_add_button" class="btn btn-large btn-primary" type="button" onclick="apps.depenses.openAddForm();">{$lang.Add_an_expense}</button>
</div>

<div class="modal fade hide" id="dep_add_form">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">×</button>
		<h3>{$lang.Add_an_expense}</h3>
	</div>
	<div class="modal-body">
		<form class="form-horizontal">
			<div class="control-group">
				<label class="control-label">{$lang.Title}</label>
				<div class="controls"><input class=".span3" type="text" id="add_form_cost" /></div>
			</div>
			
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn" data-dismiss="modal">{$lang.Cancel}</a>
		<a href="#" class="btn btn-primary" onclick="apps.depenses.onAddFormValid();" >{$lang.Add}</a>
	</div>
</div>

{include file="$GESTIO_FOOTER_TPL"}