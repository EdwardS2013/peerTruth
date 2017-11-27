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
				var worker = Workers.findOne({"workerId": worker_Id});
				if(Workers.find().count() % 3 == 1) {
					//1st, 4th, 7th... workers go to our mechanism
					Workers.update({_id: worker._id}, {$set: {"taskType": 0}});
					Router.go('/bonus');
				} else if(Workers.find().count() % 3 == 2) {
					//2nd, 5th, 8th.. workers go to control phase
					Workers.update({_id: worker._id}, {$set: {"taskType": 1}});
					Router.go('/bonus_control');
				} else {
					//3rd, 6th, 9th... workers go to PTS mechanism
					Workers.update({_id: worker._id}, {$set: {"taskType": 2}});
					Router.go('/bonus_pts');
				}
			}
		}
	}
};
