/*jshint globalstrict: true, devel: true, browser: true, jquery: true */ 
 "use strict";
$(function(){

  
 	$( "#send_login" ).click(function(event) {
  		
  		var username = $("#username").val();
  		var password = $("#password").val();

  		if(username.length === 0 || password.length === 0){
  			$(".error").html("Pola nie mogą być puste!");	
  			event.preventDefault();
  		}
	});
});
