{include file="$HEADER_TPL"}
<div class="container-fluid">
<div id="dep_menu" class="well left-menu">
	<ul class="nav nav-list">
	<li><button id="dep_add_button" class="btn btn-large btn-primary" type="button" onclick="apps.depenses.openAddForm();">{$lang.Add_an_expense}</button></li>
		<li class="nav-header">{$lang.Expenses}</li>
		<li class="active">
			<a href="#"><i class="icon-list"></i> {$lang.Current_expenses}</a>
		</li>
		<li class="nav-header">{$lang.Archives}</li>
		<li>
			<a href="#" style="cursor:not-allowed;">pas d'archive</a>
		</li>
		<li class="nav-header">{$lang.Export}</li>
		<li>
			<a href="#" style="cursor:not-allowed;"><i class="icon-print"></i> {$lang.Print}</a>
			<a href="#" style="cursor:not-allowed;"><i class="icon-share"></i> {$lang.Export_as_CSV}</a>
		</li>
		<li class="divider"></li>
		<li>
			<a href="#" style="cursor:not-allowed;"><i class="icon-cog"></i> {$lang.Settings}</a>
			<a href="#" style="cursor:not-allowed;"><i class="icon-question-sign"></i> {$lang.Help}</a>
		</li>

	</ul>
</div>

<div class="app-container app-with-left-menu">
	<div id="dep_wrapper"></div>
	
	<div id="dep_buttonbar">
		<button id="dep_refresh" class="btn btn-inverse" type="button" onclick="apps.depenses.refreshAll();"><i class="icon-refresh icon-white"></i></button>
		<button id="dep_archive" class="btn btn-inverse" type="button" onclick="apps.depenses.onArchiveButtonClick();">{$lang.Do_archive}</button>
		<div id="dep_total"></div>
		<div id="dep_owed"></div>
	</div>
</div>

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
				<div class="controls"><input class="span3" type="text" id="add_form_title" /></div>
			</div>
			<div class="control-group">
				<label class="control-label">{$lang.Date}</label>
				<div class="controls"><input class="span2" type="text" id="add_form_date" style="text-align:center;" value="{$current_day}"/></div>
			</div>
			<div class="control-group">
				<label class="control-label">{$lang.Value}</label>
				
				<div class="controls">
					<div class="input-append">
						<input class="span2" type="text" id="add_form_cost" style="text-align:right;" value=""/>
						<span class="add-on">{$devise}</span>
					</div>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn" data-dismiss="modal">{$lang.Cancel}</a>
		<a href="#" class="btn btn-primary" onclick="apps.depenses.onAddFormValid();" >{$lang.Add}</a>
	</div>
</div>

{include file="$FOOTER_TPL"}
