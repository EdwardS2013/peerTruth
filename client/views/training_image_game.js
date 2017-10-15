Meteor.subscribe('workers');
Meteor.subscribe('realTasks');

var tasks, worker;

function pressedAnswer() {
	var btns = document.getElementById('answerArea');
  while(btns.lastChild) {
    btns.removeChild(btns.lastChild);
  }

  if(Template.instance().roundNum.get() <= 2) {
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

function updateTable() {
	var table = document.getElementById("history-table");
	while(table.rows.length > 1) {
		table.deleteRow(-1);
	}

	var tr = worker.trainingImageRounds;
  var roundNum = 1;
  tr.forEach(function(round) {
    var otherClaims = [1, 0];
    var row = table.insertRow(-1);

    var cellRound = row.insertCell(0);
    var cellYourClaim = row.insertCell(1);
    var cellOtherClaims = row.insertCell(2);
    var cellBonus = row.insertCell(3);
    var cellAltBonus = row.insertCell(4);
    var cellErrorRate = row.insertCell(5);

    cellRound.innerHTML = roundNum;

    if(round.claim) {
      cellYourClaim.innerHTML = 'Yes';
    } else {
      cellYourClaim.innerHTML = 'No';
    }

    cellOtherClaims.innerHTML = 'Yes' + ', ' + 'No';
    cellBonus.innerHTML = "$" + round.bonus;
    cellAltBonus.innerHTML = "$" + round.altBonus;
    cellErrorRate.innerHTML = round.errorRate;

    roundNum += 1;
	});
}

function addAnswer(answer){
	var payment, altChoice, altPayment, errorRate;
	if(answer) {
		//yes
		payment = 0.5;
		altChoice = 'No';
		altPayment = 0.25;
		errorRate = 0.2;
	} else {
		payment = 0.25;
		altChoice = 'Yes';
		altPayment = 0.5;
		errorRate = 0.2;
	}

	var btns = document.getElementById('answerArea');
	var wrapper = document.createElement('H4');
  var paymentText = document.createTextNode('Your bonus payment would have been: $' + payment);
  var altPaymentText = document.createTextNode('Had you chosen to report ' + '\"' + altChoice + '\"' +
                                                ' instead, your bonus payment would have been: $' + altPayment);
  wrapper.appendChild(paymentText);
  wrapper.appendChild(document.createElement('br'));
  wrapper.appendChild(document.createElement('br'));
  wrapper.appendChild(altPaymentText);
  btns.appendChild(wrapper);


	var task = tasks.fetch()[Template.instance().taskNum.get()];

	var newRound = {"pairNum": task.pairNum, "claim": answer, "bonus": payment,
									"altBonus": altPayment, "errorRate": errorRate};

	worker.trainingImageRounds.push(newRound);
	Workers.update({_id: worker._id}, {$set: {"trainingImageRounds": worker.trainingImageRounds}});
}

Template.training_image_game.onCreated(function () {
	tasks = RealTasks.find();
	worker = Workers.findOne({"workerId": worker_Id});

	this.roundNum = new ReactiveVar(1);
	this.taskNum = new ReactiveVar(Math.floor(Math.random()*tasks.count()));
});

Template.training_image_game.helpers({
	roundNum: function(){
		return Template.instance().roundNum.get();
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

Template.training_image_game.onRendered(function () {
	$('html,body').scrollTop(0);
	startTime = new Date();
});

Template.training_image_game.events={
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
		template.taskNum.set(Math.floor(Math.random()*tasks.count()));

		pressedNext();
		updateTable();
	},
	'click #next-btn': function(event, template){
    event.preventDefault();
    Router.go('training_to_real');
  }
};
