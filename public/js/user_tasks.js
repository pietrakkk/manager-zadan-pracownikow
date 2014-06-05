/*jshint globalstrict: true, devel: true, browser: true, jquery: true */ 
$(function(){
    "use strict";

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

      var loadTaskListContent = function() {
        $.get( "/tasks_for_user", function( data ) {
          $( ".content" ).html( data );
        });
     };


  var socket = io.connect('http://' + location.host,{query: "id_user="+id_user});

	var loadTasksList = function(argument) {
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
	loadTasksList();

	socket.on("task",function(data) {
     loadTaskListContent();
	});

    socket.on("deleted_projects",function(data) {
     loadTaskListContent();
  });

  socket.on("end_task_to_employee",function(id_task) {
    var status = $("tr[id="+id_task+"]").children("td[class='status']");
        status[0].innerHTML = 'ZAMKNIĘTE';
  });


  var sortTable = function(){
          var table = $(".tasks");
          var table2 = $("table").find("tr").get();
     

            table2.sort(function (a, b) {
                var ap = parseInt(a.getAttribute('id')),
                    bp = parseInt(b.getAttribute('id'));
                
                if (ap > bp) {
                    return -1;
                }
                if (ap < bp) {
                    return 1;
                }
                if (ap === bp){
                  return 0;
                }
            });
            table.html('');
            table.append(table2);
      };

    $(".button_edit").click(function(){
        var id_task = $(this).attr("task");
        var status = $("tr[id="+id_task+"]").children("td[class='status']");
        

        if( status[0].innerHTML !== 'ZAMKNIĘTE'){
            updateTaskStatus(id_task,"ZROBIONE");
            socket.emit('confirm_task',id_task); 
            status[0].innerHTML = 'ZROBIONE';
        }
    });

    var updateTaskStatus = function(id_task_to_update,status) {
      $.ajax({
               type: "POST",
               url: "/update_task_status",
               dataType: "json",
               contentType: "application/json",
               data: JSON.stringify({id_task: id_task_to_update, status: status}),
                 success: function (response) {
               }
          });
    };
});