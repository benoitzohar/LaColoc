<?

class depenses {
	
	var $login;
	var $owner;
	var $mois;
	var $annee;
	var $slide;
	var $somme;
	
	function init($login,$mois,$annee,$slide,$owner) {
		$this->login = $login;
		$this->owner = $owner;
		$this->mois = $mois;
		$this->annee = $annee;
		$this->slide = $slide;
		$this->somme = 0;
	}
	function basicInit($login,$owner){
		$this->login = $login;
		$this->owner = $owner;
	}
	function add($cout,$comm) {
		$owner = $this->owner;
		if ($owner) {
			$date = date("Y/m/d H:i:s");
			$cout = str_replace(',','.',$cout);
			mysql_query("INSERT INTO depenses VALUES ('','$this->login','$cout','$comm','$date')");
		}
		else echo "erreur : vous n'avez pas les droits !";
	}
	function edit($id,$cout,$comm) {
		$owner = $this->owner;
		if ($owner) {
			$date = date("Y/m/d H:i:s");
			$cout = str_replace(',','.',$cout);
			mysql_query("UPDATE depenses SET cout = '$cout' , comm = '$comm', date = '$date' WHERE id = $id LIMIT 1");
		}
		else echo "erreur : vous n'avez pas les droits !";
	}
	function delete($id) {
		$owner = $this->owner;
		if ($owner) {
			mysql_query("DELETE FROM depenses WHERE id = '$id' LIMIT 1");
		}
		else echo "erreur : vous n'avez pas les droits !";
	}
	function retournerSomme() {	return $this->somme;}
	function retournerLogin() { return $this->login;}
	function afficher() {
		$owner = $this->owner;
		$slide = $this->slide;
		$currentmois = date("m");
		$currentannee = date("Y");
		echo "<table class=cadre align=center cellspacing=0 cellpadding=0 style='width:370px;margin:10 10 10 10;float:left;'>
				<tr>
					<td class=cadretop>&nbsp;&nbsp;&nbsp;D&eacute;penses de $this->login</td>
				</tr><tr>
					<td class=cadremiddle>";
		if ($owner && $this->mois == $currentmois && $this->annee == $currentannee) {
			echo "<table border=0>";
			$rep = mysql_query("SELECT * FROM depenses WHERE login = '$this->login' AND EXTRACT(MONTH FROM date) = $this->mois");
			while($paye = mysql_fetch_array($rep)) {
				$this->somme += $paye[cout];
				$ladate = explode(" ",$paye[date]);
				$titedate = $ladate[0];
				echo "<tr><form action='?module=depenses&slide=$slide' method='post' id='form$paye[id]'><input type=hidden name='id' value='$paye[id]'><td>$titedate</td>";
				echo "<td><input type=text class=input id='cout' name='cout' value='$paye[cout]' size='5'></td>";
				echo "<td><input type=text class=input id='comm' name='comm' value='$paye[comm]' size='15'></td>";
				echo "<td><a href=# onclick='document.getElementById(\"form$paye[id]\").submit();'><img src='img/edit.png' title='Modifier'></a><a href=# onclick=\"confirmation('Vous allez supprimer une depenses.Etes-vous sur ?','?module=depenses&action=deldep&id=$paye[id]&slide=$slide');\"><img src='img/del.png' title='supprimer'></a></form></tr>";
			}
			echo "</table><br />
			Ajouter une d&eacute;pense :<br />
			<form action='?module=depenses&slide=$slide' method='post'>
				Prix &nbsp;&nbsp;<input type=text class=input id=cout name=cout value='' size=6> euros<br />
				Informations <input type=text class=input id=comm name=comm value=''><br />
				<input type=hidden name='adder' value='ok'>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=submit value='Confirmer' class=bouton>
			</form>
			";
		}else {
			echo "<table border=0>";
			$rep = mysql_query("SELECT * FROM depenses WHERE login = '$this->login' AND EXTRACT(MONTH FROM date) = $this->mois");
			while($paye = mysql_fetch_array($rep)) {
				$this->somme += $paye[cout];
				$ladate = explode(" ",$paye[date]);
				$titedate = $ladate[0];
				echo "<tr><td>$titedate,</td>";
				echo "<td>$paye[cout] EUR,</td>";
				echo "<td>$paye[comm]</td></tr>";
			}
			echo "</table>";
		}
		echo "Total : $this->somme Euros</td>
			</tr></table>";
	}
}
?>
