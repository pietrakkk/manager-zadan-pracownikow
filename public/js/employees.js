/*jshint globalstrict: true, devel: true, browser: true, jquery: true */ 
$(function(){
    "use strict";


	var loadEmployeesList = function() {
		$.ajax({
         url: "/employees",
         dataType: 'json',
         async: false, 
         success: function(data){
            if(data){    
              $(".employees").find("tr:gt(0)").remove();

              for(var i = 0 ; i < data.length ; i++){
 				$(".employees").append("<tr id=\'"+data[i].id_employee+"\'><td class='name_surname'>"+data[i].name+" "+data[i].surname+"</td><td class='options'><button id=\'edit_employee\' employee=\""+data[i].id_employee+"\" class=\'button_edit\' type=\'button\'>Edytuj dane</button><button id=\'delete\' employee=\'"+data[i].id_employee+"\' class=\'button_delete\' type=\'button\'>Usuń</button></td></tr>");              }   
            }
          	
          }
      });	
	};
	loadEmployeesList();


	$('.button_delete').click(function() {
		 var id = $(this).attr("employee");
      var conf = confirm("Czy na pewno chcesz usunąć pracownika? Zadania dostaną status nieprzydzielonych!");

      if(conf === true){
          $.ajax({
                  type: "POST",
                  url: "/delete_employee",
                   dataType: "json",
            	   contentType: "application/json",
                  data: JSON.stringify({id_employee: id}),
                  success: function (response) {
                    if(response){
                    	alert("Usunięto!");
                    	$("tr[id="+id+"]").remove();
                    }else{
                    	alert("Nieoczekiwany błąd!");
                    }              		
                   }
              });
      }
	});

	$('.button_edit').click(function(event) {
		var id = $(this).attr("employee");
		$.get( "/edit_employee", function( data ) {
         	$( ".content" ).html( data );

         	$.ajax({
          type: "POST",
            url: "/employee_by_id",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({id_employee: id}),
            async: false, 
         success: function(data){
        	$("#name").attr('value',data.name);
         	$("#surname").attr('value',data.surname);
         	$("#username").attr("value",data.username);	
         	$("#id_employee").attr("value",data.id_employee);
          }
      });	
        });
        
	});
});