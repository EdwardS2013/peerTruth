const TASK_MIN = 0;
const TASK_MAX = 2;

Template.intro.rendered = function(){
	if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
	{
		document.getElementById("welcome-btn").innerHTML = "Accept HIT first!";
	}
	document.getElementById("content").style.fontFamily = "Optima, Segoe, Candara, Calibri, Arial, sans-serif";
	$("p").css({
       fontSize: "110%"
    });
};


Template.intro.events={
	'click #welcome-btn': function(event, template){
		event.preventDefault();

		if (assignment_Id == "ASSIGNMENT_ID_NOT_AVAILABLE")
		{
			Router.go('/');
		}
		else
		{
			var today = new Date();
			Workers.insert({workerId: worker_Id,
											assignmentId: assignment_Id,
											hitId: hit_Id,
											group: urls,
											trainingCandyRounds: [],
											trainingImageRounds: [],
											dataCandyRound: [],
											dataImageRound: [],
											taskType: -1});
			var taskType = Math.floor(Math.random() * (TASK_MAX - TASK_MIN + 1) ) + TASK_MIN;
			var worker = Workers.findOne({"workerId": worker_Id});

			time.push(today.toString());
			console.log(time);
			Router.go('/bonus');

			if(taskType == 0) {
				Workers.update({_id: worker._id}, {$set: {"taskType": taskType}});
				Router.go('/bonus');
			} else if(taskType == 1) {
				Workers.update({_id: worker._id}, {$set: {"taskType": taskType}});
				Router.go('/bonus_control');
			} else {
				Workers.update({_id: worker._id}, {$set: {"taskType": taskType}});
				Router.go('/bonus_pts');
			}
		}
	}
};
