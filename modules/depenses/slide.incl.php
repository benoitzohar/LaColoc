<?	
	echo "<h3> $tab_nom_mois[$i] $annee</h3>";
	if ($sniveau=="avance") {
	$dep_login[$i] = new depenses;
	$dep_login[$i]->init($slog,$mois,$annee,$i,true);
	$dep_login[$i]->afficher();
	$somm_log[$i] = $dep_login[$i]->retournerSomme();
	
	$j = 1;}
	else $j=0;
	$rep = mysql_query("SELECT login,type FROM membres");
	while ( $sql = mysql_fetch_array($rep) ) {
		if ($sql[login] != $slog && $sql[type]=="avance") {
			$dep_autre[$i] = new depenses;
			$dep_autre[$i]->init($sql[login],$mois,$annee,$i,false);
			$dep_autre[$i]->afficher();
			$somm_autre[$i] = $dep_autre[$i]->retournerSomme();
			$log_autre[$i] = $dep_autre[$i]->retournerLogin();
			$j++;
		}
	}
	$maxisomme[$i] = $somm_log[$i] + $somm_autre[$i];
	$part_par_pers[$i] = $maxisomme[$i] / $j;
	$a_payer_log[$i] = -$somm_log[$i] + $part_par_pers[$i];
	$a_payer_autre[$i] = -$somm_autre[$i] + $part_par_pers[$i];
	
	echo "<table class=cadre align=center cellspacing=0 cellpadding=0 style='width:700px;float:left;'>
		<tr>
			<td class=cadretop>&nbsp;&nbsp;&nbsp;Dettes</td>
		</tr><tr>
			<td class=cadremiddle>
			<div class=dep_dettes> D&eacute;pense totale ce mois-ci pour la coloc : <b>$maxisomme[$i]</b> euros<br />
			ce qui repr&eacute;sente : <b>$part_par_pers[$i]</b> euros par coloc<br />
			 $slog doit payer <b>$a_payer_log[$i]</b> euros<br />
			 $log_autre[$i] doit payer <b>$a_payer_autre[$i]</b> euros</div><br />
		</td></tr></table>";
	
?>
