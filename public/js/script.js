$( document ).ready(function() {
 	var isMenuEmpty = [true,true,true];

 	$( "#send_login" ).click(function(event) {
  		
  		var username = $("#username").val();
  		var password = $("#password").val();

  		if(username.length === 0 || password.length === 0){
  			$(".error").html("Pola nie mogą być puste!");	
  			event.preventDefault();
  		}
	});

	// $(".menu p").click(function(event) {
 //      var id = $(this).parent().attr("id");
 //      switch(id) {
 //        case "0":
 //            if(isMenuEmpty[id]){
 //              $("#0 ul").append("<li>Dodaj</li><li>Usuń</li><li>Pokaż wszystkie</li><li>Edytuj dane</li>");
 //              isMenuEmpty[id] = false;
 //            }else{
 //             $("#0 ul").empty();
 //             isMenuEmpty[id] = true;
 //            }
 //        break;
 //        case "1":
 //         if(isMenuEmpty[id]){
 //              $("#1 ul").append("<li>Dodaj</li><li>Usuń</li><li>Pokaż wszystkie</li><li>Edytuj dane</li>");
 //              isMenuEmpty[id] = false;
 //            }else{
 //            $("#1 ul").empty();
 //             isMenuEmpty[id] = true;
 //            }
 //        break;
 //        case "2":
 //         if(isMenuEmpty[id]){
 //              $("#2 ul").append("<li>Dodaj</li><li>Usuń</li><li>Pokaż wszystkie</li><li>Edytuj dane</li>");
 //              isMenuEmpty[id] = false;
 //            }else{
 //            $("#2 ul").empty();
 //             isMenuEmpty[id] = true;
 //            }
 //        break;
 //      }
      
     
 //  	});
});