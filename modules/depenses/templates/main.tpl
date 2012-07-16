{include file="$GESTIO_HEADER_TPL"}

<div id="dep_wrapper"></div>

<div id="dep_buttonbar">
	<button id="dep_refresh" class="btn btn-inverse" type="button" onclick="apps.depenses.refreshAll();"><i class="icon-refresh icon-white"></i></button>
	<button id="dep_add_button" class="btn btn-large btn-primary" type="button" onclick="apps.depenses.openAddForm();">Add dep</button>
</div>

<div class="modal fade hide" id="dep_add_form">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">×</button>
		<h3>Add dep</h3>
	</div>
	<div class="modal-body">
		<p>One fine body…</p>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn" data-dismiss="modal">Close</a>
		<a href="#" class="btn btn-primary">Save changes</a>
	</div>
</div>

{include file="$GESTIO_FOOTER_TPL"}