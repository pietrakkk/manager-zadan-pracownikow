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
});