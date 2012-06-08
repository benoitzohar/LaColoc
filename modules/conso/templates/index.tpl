<br /><br />
<div id="app_conso">
	
	<ul>
		<li><a href="#tab_conso">Repas</a></li>
		<li><a href="#tab_weight">Poids</a></li>
	</ul>
	
	<div id="tab_conso">
		<p>Bienvenue dans l'appli Conso, l'appli pour pas devenir (trop) gros :D</p>
		<br />
		<br />
		<form action="" method="post" id="conso_add_form">
			<table>
				<thead>
					<th>Quantit&eacute;</th>
					<th>Unit&eacute;</th>
					<th>Label</th>
					<th>Repas</th>
					<th>Date</th>
					<th>Couleur</th>
					<th></th>
				</thead>
				<tbody>
					<tr>
						<td><input type="texte" name="conso_quantity" size="3"/></td>
						<td><select name="conso_unit" disabled>
								<option value="nbr" selected>Nombre</option>
								<option value="mg">Milligramme(s)</option>
								<option value="g">Gramme(s)</option>
								<option value="kg">Kilo(s)</option>
							</select>
						</td>
						<td>
							<select name="conso_element">
								{foreach from=$elements key=v item=label}
								<option value="{$v}">{$label}</option>
								{/foreach}
							</select>
						</td>
						<td>
							<select name="conso_period">
								<option value="0">Hors repas</option>
								<option value="1">Petit d&eacute;jeuner</option>
								<option value="2">Midi</option>
								<option value="3">Go&ucirc;ter</option>
								<option value="4">Diner</option>
							</select>
						</td>
						<td>
							<input type="text" name="conso_date" class="datepicker" />
						</td>
						<td>
							<select type="text" name="conso_color">
								<option value="">---</option>
								<option value="#FF6969">Rouge</option>
								<option value="green">Vert</option>
							</select>
						</td>
						<td>
						<button onclick="$('#conso_add_form').submit();">Ajouter</button>
						</td>
					</tr>
				</tbody>
			</table>
			<br />
			
			
			
			<div style="margin-left:20px;padding:10px;border:1px solid gray;">
				
				Ajouter un nouveau label:&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" name="conso_new_label" size="30" />
				&nbsp;&nbsp;&nbsp;&nbsp;<button onclick="$('#conso_add_form').submit();">Ajouter</button>
			</div>
	
		</form>
		<br />
		
		<br />
		<br />
		
		Historique : <br />
		<hr />
		
		<table>
			<thead>
				<th>Quantit&eacute;</th>
				<th>Label</th>
				<th>Repas</th>
				<th>Date</th>
	
			</thead>
			<tbody>
				{foreach from=$elements_per_user key=v item=element}
					<tr>
						<td {$element.style}>{$element.quantity}</td>
						<td {$element.style}>{$element.label}</td>
						<td {$element.style}>{$element.period}</td>
						<td {$element.style}>{$element.date}</td>
					</tr>
				{/foreach}
				
			</tbody>
		</table>	
	</div>
	
	<div id="tab_weight">
		
		<p>Ici tu dois renseigner ton poids tous les jours :) pour avoir une magnifique courbe :D </p>
		<br /><br />
		<form action="" method="post" id="conso_weight_form">
			<table>
				<thead>
					<th colspan="2">Poids</th>
					<th>Date</th>
					<th></th>
				</thead>
				<tbody>
					<tr>
						<td><input type="texte" name="conso_weight" size="3"/></td>
						<td>Kg</td>
						<td><input type="text" name="conso_weight_date" class="datepicker" /></td>
						<td><button onclick="$('#conso_weight_form').submit();">Ajouter</button></td>
					</tr>
				</tbody>
			</table>
			<br />
			<br />
			
			Historique : <br />
			<hr />
			
			<img src="{$google_chart_src}" /><br />
			
			<table>
				<thead>
					<th>Poids</th>
					<th>Date</th>
				</thead>
				<tbody>
					{foreach from=$weights_per_user key=v item=element}
						<tr>
							<td>{$element.weight} Kg</td>
							<td>{$element.date}</td>
						</tr>
					{/foreach}
				</tbody>
			</table>	
		</form>
	</div>
	
</div>


<script>
	$('document').ready(function() {
		{literal}
		
		$("#app_conso").tabs();
		
		$('.datepicker').datepicker({'dateFormat' : 'dd/mm/yy' });
		var myDate = new Date();
		var myDay = myDate.getDate(); if (myDay < 10) myDay = '0'+myDay;
		var myMonth = (myDate.getMonth()+1); if (myMonth < 10) myMonth = '0'+myMonth;
    	var prettyDate = myDay + '/' + myMonth + '/' + myDate.getFullYear();
		$(".datepicker").val(prettyDate);
		
		{/literal}
	});
	
</script>