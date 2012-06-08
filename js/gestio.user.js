$(document).ready(function() {

	var menu_saved_width = $("#menu-list").width();
	$("#logo").mouseenter(function(){
					$(this).switchClass('logo_inactive','logo_active',100);
				})
				.mouseleave(function() {
					if ($("#menu-list").is(':hidden')){
						$(this).switchClass('logo_active','logo_inactive',100);
					}
				})
				.click(function() {
					var menu = $("#menu-list");
					var menu_text = $("#menu-list > li > a > span");
					if (menu.is(':hidden')){
						if ($(this).hasClass('logo_inactive'))
							$(this).switchClass('logo_inactive','logo_active',100);
						var new_top_position = menu.height()+$(this).height()-30;
						menu.css('top',-menu.height()+'px')
							.css('width','50px')
							.show();
						menu_text.css('display','block').hide();
						menu.animate({
							top: '+='+new_top_position,
							width: menu_saved_width
						},250,function() {
								menu_text.show(80);
							});
					}
					else {
						menu_text.hide(100);
						menu.animate({
							top: '-'+menu.height(),
							width: '50'
						},300, function () {
								menu.width(menu_saved_width);
							});
						menu.hide(300);
						$(this).switchClass('logo_active','logo_inactive',300);
					}
				});	
		
});
