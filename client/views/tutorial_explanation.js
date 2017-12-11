Template.tutorial_explanation.rendered = function(){
	if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
	{
		document.getElementById("welcome-btn").innerHTML = "Accept HIT first!";
	}
	document.getElementById("content").style.fontFamily = "Optima, Segoe, Candara, Calibri, Arial, sans-serif";
	$("p").css({
       fontSize: "110%"
    });
};


Template.tutorial_explanation.events={
	'click #welcome-btn': function(event, template){
		event.preventDefault();

		if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
		{
			Router.go('/');
		}
		else
		{
			Router.go('candy_explanation');
		}
	}
};
