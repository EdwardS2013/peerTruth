Meteor.subscribe('workers');
Meteor.subscribe('candyTestData');

var candyData;
const ROUND_TOTAL = 5;

Template.training_candy_game.helpers({
	//not using reactivevar as template is recreated every time
	roundNum: function(){
		var tr = Workers.findOne({"workerId": worker_Id}).trainingCandyRounds;

		var roundNum = 1;
		if(tr.length != 0) {

			tr.forEach(function(round) {
				if(round.bonus != null) {
					roundNum += 1;
				}
			});

		}
		return roundNum;
	},
	roundTotal: function(){
		return ROUND_TOTAL;
	},
});

Template.training_candy_game.onCreated(function () {
	candyData = CandyTestData.find();
	this.taskNum = new ReactiveVar(Math.floor(Math.random()*candyData.count()));
});

Template.training_candy_game.rendered=function(){
	$('html,body').scrollTop(0);
	startTime = new Date();
};

Template.training_candy_game.events={
	'click #candy-btn': function(event, template){
		var candyButton = document.getElementById('candy-btn');
		candyButton.parentNode.removeChild(candyButton);
		var candyDiv =  document.getElementById('candyArea');

		var wrapHeader = document.createElement('H3');
		var gummyText = document.createTextNode('Your candy is: Gummy bear');
		var mmText = document.createTextNode('Your candy is: M&M');
		var candy;

		var task = candyData.fetch()[template.taskNum.get()];
		//p0 = 0 = mm, p1 = 1 = gummy
		if(task.reports[0] == 0) {
			//got mm
			candy = 0;
			wrapHeader.appendChild(mmText);
		} else {
			//got gm
			candy = 1;
			wrapHeader.appendChild(gummyText);
		}

		var worker = Workers.findOne({"workerId": worker_Id});
		var newTr = worker.trainingCandyRounds.slice();
		var newRound = {"taskNum": template.taskNum.get(), "candyType": candy, "candyClaim": null,
											"bonus": null, "altBonus": null, "errorRate": null};

		newTr.push(newRound);
		Workers.update({_id: worker._id}, {$set: {"trainingCandyRounds": newTr}});

		candyDiv.appendChild(wrapHeader);
		document.getElementById('welcome-btn').style.visibility = "visible";
	},
	'click #welcome-btn': function(event, template){
		event.preventDefault();

		endTime = new Date();
		var duration = (endTime - startTime) / 1000;

		var count = 0;
		var locationTemp = "NA";
		var location = locationTemp.replace(/\n/g, "; ");

		Router.go('training_candy_payment');
	}
};
