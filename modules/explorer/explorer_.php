<?php

$path = $_GET[path]; // avec path se terminant par : /
$alias = $_GET[alias]; // avec alias se terminant par : / 
$dir = $_GET[dir]; //dossier courant
$adr = "modules/explorer/explorer.php?path=$path&alias=$alias&dir=$dir";

if (isset($_GET[root]) && $_GET[root] == 1 ) $root=true;
else $root=false;

$list_ignore = array ('.','..');
$list_bureau = array ('doc','txt','pdf','xls');
$list_musique = array ('mp3','wma','ogg','aac');
$list_video = array ('mpeg','mpg','avi','divx','mkv');
$list_zip = array ('zip','rar','tar','gz','xtm','bzip');
$list_img = array ('jpeg','jpg','gif','png','bmp');

if (!$root) include "../../fonctions.php";

//variable id pour identifier le bloc à ouvrir pour chaque dossier
$id = 0;

echo "<div class=popperlink id=topdecklink></div>";

echo "<a href=# onclick=\"close_explore('$alias','$adr','$dir');\"><img src=img/explorer/folder.png> $dir</a><div class=explorer>";
$handle=opendir($path);

//Affichage des dossiers
while ($dir = readdir($handle)) {
	if (is_dir($path.$dir) && !in_array($dir,$list_ignore)) {  
		$newpath = $path.$dir."/";
		$newalias = $alias.$dir."/";
		$adresse = "modules/explorer/explorer.php?path=$newpath&alias=$newalias&dir=$dir";
		$dir = actionSurChaine($dir);
		echo "<div id=$newalias><a href=# onclick=\"ajax('$newalias','$adresse');\"><img src=img/explorer/folder.png> $dir</a><br /></div>";
		$id++;
	}
}
closedir($handle);

$handle=opendir($path);

//Affichages des fichiers
while ($file = readdir($handle)) {
	if (is_file($path.$file) && !in_array($file,$list_ignore)) {
	$filsize = size_readable(filesize($path.$file));
	$lien = "../".$alias.$file;
	$tabext = explode ('.',$file); // dans un tableau separes par les points
	$extension = $tabext[count($tabext)-1]; // recupere la derniere case : lextension
	echo "<a href='$lien' target=_blank onmouseout=\"killlink();\" ";
	if(in_array(strtolower($extension),$list_bureau)) echo "onmouseover=\"poplink('$filsize');\"><img src=img/explorer/bureau.png";
	else if(in_array(strtolower($extension),$list_musique)) echo "onmouseover=\"poplink('$filsize');\"><img src=img/explorer/musique.png";
	else if(in_array(strtolower($extension),$list_video)) echo "onmouseover=\"poplink('$filsize');\"><img src=img/explorer/video.png";
	else if(in_array(strtolower($extension),$list_zip)) echo "onmouseover=\"poplink('$filsize');\"><img src=img/explorer/zip.png";
	else if(in_array(strtolower($extension),$list_img)) echo "onmouseover=\"poplink('<img src=$lien width=200px>');\"><img src=img/explorer/img.png";
	else echo "onmouseover=\"poplink('$filsize');\"><img src=img/explorer/file.png";
	echo " > $file</a><br />";
	$id++;
	}
}
echo "</div>";

closedir($handle);

echo "<div class=basdroite><a href='#' onClick=\"window.open('sendfile.php?mode=popup&login=$dir&path=$path','_blank','toolbar=0, location=0, directories=0, status=0, scrollbars=0, resizable=0, copyhistory=0, menuBar=0, width=540, height=200, left=200, top=200');return(false)\">
<img src='img/sendfile2.png' class=reflect title='Envoyer un fichier'></a></div>";

if ($root) {
?>


<SCRIPT language="JavaScript">
skn = document.getElementById("topdecklink").style;
if(navigator.appName.substring(0,3) == "Net")
	document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = get_mouse;

function poplink(msg)
{
  	document.getElementById("topdecklink").innerHTML = msg;
	skn.visibility = "visible";

}

function get_mouse(e)
{
	var x = (navigator.appName.substring(0,3) == "Net") ? e.pageX : event.x+document.body.scrollLeft;
	var y = (navigator.appName.substring(0,3) == "Net") ? e.pageY : event.y+document.body.scrollTop;
	skn.left = x - 60;
	skn.top = y+20;
}

function killlink()
{
	document.getElementById("topdecklink").innerHTML = "";
	skn.visibility = "hidden";
}

</SCRIPT>
<? } ?>