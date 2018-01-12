Template.bonus.rendered = function(){
	$('html,body').scrollTop(0);
	if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
	{
		document.getElementById("welcome-btn").innerHTML = "Accept HIT first!";
	}
};


Template.bonus.events={
	'click #next-btn': function(event, template){
		event.preventDefault();

		var today = new Date();
		time.push(today.toString());
		console.log(time);

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
				Router.go('/bonus2');
			}
		}
	}
};
