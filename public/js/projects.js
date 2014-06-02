$( document ).ready(function() {
	
	var loadProjects = function() {
		$.ajax({
          url: "/projects",
          dataType: 'json',
          async: false, 
          success: function(data)
          {
            if(data){    

              $(".projects").find("tr:gt(0)").remove();

              for(var i = 0 ; i < data.length ; i++){
                $(".projects").append("<tr id=\'"+data[i].id_project+"\'><td class='nazwa'>"+data[i].name+"</td><td class='opcje'><button id=\"project_details\" project=\""+data[i].id_project+"\" class=\'button_details'\ type=\'button\'>Szczegóły</button><button id=\'delete_project\' class=\'button_delete'\ type=\'button\'>Usuń</button></td></tr>");
              }   
            }
          	
          }
      });	
	};

	loadProjects();

	$(".button_details").click(function() {
		var id = $(this).attr('project');
		$(".content").html("");
		 $.get( "/project_details", function( data ) {
         	$( ".content" ).html( data );
         	$.ajax({
            type: "POST",
            url: "/project_by_id",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({id_project: id}),
            async:false,
            success: function (response) {
            	$("#name").append(response.employee_data[0].name);
            	$("#desc").append(response.employee_data[0].description);
              $("#add_to_project").append("<button id=\'delete_employee\' empl=\'"+temp+"\' class=\'button_edit'\ onclick=\'clickBut("+temp+")\' type=\'button\'>Dodaj pracownika</button>");

            	for(var i = 0 ; i < response.employee_rows.length; i++){
            		var temp = response.employee_rows[i].id_employee;
            		$.ajax({
            			type: "POST",
            			url: "/employee_by_id",
            			dataType: "json",
            			contentType: "application/json",
            			data: JSON.stringify({id_employee: temp}),
                  async:false,
            			success: function (response) {
            				$("#team").append(response.name+" "+response.surname+"<br/>");
            				$("#options").append("<button id=\'delete_employee\' empl=\'"+temp+"\' class=\'button_delete'\ onclick=\'clickBut("+temp+")\' type=\'button\'>Usuń</button><br/>");
            
                  }  
        			});
            	}
            }  
        }); 
    });		

 });

 });
 function  clickBut(id) {
   var conf = confirm("Czy na pewno chcesz usunąć osobę z projektu?");
   
    if (conf === true) {
      $.ajax({
                  type: "POST",
                  url: "/delete_from_project",
                  dataType: "json",
                  contentType: "application/json",
                  data: JSON.stringify({id_employee: id}),
                  success: function (response) {
                    if(true){
                       alert("Operacja zakończona pomyślnie!");
                    }
                   }
              });
    }
  }

  