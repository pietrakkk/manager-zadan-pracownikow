$( document ).ready(function() {

var id_user =""; 
	
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
  }
  loadUsername();


  var socket = io.connect('http://' + location.host,{query: "id_user="+id_user});


	var loadTasksList = function(argument) {
     $.ajax({
          url: "/admin_tasks",
          type: "POST",
          contentType: "application/json",
          dataType: 'json',
          async:false,
          success: function(data){
            if(data){    
            
             $(".tasks").find("tr:gt(0)").remove();

             for(var i = 0 ; i < data.length ; i++){
                $('.tasks').append("<tr id=\""+data[i].id_task+"\"><td class='id_task'>"+data[i].id_task+"</td><td class='opis'>"+data[i].description+"</td><td class='projekt'>"+data[i].name+"<td class='opcje'><button id=\""+data[i].id_task+"\" task=\""+data[i].id_task+"\" class=\'button_edit'\ type=\'button\'>Zamknij</button></td><td class='status'>"+data[i].status+"</td></tr>");                
             }
            }
          }
      });  
  };
  loadTasksList();

  $('.button_edit').click(function() {
    var id_task = $(this).attr("task");

     var status = $("tr[id="+id_task+"]").children("td[class='status']");
     updateTaskStatus(id_task,"ZAMKNIĘTE");
     socket.emit('end_task',id_task); 
     status[0].innerHTML = "ZAMKNIĘTE";
  });



  socket.on('confirm_task_to_admin',function(id_task) {
    var status = $("tr[id="+id_task+"]").children("td[class='status']");
    status[0].innerHTML = 'ZROBIONE';
  });

  var updateTaskStatus = function(id_task_to_update,status) {
      $.ajax({
               type: "POST",
               url: "/update_task_status",
               dataType: "json",
               contentType: "application/json",
               async:false,
               data: JSON.stringify({id_task: id_task_to_update, status: status}),
                 success: function (response) {
               }
          });
    }
  
});
