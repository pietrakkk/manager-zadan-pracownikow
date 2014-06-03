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
              $('.tasks').append("<tr><td class='id_task'></td><td class='opis'></td><td class='projekt'><td class='opcje'><a href=\'#\'><button id=\'edit\' class=\'button_accept'\ type=\'button\'>Zakończ</button></a><a href=\'#\'><button id=\'edit\' class=\'button_warning'\ type=\'button\'>Prześlij błędy</button></a><a href=\'#\'><button id=\'edit\' class=\'button_delete'\ type=\'button\'>Usuń</button></a></td><td class='status'></td></tr>");
            }
          }
      });
     };

     loadTaskList();

       $("#new_employee").click(function(event) {
      $.get( "/new_employee", function( data ) {
         $( ".content" ).html( data );    
    });
  });

  $("#all_tasks").click(function(event) {
    loadTaskList();
  });

  $("#all_projects").click(function(event) {
      $.get( "/all_projects", function( data ) {
         $( ".content" ).html( data );
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
      });
   });
   $("#new_task").click(function(event) {
      $.get( "/new_task", function( data ) {
         $( ".content" ).html( data );
         loadEmployeesList();
         loadProjectList();
      });


    });
   var loadEmployeesList = function() {
       $.getJSON( "/employees", function( data ) {
            for(var i = 0; i < data.length ; i++){
              $(".reciever_select").append("<option value=\'"+data[i].id_employee+"\'>"+data[i].name+" "+data[i].surname+"</option>");
            }
          });
   }

   var loadProjectList = function() {
      $.getJSON( "/projects", function( data ) {
            for(var i = 0; i < data.length ; i++){
              $(".project_select").append("<option value=\'"+data[i].id_project+"\'>"+data[i].name+"</option>");
            }
          });
   }
});