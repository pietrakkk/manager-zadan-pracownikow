$( document ).ready(function() {

  var loadTaskList = function() {
        $.get( "/tasks_for_admin", function( data ) {
          $( ".content" ).html( data );
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
         loadProjectList();
      });
   });
  
   var loadProjectList = function() {
      $.getJSON( "/projects", function( data ) {
            for(var i = 0; i < data.length ; i++){
              $(".project_select").append("<option value=\'"+data[i].id_project+"\'>"+data[i].name+"</option>");
            }
          });
   }
});