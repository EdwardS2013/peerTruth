Meteor.subscribe('workers');

var hidden;

Template.welcome.rendered = function(){
	if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
	{
		document.getElementById("welcome-btn").innerHTML = "Accept HIT first!";
	}
	document.getElementById("content").style.fontFamily = "Optima, Segoe, Candara, Calibri, Arial, sans-serif";
	$("p").css({
       fontSize: "110%"
    });
	document.getElementById('welcome-btn').style.visibility = "hidden";
	hidden = true;
};


Template.welcome.events={
	'click #consent-box': function(event, template){
		if(hidden){
			document.getElementById('welcome-btn').style.visibility = "visible";
			hidden = false;
		} else {
			document.getElementById('welcome-btn').style.visibility = "hidden";
			hidden = true;
		}
	},
	'click #welcome-btn': function(event, template){
		event.preventDefault();

		if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
		{
			Router.go('/');
		}
		else
		{
			var existedWorker = FinishedWorkers.find({"workerId": worker_Id});
			if (existedWorker.count()>0)
			{
				Router.go('/error');
			}
			else
			{
				var worker = Workers.findOne({"workerId": worker_Id});
				var taskType = worker.taskType;
				if(taskType == 0 || taskType == 2) {
					//either 1/prior or our mechanism
					Router.go('/training_candy_game');
				} else {
					//control
					Router.go('/real_candy_game');
				}
			}
		}
	}
};
