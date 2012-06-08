{include file='admin/header.tpl'}
<center>
<h3>{$installed_modules_label}</h3>
{html_table table_attr='id="installed_modules_table"' loop=$installed_modules cols=$installed_modules_fields}
<br /><br />
<h3>{$available_modules_label}</h3>
{html_table table_attr='id="available_modules_table"' loop=$available_modules cols=$available_modules_fields}
</center>
{include file='admin/footer.tpl'}