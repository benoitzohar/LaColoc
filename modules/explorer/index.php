<?php
if (isset($_GET[path]) && isset($_GET[alias]) ) {
	echo "<div style='text-align:left;margin-left:20px;'>";
	include "explorer.php";
	echo "</div>";
}	
else {
	echo "<div style='width:700px;margin-left:auto;margin-right:auto;'>";
	if ($sniveau == "visiteur") {
		$rep = mysql_query("SELECT * FROM membres WHERE login = '$slog' LIMIT 1");
		$sql = mysql_fetch_array($rep);
		if ($sql[dpublic] == "all") {
			$rep2 = mysql_query("SELECT * FROM membres WHERE type <> 'visiteur'");
			while ($sql2 = mysql_fetch_array($rep2)) {
				echo "	<div class=lien_avec_thumb>
					<a href='?module=explorer&path=../../../../..$sql2[dpublic]&alias=$sql2[apublic]&dir=$sql2[login]&root=1'>
					<img src='img/users/$sql2[login].png' class=thumb><br />
					$sql2[login]</a></div> ";
			}
		}
		else {
			$i=0;
			$tabuser = explode (';',$sql[dpublic]); // dans un tableau separes par les ;
			foreach ($tabuser as $user) {
				$i++;
				$rep2 = mysql_query("SELECT * FROM membres WHERE login = '$user' LIMIT 1");
				$sql2 = mysql_fetch_array($rep2);
				$adresse = "?module=explorer&path=../../../../..$sql2[dpublic]&alias=$sql2[apublic]&dir=$sql2[login]&root=1";
				echo "	<div class=lien_avec_thumb>
					<a href='$adresse'>
					<img src='img/users/$sql2[login].png' class=thumb><br />
					$sql2[login]</a></div>  ";
			}
			if ( $i == 1 ) echo "<script> window.location = '$adresse'</script>";
		}
	}
	else {
		$rep = mysql_query("SELECT * FROM membres WHERE type <> 'visiteur'");
		while ($sql = mysql_fetch_array($rep)) {
			if ($sql[login] != $slog) 
				echo "	<div class=lien_avec_thumb>
					<a href='?module=explorer&path=../../../../..$sql[dpublic]&alias=$sql[apublic]&dir=$sql[login]&root=1'>
					<img src='img/users/$sql[login].png' class=thumb><br />
					$sql[login]</a></div> ";
			else 
				echo "	<div class=lien_avec_thumb>
					<b>$sql[login]</b><br />
					<img src='img/users/$sql[login].png' class=thumb><br />
					<a href='?module=explorer&path=../../../../..$sql[dpublic]&alias=$sql[apublic]&dir=$sql[login]_public&root=1'>
					[Public]
					</a>
					- <a href='?module=explorer&path=../../../../..$sql[dprivate]&alias=$sql[aprivate]&dir=$sql[login]_prive&root=1'>
					[Priv&eacute;]
					</a>
					</div> ";
		}
	}
	echo "</div>";
}
?>
