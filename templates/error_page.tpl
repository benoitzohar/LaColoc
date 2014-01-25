{if $standalone} {include file="$HEADER_TPL"} {/if}
<div id="error_div">
	{if $message}<span>{$message}</span>{/if}<br />
	{if $link}<a href="{$link}">{$link_text}</a>{/if}
</div>
{if $standalone}
	{include file="$FOOTER_TPL"} 
{/if}