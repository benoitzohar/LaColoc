<!DOCTYPE html>
<html>
	<head>
		<title>{$title}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		{$GESTIO_JS_FILES}
		{$GESTIO_CSS_FILES}
		
		<script>
			var gestio;
			function initGestio() {
				gestio = new Gestio();
			}
		</script>
		
	</head>
	<body>