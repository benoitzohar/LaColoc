<?

/**
 * 	This is the configuration file for your App.
 *	It's needed by Gestio- to know that your App is installable.
 *	[Please check http://lacoloc.fr/about/ for any informations.]
 *
 **/
 
 
/*
 *	Here comes the name of your brand new App
 *	It must be the name of the directory and this file.
 *	NO spaces, underscores, or any special chars,
 *	ONLY alphanumeric chars, in lowercase please ;)
 **/ 
 
$app_name = 'depenses';

/*
 *	The title of your app as it will be shown for every reference
 *	at your App. 
 *		[Please make sure that this file is encoded in UTF-8 if you 
 *		 use special characters !]
 **/
$gestio_module[$app_name]['title'] = 'Dépenses';


/*
 *	The version is the actual version of your App.
 *	You will have to manually change it in order to
 *	allow Gestio- to update the installed module
 *
 *	[Please note that you will NEED a version like *.* with only
 *	 numerical characters, and your very first version NEEDS to be 1.0,
 *   otherwise your App won't update properly ... ]
 **/
$gestio_module[$app_name]['version'] = '1.0';



/*
 *	Last edit represent the time of the last modification of 
 *	your App. This is optionnal but it's always good to keep track
 *	of these kind of things ...
 *		[Please use a DD-MM-YYYY date format !]
 *
 **/
$gestio_module[$app_name]['last_edit'] = '03-04-2012';


/*
 *	The logo should be the path to your logo image
 *	(starting from this directory, for example if you
 *	put your logo in [your_app]/images/logo.png, this
 *	variable should have as a value : 'images/logo.png')
 *
 *	This is optionnal, Gestio- will try to find a logo by
 *	default in 'img/logo.png'
 *
 **/
$gestio_module[$app_name]['logo'] = 'img/logo.png';


/*
 *	'tables' is an array containing the name of all the tables you 
 *	create and use with your App. It's NOT optionnal if you use the
 *	database (and therefore if you have at least one file like 
 *	[your_app]/setup/tables-*.*.sql
 **/

$gestio_module[$app_name]['tables'] = array('gestio_depenses');


/**
 *	The pages below are used to tell Gestio- when and what you want to show.
 *	All the pages are optionnal, however you might want to set at least a 
 * 	'main' page otherwise your app won't show anything...
 *
 *	- setup : Page that is shown just after the admin clicks on "INSTALL"
 *				[Please be aware that the tables-*.*.sql is executed before 
 *				this page so you can use 'setup' to write values in your
 *				database table(s)]
 * 
 *				
 *	- admin : Page that is shown when the admin clicks on your app's name  
 *			  in "installed modules" in the admin panel
 * 
 *	- main : This is the main page. it will be used when any user clicks
 *			 on the left menu link.
 *
 */ 
 
$gestio_module[$app_name]['pages']['setup'] = 'setup.php';
$gestio_module[$app_name]['pages']['admin'] = 'admin.php';
$gestio_module[$app_name]['pages']['main'] 	= 'main.php';


?>