<div class="navbar navbar-fixed-top">
   <div class="navbar-inner">
	 <div class="container">
	   <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
		 <span class="icon-bar"></span>
		 <span class="icon-bar"></span>
		 <span class="icon-bar"></span>
	   </a>
	   <a class="brand" href="{$GESTIO_URL}">La Coloc'</a>

	   <!-- User menu -->
	   <div class="btn-group pull-right">
		<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
		  <i class="icon-user"></i> {$user_login}
		  <span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
			{foreach from=$submenu key=title item=v}
				<li><a href="{$v.link}">{$title}</a></li>
				{if $v.is_last != '1'}<li class="divider"></li>{/if}
			{/foreach}	
		</ul>
	  </div>
	  
	  <!-- group menu --> 
	  {if $group_name != ''}
	  <div class="btn-group pull-right">
		<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
		  <i class="icon-home"></i> {$group_name}
		  <span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
		</ul>
	  </div>
	  {/if}
	  
	  <!-- app menu -->
	   <div class="nav-collapse">
		 <ul class="nav">
		 	{foreach from=$menu key=title item=v}
			<li {if $v.is_active == '1'}class="active"{/if}><a href="{$v.link}">{if $v.image != ''}<i class="{$v.image} icon-white"></i>{/if}{$title}</a></li>
			{/foreach}	
		 </ul>
	   </div>
	   
	 </div>
   </div>
 </div>
