Template.candy_explanation.rendered = function(){
	$('html,body').scrollTop(0);
	if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
	{
		document.getElementById("welcome-btn").innerHTML = "Accept HIT first!";
	}
};


Template.candy_explanation.events={
	'click #welcome-btn': function(event, template){
		event.preventDefault();
		if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
		{
			Router.go('/game');
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
