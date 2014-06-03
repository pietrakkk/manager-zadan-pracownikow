$( document ).ready(function() {

	  var loadTaskList = function() {
        $.get( "/tasks_for_user", function( data ) {
          $( ".content" ).html( data );
        });
     };

     loadTaskList();

	$('#your_tasks').click(function(argument) {
		//alert("g4g34");
	})

});