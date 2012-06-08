$(document).ready(function() {
	
	$("#ajax-loader").ajaxStart(function(){
		$(this).show();
	});
	$("#ajax-loader").ajaxStop(function(){
		$(this).hide();
	});
	$("#ajax-loader").ajaxError(function(){
		show_ajax_error("Unable to complete the request !");
	});
	
	
});

function show_ajax_error(error,duration){
	$("#ajax-error span").html(error);
	$("#ajax-error").show();
}

function show_ajax_complete(res,duration){
	$("#ajax-error span").html(res);
	$("#ajax-error").show();
}