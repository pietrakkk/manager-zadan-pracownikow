/*jshint globalstrict: true, devel: true, browser: true, jquery: true */ 
$(function(){
    "use strict";


	$('#confirm_edit_employee').click(function(event) {
     	$('.error').empty();
      var name = $("#name").val(),
          surname = $("#surname").val();

          if(name.length === 0 || surname.length === 0){
            	$(".new_employee p").html("Zostawiłeś puste pola!");
            	event.preventDefault();
          }else{
          	validateData(event,[name,surname]);
          }
   });

	 var validateData = function (event,data) {
		var nameSurnameRegex = /^[A-Z][a-z]*/;
		var isError = false;
		if(!nameSurnameRegex.test(data[0])){
			$("#name_error").html("Nieprawidłowe imię!");
			isError = true;
		}
		if(!nameSurnameRegex.test(data[1])){
			isError = true;
			$("#surname_error").html("Nieprawidłowe nazwisko!");	
		}
        if(isError){
			event.preventDefault();
		  }else{
				alert("Zmiany zostały zapisane!");
		 }
	 };
});




