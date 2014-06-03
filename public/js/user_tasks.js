$( document ).ready(function() {

	var socket = io.connect('http://' + location.host);

	var loadTasksList = function(argument) {
		 $.ajax({
          url: "/user_tasks",
          dataType: 'json',
          async:false,
          success: function(data)
          {
            if(data){    
             $(".tasks").find("tr:gt(0)").remove();
             $('.tasks').append("<tr><td class='id_task'></td><td class='opis'></td><td class='projekt'><td class='opcje'><button id=\"project_details\" class=\'button_edit'\ type=\'button\'>Zatwierdź</button><button id=\"project_details\" class=\'button_warning'\ type=\'button\'>Przeslij błędy</button><button id=\"project_details\" class=\'button_delete'\ type=\'button\'>Usuń</button></td><td class='status'></td></tr>");
            }
          }
      });
		 
	};
	loadTasksList();

	$(".button_edit").click(function (argument) {
		socket.emit("end_task","gargaerager");
	})

	socket.on("doratlo",function(argument) {
		             $('.tasks').append("<tr><td class='id_task'></td><td class='opis'></td><td class='projekt'><td class='opcje'><button id=\"project_details\" class=\'button_edit'\ type=\'button\'>Zatwierdź</button><button id=\"project_details\" class=\'button_warning'\ type=\'button\'>Przeslij błędy</button><button id=\"project_details\" class=\'button_delete'\ type=\'button\'>Usuń</button></td><td class='status'></td></tr>");

	});
});