<!-- closing contener div-->
</div>

{if !$no_footer}
{if $isAlpha} {include file="$FEEDBACK_TPL"} {/if}
 <footer><p>&copy; LaColoc.fr 2012</p></footer>
{/if}

<script type="text/javascript" src="{$LC_URL}js/core/lang.js.php?lang={$LC_LANG_LONG}"></script>
{$JS_FILES}
<script> lc.init('{$LC_URL}','{$LC_CURRENT_APP}','{$LC_INITIAL_DATA}'); </script>
<script type="text/javascript">
var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-33326287-1']); _gaq.push(['_trackPageview']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
</script>

</body>
</html>