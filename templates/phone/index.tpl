{include file="$GESTIO_HEADER_TPL"}


<!-- Start of first page -->
<div data-role="page" id="home">

	<div data-role="header">
		<h1>Gestio.</h1>
	</div><!-- /header -->

	<div data-role="content">
		<ul data-role="listview" data-theme="d" data-inset="true">
			<li data-role="list-divider">Menu</li>
			<li><a href="app_1.html">App 1</a></li>
			<li><a href="app_2.html">App 2</a></li>
			<li><a href="app_3.html">App 3</a></li>
		</ul>
		<ul data-role="listview" data-theme="d" data-inset="true">
			<li data-role="list-divider">Compte</li>
			<li><a href="#options">Options</a></li>
		</ul>
		</div><!-- /content -->

</div><!-- /page -->


<!-- Start of second page -->
<div data-role="page" id="options">

	<div data-role="header">
		<a href="#home" data-role="button" data-icon="arrow-l">Back</a><h1>Options</h1>
	</div><!-- /header -->

	<div data-role="content">	
		<div data-role="controlgroup" data-type="horizontal">
			<a href="?device=desktop" data-role="button">Desktop</a>
			<a href="?device=tablet" data-role="button">Tablet</a>
			<a href="?device=phone" data-role="button">Phone</a>
		</div>


	</div><!-- /content -->

	<div data-role="footer">
		<h4>gestio.</h4>
	</div><!-- /footer -->
</div><!-- /page -->

{include file="$GESTIO_FOOTER_TPL"}