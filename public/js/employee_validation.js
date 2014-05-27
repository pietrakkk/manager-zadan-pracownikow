$( document ).ready(function() {

	
	$('#register_employee').click(function(event) {
     
     	$('.error').empty();

      var name = $("#name").val(),
          surname = $("#surname").val().trim(),
          username = $("#username").val(),
          password = $("#password").val();
          confirm = $("#confirm_password").val();

          if(name.length === 0 || surname.length === 0 || username.length === 0 || 
          	password.length === 0 || confirm.length === 0){
            	$(".new_employee p").html("Zostawiłeś puste pola!");
            	event.preventDefault();
          }else{
          	validateData(event,[name,surname,username,password,confirm]);
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
		if(!checkUsername(data[2])){
			isError = true;
			$("#username_error").html("Podany login istnieje w bazie!");
		}
		if(!checkPassword(data[3],data[4])){
			isError = true;
			$("#confirm_password_error").html("Hasła nie są takie same!");
		}
		if(isError){
			event.preventDefault();
		}else{
			alert("Pomyślnie dodano pracownika!");
		}
	 };

	 var checkPassword = function (pass1, pass2) {
	 	if(pass1 !== pass2){ return false;}
	 	else return true;
	 };

	 var checkUsername = function(username) {
	 	var isExists = false;

	 	//TODO: dodać ajaxowe sprawdzanie czy istnieje w bazie
	 	return true;
	 }
});




