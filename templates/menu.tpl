<div class="navbar navbar-fixed-top">
   <div class="navbar-inner">
	 <div class="container">
	   <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
		 <span class="icon-bar"></span>
		 <span class="icon-bar"></span>
		 <span class="icon-bar"></span>
	   </a>
	   <a class="brand" href="{$LC_URL}">La Coloc'</a>

	   <!-- User menu -->
	   {if $subusermenu}
	   <div class="btn-group pull-right" style="margin-left: 15px;">
		<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
		  <i class="icon-user" data-pp_userid="{$user_id}" data-pp_size="24"></i> {$user_login}
		  <span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
			{foreach from=$subusermenu key=title item=v}
				<li><a href="{$v.link}">{$title}</a></li>
				{if $v.is_last != '1'}<li class="divider"></li>{/if}
			{/foreach}	
		</ul>
	  </div>
	  {/if}
	  
	  <!-- group menu --> 
	  {if $group_name != ''}
	  <div class="btn-group pull-right">
		<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
		  <i class="icon-home"></i> {$group_name}
		  <span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
			{foreach from=$subgroupmenu key=title item=v}
				<li>				
					{if $v.link}<a href="{$v.link}">{/if}
					{if $v.is_current}<i class="icon-ok"></i>{/if}
					{$title}
					{if $v.link}</a>{/if}
				</li>
			{/foreach}
		</ul>
	  </div>
	  {/if}
	  
	  <!-- app menu -->
	   <div class="nav-collapse">
		 <ul class="nav">
		 	{foreach from=$menu key=title item=v}
			<li {if $v.is_active == '1'}class="active"{/if}><a href="{$v.link}">{if $v.image != ''}<i class="{$v.image} "></i>{/if}{$title}</a></li>
			{/foreach}	
		 </ul>
	   </div>
	   
	 </div>
   </div>
 </div>

<div class="modal fade hide" id="edit_user_modal">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">x</button>
		<h3>{$lang.Profile}</h3>
	</div>
	<div class="modal-body" style="height:360px;"></div>
	<div class="modal-footer">
		<a href="#" class="btn" data-dismiss="modal">{$lang.Close}</a>
	</div>
</div>