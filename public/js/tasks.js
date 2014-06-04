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
                $('.tasks').append("<tr id=\""+data[i].id_task+"\"><td class='id_task'>"+data[i].id_task+"</td><td class='opis'>"+data[i].description+"</td><td class='projekt'>"+data[i].name+"<td class='opcje'><button id=\"project_details\" class=\'button_edit'\ type=\'button\'>Zamknij</button><button id=\"project_details\" class=\'button_warning'\ type=\'button\'>Przeslij błędy</button><button id=\"project_details\" class=\'button_delete'\ type=\'button\'>Usuń</button></td><td class='status'>"+data[i].status+"</td></tr>");
             }
            }
          }
      });  
  };
  loadTasksList();


  socket.on('confirm_task_to_admin',function(id_task) {
    var status = $("tr[id="+id_task+"]").children("td[class='status']");
    status[0].innerHTML = 'ZROBIONE';
  });
});
