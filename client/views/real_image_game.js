Meteor.subscribe('workers');
Meteor.subscribe('realTasks');

var tasks;
const ROUND_TOTAL = 10;

function pressedAnswer() {
	var btns = document.getElementById('answerArea');
  while(btns.lastChild) {
    btns.removeChild(btns.lastChild);
  }

  if(Template.instance().roundNum.get() <= 9) {
    document.getElementById('welcome-btn').style.visibility = "visible";
  } else {
    document.getElementById('next-btn').style.visibility = "visible";
  }
}

function pressedNext() {
	var btns = document.getElementById('answerArea');
	while(btns.lastChild) {
    btns.removeChild(btns.lastChild);
  }

	var answerAreaLeft = document.createElement('div');
	answerAreaLeft.setAttribute('id', 'answerAreaLeft');
	var yesBtn = document.createElement('button');
	yesBtn.setAttribute('type', 'button');
	yesBtn.setAttribute('class', 'btn');
	yesBtn.setAttribute('id', 'submit-yes');
	yesBtn.innerHTML = 'Yes';
	answerAreaLeft.appendChild(yesBtn);

	var answerAreaRight = document.createElement('div');
	answerAreaRight.setAttribute('id', 'answerAreaRight');
	var noBtn = document.createElement('button');
	noBtn.setAttribute('type', 'button');
	noBtn.setAttribute('class', 'btn');
	noBtn.setAttribute('id', 'submit-no');
	noBtn.innerHTML = 'No';
	answerAreaRight.appendChild(noBtn);

	btns.appendChild(answerAreaLeft);
	btns.appendChild(answerAreaRight);

	document.getElementById('welcome-btn').style.visibility = "hidden";
}

function addAnswer(answer){
	var worker = Workers.findOne({"workerId": worker_Id});

	var task = tasks.fetch()[Template.instance().taskNum.get()];

	var newRound = {"pairNum": task.pairNum, "claim": answer};

	worker.dataImageRound.push(newRound);
	task.results.push(answer);
	Workers.update({_id: worker._id}, {$set: {"dataImageRound": worker.dataImageRound}});
	RealTasks.update({_id: task._id}, {$set: {"results": task.results}});
}

Template.real_image_game.created=function(){
	tasks = RealTasks.find();
	workerCount = Workers.find().count();

	this.roundNum = new ReactiveVar(1);
	this.taskNum = new ReactiveVar((10*Math.floor((workerCount-1)/3))%100);
};

Template.real_image_game.helpers({
	roundNum: function(){
		return Template.instance().roundNum.get();
	},
	roundTotal: function(){
		return ROUND_TOTAL;
	},
	taskImageLeft: function(){
		var task = tasks.fetch()[Template.instance().taskNum.get()];

		return '/images/pairs/'+task.pairNum+'/a.jpg';
	},
	taskImageRight: function(){
		var task = tasks.fetch()[Template.instance().taskNum.get()];

		return '/images/pairs/'+task.pairNum+'/b.jpg';
	}
});

Template.real_image_game.rendered=function(){
	$('html,body').scrollTop(0);
	startTime = new Date();
};

Template.real_image_game.events={
	'click #submit-yes': function(event, template){
		pressedAnswer();
		addAnswer(1);
	},
	'click #submit-no': function(event, template){
		pressedAnswer();
		addAnswer(0);
	},
	'click #welcome-btn': function(event, template){
		event.preventDefault();

		template.roundNum.set(template.roundNum.get()+1);
		template.taskNum.set(template.taskNum.get()+1);
		pressedNext();
	},
	'click #next-btn': function(event, template){
    event.preventDefault();
    Router.go('end');
  }
};
