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
				var today = new Date();
				Workers.insert({workerId: worker_Id,
												assignmentId: assignment_Id,
												hitId: hit_Id,
												group: urls,
												time: today.toString(),
												trainingCandyRounds: [],
												trainingImageRounds: [],
												dataCandyRound: [],
												dataImageRound: []});
				if (bonusLevel == '0')
				{
					Router.go('/game');
				}
				else
				{
					if(Workers.find().count() % 2 == 1) {
						//1st, 3rd, 5th... workers go to tutorial phase
						Router.go('/bonus');
					} else {
						//even number workers go to control phase
						Router.go('/control_bonus');
					}
				}
			}
		}
	}
};
