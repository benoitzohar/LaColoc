<div id="top_bar"><span></span></div>


<ul id="menu-list" class="hidden">
	{foreach from=$menu key=title item=v}
	<li class="menu-item"><a href="{$v.link}"><img src="{$v.image}" /><span>{$title}</span></a></li>
	{/foreach}	
</ul>

<div id="logo" class="logo_inactive"></div>