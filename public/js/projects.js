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
                $(".projects").append("<tr id=\'"+data[i].id_project+"\'><td class='nazwa'>"+data[i].name+"</td><td class='opcje'><button id=\"project_details\" project=\""+data[i].id_project+"\" class=\'button_details'\ type=\'button\'>Szczegóły</button><button id=\'delete_project\' class=\'button_delete' project=\""+data[i].id_project+"\" \ type=\'button\'>Usuń</button></td></tr>");
              }   
            }
          	
          }
      });	
	};
  loadProjects();

  $(".button_delete").click(function() {
      var id_project = $(this).attr("project");
      var conf = confirm("Czy na pewno chcesz usunąć projekt i wszystkie z nim związane zadania?");

      if(conf === true){
          $.ajax({
                  type: "POST",
                  url: "/delete_project",
                  dataType: "json",
                  contentType: "application/json",
                  data: JSON.stringify({id_project: id_project}),
                  success: function (response) {
                    alert("Usunięto!");
                    $("tr[id="+id_project+"]").remove();
                   }
              });
      }
  });


  $(".button_details").click(function() {
		var id = $(this).attr('project');
		$(".content").html("");
    $("table").attr("id_project",id);
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
              $("#add_to").append("<button id=\'add_employee\' onclick=\'addEmployee("+id+")\' empl=\'"+temp+"\' class=\'button_add'\  type=\'button\'>Dodaj pracownika</button>");

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
            				$("#team").append("<p id=\'"+temp+"\'>"+response.name+" "+response.surname+"<p/>");
            				$("#options").append("<button id=\'delete_employee\' empl=\'"+temp+"\' class=\'button_delete'\ onclick=\'clickBut("+temp+")\' type=\'button\'>Usuń</button><br/>");
                    
                  }  
        			});
            	}
            }  
        }); 
    });		
 });

 });
 function checkEmployee(id_employee) {
    
     var team = $("p[id=\'"+id_employee+"\']").text();
         
        if(team === ''){
          return false;
        }else{
          return true;
        }
   }

 function loadEmployeesList() {   
       $.getJSON( "/employees", function( data ) {
            for(var i = 0; i < data.length ; i++){
              if( !checkEmployee(data[i].id_employee) ){
                $("#employee_select").append("<option value=\'"+data[i].id_employee+"\'>"+data[i].name+" "+data[i].surname+"</option>");
              }

            }
          });
   }
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
                      $("p[id=\'"+id+"\']").remove();
                      $("button[empl=\'"+id+"\']").remove();
                       alert("Operacja zakończona pomyślnie!");
                       $("#add_to_project").css("display","none");
                       $("#add_to").css("display","block");
                       $("#confirm_button").remove();
                    }
                   }
              });
    }
  }

function  addEmployee(id_project) {
      loadEmployeesList();
      $("#add_to_project").css("display","block");
      $("#add_to").css("display","none");
      $("#add_to_project").append("<button id='confirm_button' onclick=\'confirmEmployee("+id_project+")\' class=\'button_add'\ >Zatwierdź</button>")
}
function confirmEmployee(id_project){
  var selectedEmployees = $("#employee_select option:selected");

  for(var i = 0 ; i < selectedEmployees.length ; i++){
        var employee = selectedEmployees[i].value;
        var text = selectedEmployees[i].text;

        $.ajax({
                  type: "POST",
                  url: "/add_to_project",
                  dataType: "json",
                  contentType: "application/json",
                  data: JSON.stringify({id_project: id_project ,id_employee: employee}),
                  success: function (response) {                  
                   }
              });
         $("#team").append("<p id=\'"+employee+"\'>"+text+"<p/>");
         $("#options").append("<button id=\'delete_employee\' empl=\'"+employee+"\' class=\'button_delete'\ onclick=\'clickBut("+employee+")\' type=\'button\'>Usuń</button><br/>");
         $("#employee_select option[value='"+employee+"']").remove();
  }

  $("#add_to_project").css("display","none");
  $("#add_to").css("display","block");
  $("#confirm_button").remove();
}