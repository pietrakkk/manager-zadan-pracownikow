$( document ).ready(function() {

		//pobiera liste pracowników do select boxa
		 $.getJSON( "/employees", function( data ) {
            for(var i = 0; i < data.length ; i++){
              $(".team").append("<option value=\'"+data[i].id_employee+"\'>"+data[i].name+" "+data[i].surname+"</option>");
            }
          });

		 $("#add_project").click(function(argument) {
		 	$(".error").empty();
		 	var projectName = $("#project_name").val(),
          		desc = $(".description").val();
          
          if(projectName.length === 0 || desc.length === 0){
            	$(".new_project p").html("Zostawiłeś puste pola!");
            	event.preventDefault();
          }else{
          	validateData(event,projectName);
          }
		 });

		    var validateData = function (event,data) {
	        var nameRegex = /^[A-Z][a-z]*/;
	    	var isError = false;
		 	
		 	if(!nameRegex.test(data)){
				$("#project_name_error").html("Nieprawidłowa nazwa!");
				isError = true;
		 	}

		 	$.ajax({
            	type: "POST",
            	url: "/check_projectname",
            	dataType: "json",
           		contentType: "application/json",
            	data: JSON.stringify({name: data}),
            	 async: false, 
            	success: function (response) {             
            	
            	if(response){
            		$('#project_name_error').html('Podana nazwa projektu istnieje w bazie!');
            		isError = true;
            	}
            }  
        	});
			if(isError){
				event.preventDefault();
			}

			};		 
});