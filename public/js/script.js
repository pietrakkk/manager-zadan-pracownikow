$( document ).ready(function() {

  var loadTaskList = function() {
        $.get( "/page_tasks", function( data ) {
          $( ".content" ).html( data );
        });
       //testowe dodanie
       $.ajax({
          url: "/tasks",
          dataType: 'json',
          success: function(data)
          {
            if(data){    
              $(".tasks").find("tr:gt(0)").remove();
              $('.tasks').append("<tr><td class='id_task'></td><td class='opis'></td><td class='projekt'><td class='opcje'></td><td class='status'></td></tr>");
            }
          }
      });
     };

     loadTaskList();


 	$( "#send_login" ).click(function(event) {
  		
  		var username = $("#username").val();
  		var password = $("#password").val();

  		if(username.length === 0 || password.length === 0){
  			$(".error").html("Pola nie mogą być puste!");	
  			event.preventDefault();
  		}
	});

    $("#new_employee").click(function(event) {
      $.get( "/new_employee", function( data ) {
   //      $(".content").empty();
         $( ".content" ).html( data );
        
    });
  });

     $("#all_tasks").click(function(event) {
      $.get( "/page_tasks", function( data ) {
       //  $(".content").empty();
         $( ".content" ).html( data );
    });
      
       //testowe dodanie
       $.ajax({
          url: "/tasks",
          dataType: 'json',
          success: function(data)
          {
            if(data){    
              $(".tasks").find("tr:gt(0)").remove();
              $('.tasks').append("<tr><td class='id_task'></td><td class='opis'></td><td class='projekt'><td class='opcje'></td><td class='status'></td></tr>");
            }
          }
      });
  });

  $("#all_projects").click(function(event) {
      $.get( "/all_projects", function( data ) {
  
          $( ".content" ).empty();
         $( ".content" ).html( data );
        
        //reczne testowe dodanie

        //  $(".projects").find("tr:gt(0)").remove();
          $(".projects").append("<tr><td class='nazwa'></td><td class='opis'></td><td class='team'></td><td class='opcje'></td></tr>");
          $(".projects").append("<tr><td class='nazwa'></td><td class='opis'></td><td class='team'></td><td class='opcje'></td></tr>");
          $(".projects").append("<tr><td class='nazwa'></td><td class='opis'></td><td class='team'></td><td class='opcje'></td></tr>");
          $(".projects").append("<tr><td class='nazwa'></td><td class='opis'></td><td class='team'></td><td class='opcje'></td></tr>");
          $(".projects").append("<tr><td class='nazwa'></td><td class='opis'></td><td class='team'></td><td class='opcje'></td></tr>");
    });
  });
     $("#new_project").click(function(event) {
      $.get( "/new_project", function( data ) {
         $( ".content" ).html( data );
      });
   });
  $("#employees_list").click(function(event) {
      $.get( "/employees_list", function( data ) {
         $( ".content" ).html( data );
                  //testowe dodanie "na sztywno"
                  $(".projects").append("<tr><td class='name_surname'></td><td class='opcje'></td></tr>");
                  $(".projects").append("<tr><td class='name_surname'></td><td class='opcje'></td></tr>");
                  $(".projects").append("<tr><td class='name_surname'></td><td class='opcje'></td></tr>");
                  $(".projects").append("<tr><td class='name_surname'></td><td class='opcje'></td></tr>");
                  $(".projects").append("<tr><td class='name_surname'></td><td class='options'></td></tr>");
      });
   });
   $("#new_task").click(function(event) {
      $.get( "/new_task", function( data ) {
         $( ".content" ).html( data );
      });
   });

});