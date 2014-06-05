/*jshint globalstrict: true, devel: true, browser: true, jquery: true */ 
$(function(){
    "use strict";
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
  };
  loadUsername();

  //alert(id_user);
  var socket = io.connect('http://' + location.host,{query: "id_user="+id_user});

        $("#submit_task").click(function(event){                                             
          var selectedProject = $("#project_select option:selected").val(),
               selectedEmployee = $("#reciever_select option:selected").val(),
               desc = $('#description').val(),
               isError = false;
        
          $('.error').empty();

           if(selectedEmployee === '-1'){
               isError = true;
               $('.error').append("Wybierz pracownika<br/>");
          }
     	if(desc === ''){
     		isError = true;
              $('.error').append("Opis nie może być pusty<br/>");
     	}
          if(selectedProject === '-1'){
               isError = true;
              $('.error').append("Wybierz projekt<br/>");
          }
          
     	if(isError){
    		    event.preventDefault();
     	}else{

                event.preventDefault();
                socket.emit('addTask', {
                    id_project: selectedProject,
                    id_employee: selectedEmployee,
                    description: desc,
                    status: "W TOKU"
               });
               alert("Dodano zadanie!");
          }
     });

      var getEmployeeById = function(id) {
          $.ajax({
               type: "POST",
               url: "/employee_by_id",
               dataType: "json",
               contentType: "application/json",
               data: JSON.stringify({id_employee: id}),
               async:false, 
               success: function (employee) {
                     $(".reciever_select").append("<option value=\'"+employee.id_employee+"\'>"+employee.name+" "+employee.surname+"</option>");
               }
          });
      };



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
                    getEmployeeById(ids[i]);
                  }
               }
          });
   };
      $(".project_select").change(function() {
          var selectedProject = $(this).val();
           $(".reciever_select").empty();          
           if(selectedProject === '-1'){
           }else{
                $(".reciever_select").append("<option value=\"-1\">---wybierz pracownika---</option>");
               loadEmployeesList(selectedProject);
           }
      });
});