$( document ).ready(function() {

	  var id_user = ""; 
	
	var loadUsername = function() {
     $.ajax({
          url: "/current_user",
          type: "POST",
          dataType: 'json',
          async:false,
          success: function(data){
           id_user = data.id_employee;
          }
    });
  };
  loadUsername();


	  var loadTaskList = function() {
        $.get( "/tasks_for_user", function( data ) {
          $( ".content" ).html( data );
        });
     };

     loadTaskList();

    


     var loadTasks = function(id_user) {
		 $.ajax({
          url: "/user_tasks",
           type: "POST",
          contentType: "application/json",
          data: JSON.stringify({id_employee: id_user}),
          dataType: 'json',
          async:false,
          success: function(data)
          {
            if(data){    
            
             $(".tasks").find("tr:gt(0)").remove();

             for(var i = 0 ; i < data.length ; i++){
                $('.tasks').append("<tr id=\""+data[i].id_task+"\"><td class='id_task'>"+data[i].id_task+"</td><td class='opis'>"+data[i].description+"</td><td class='projekt'>"+data[i].name+"<td class='opcje'><button id=\"confirm_task\" task=\""+data[i].id_task+"\" class=\'button_edit\' type=\'button\'>Zatwierdź</button></td><td class='status'>"+data[i].status+"</td></tr>");
             }
            }
          }
      });	 
	};
	

	 $("#your_tasks").click(function() {
     	  $.get( "/tasks_for_user", function( data ) {
          $( ".content" ).html( data );
        });	
     	 loadTasks(id_user);
     });
});