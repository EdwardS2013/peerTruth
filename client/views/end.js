Template.end.events={
	'click #end-btn': function(event, template){
		event.preventDefault();

		var today = new Date();
		time.push(today.toString());
		console.log(time);

		var enjoy = document.getElementById("enjoy").value;
		var clarity = document.getElementById("clarity").value;
		var strategy = document.getElementById("strategy").value;
		var comments = document.getElementById("comment").value;
		FinishedWorkers.insert({
														workerId: worker_Id,
														assignmentId: assignment_Id,
														hitId: hit_Id,
														enjoy: enjoy,
														clarity: clarity,
														strategy: strategy,
														comment: comments,
														time: time});
		var str= "https://www.mturk.com/mturk/externalSubmit?assignmentId="+assignment_Id.toString()+"&Finished=Submit";
		Meteor.setTimeout(function(){window.location.href = str;},1000);
	}
};
