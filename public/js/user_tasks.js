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

  //alert(id_user);
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
                $('.tasks').append("<tr id=\""+data[i].id_task+"\"><td class='id_task'>"+data[i].id_task+"</td><td class='opis'>"+data[i].description+"</td><td class='projekt'>"+data[i].name+"<td class='opcje'><button id=\"confirm_task\" task=\""+data[i].id_task+"\" class=\'button_edit'\ type=\'button\'>Zatwierdź</button></td><td class='status'>"+data[i].status+"</td></tr>");
             }
            }
          }
      });	 
	};
	loadTasksList();

	socket.on("task",function(data) {
     $.ajax({
               type: "POST",
               url: "/project_name",
               dataType: "json",
               contentType: "application/json",
               data: JSON.stringify({id_project: data.id_project}),
               async:false, 
               success: function (project_name) {

                   $('.tasks').append("<tr id=\""+data.id_task+"\" class='"+data.id_task+"''><td class='id_task'>"+data.id_task+"</td><td class='opis'>"+data.description+"</td><td class='projekt'>"+project_name.name+"<td class='opcje'><button id=\"confirm_task\" task=\""+data.id_task+"\" class=\'button_edit'\ type=\'button\'>Zatwierdź</button></td><td class='status'>"+data.status+"</td></tr>");
               }
          });
     sortTable();
	});

  socket.on("end_task_to_employee",function(id_task) {
    var status = $("tr[id="+id_task+"]").children("td[class='status']");
        status[0].innerHTML = 'ZAMKNIĘTE';
        $("tr[class='"+id_task+"'").remove();
  })



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
        

        if( status[0].innerHTML !== 'ZAMKNIĘTE' && status[0].innerHTML !== 'ZAMKNI?TE'){
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
    }
});