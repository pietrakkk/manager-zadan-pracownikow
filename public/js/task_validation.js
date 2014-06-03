$( document ).ready(function() {
	$('#submit_task').click(function(event) {
     		$('.error').empty();
     		var isError = false,
     			description = $('#description').val();
     		
     
     	if(description === ''){
     		$('.error').append("Opis nie może być pusty");
     		isError = true;
     	}
     	if(isError){
    		event.preventDefault();
     	}
     });


      var loadEmployeesList = function(selectedProject) {
          var ids = [];
               $.ajax({
               type: "POST",
               url: "/employee_by_id_project",
               dataType: "json",
               contentType: "application/json",
               data: JSON.stringify({id_project: selectedProject}),
               async:false, 
               success: function (data) {
                  for(var i = 0 ; i < data.length ; i++){
                    ids[i] = data[i].id_employee;
                  }
               }
          });
          for(var i = 0 ; i < ids.length ; i++){
               $.ajax({
               type: "POST",
               url: "/employee_by_id",
               dataType: "json",
               contentType: "application/json",
               data: JSON.stringify({id_employee: ids[i]}),
               async:false, 
               success: function (employee) {
                     $(".reciever_select").append("<option value=\'"+employee.id_employee+"\'>"+employee.name+" "+employee.surname+"</option>");
               }
          });
          } 
   }
      $(".project_select").change(function() {
          var selectedProject = $(this).val();
           if(selectedProject === '-1'){
               $(".reciever_select").empty();
               $(".reciever_select").append("<option value=\"-1\">---wybierz pracownika---</option>");
           }else{
               $(".reciever_select").empty();
               loadEmployeesList(selectedProject);
           }
      });
});