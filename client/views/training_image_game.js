Meteor.subscribe('workers');
Meteor.subscribe('realTasks');
Meteor.subscribe('imageTestData');
Meteor.subscribe('imageTestDataPTS');
Meteor.subscribe('errorRates');

var tasks, imageData, imageDataPTS, errorRates, worker, taskType, currentAns;
const P0_VAL = 0.7;
const NUM_REFS = 1;
const ROUND_TOTAL = 5;

function pressedAnswer() {
	var btns = document.getElementById('answerArea');
  while(btns.lastChild) {
    btns.removeChild(btns.lastChild);
  }

  if(Template.instance().roundNum.get() <= 4) {
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
		var cellAvg = row.insertCell(3);
		var cellSame = row.insertCell(4);
		var cellDiff = row.insertCell(5);

    cellRound.innerHTML = roundNum;

    if(round.claim) {
      cellYourClaim.innerHTML = 'Yes';
    } else {
      cellYourClaim.innerHTML = 'No';
    }

		for(var i = 0; i < round.references.length; i++) {
			if(round.references[i]) {
				cellOtherClaims.innerHTML += 'Yes';
			} else {
				cellOtherClaims.innerHTML += 'No';
			}

			if(i < round.references.length-1) {
				cellOtherClaims.innerHTML += ', ';
			}
		}

		cellAvg.innerHTML = round.payAvg.toFixed(2) + " pts";
		cellSame.innerHTML = round.paySame.toFixed(2) + " pts";
		cellDiff.innerHTML = round.payDiff.toFixed(2) + " pts";

    roundNum += 1;
	});
}

function addAnswer(answer) {
	var payment, altChoice, altPayment, payAvg, paySame, payDiff;
	var errorRate = -1;
	var references = [];

	var imageTr = worker.trainingImageRounds;
	console.log(imageTr);

	var report;
	if(taskType == 0) {
		//our mechanism
		report = imageData.fetch()[Template.instance().taskNum.get()];
	} else if(taskType == 2) {
		//pts mechanism
		report = imageDataPTS.fetch()[Template.instance().taskNum.get()];
	}
	var pay_0 = parseFloat(report.pay_0);
  var pay_1 = parseFloat(report.pay_1);

	if(answer) {
		//1 yes, members of different species
		if(taskType == 0) {
			errorRate = errorRates[1];
		}
		altChoice = 'No';
		payment = pay_1;
		altPayment = pay_0;
	} else {
		//0 no, members of same species
		if(taskType == 0) {
			errorRate = errorRates[0];
		}
		altChoice = 'Yes';
		payment = pay_0;
		altPayment = pay_1;
	}

	if(imageTr.length < 1) {
    payAvg = payment;
    paySame = pay_0;
    payDiff = pay_1;
  } else {
    var previous = imageTr[imageTr.length-1];
    payAvg = ((previous.payAvg*(imageTr.length))+payment)/(imageTr.length+1);
    paySame = ((previous.paySame*(imageTr.length))+pay_0)/(imageTr.length+1);
    payDiff = ((previous.payDiff*(imageTr.length))+pay_1)/(imageTr.length+1);
  }

	for (i = 0; i < NUM_REFS; i++) {
    references.push(parseInt(report.reports[Math.floor(Math.random()*report.reports.length)]));
	}

	var task = tasks.fetch()[Template.instance().taskNum.get()];
	var newRound = {"pairNum": parseInt(task.pairNum), "claim": parseInt(answer),  "bonus": payment,
									"altBonus": altPayment, "payAvg": payAvg, "paySame": paySame, "payDiff": payDiff,
									"references": references, "errorRate": parseFloat(errorRate)};

	worker.trainingImageRounds.push(newRound);
	Workers.update({_id: worker._id}, {$set: {"trainingImageRounds": worker.trainingImageRounds}});
}

Template.training_image_game.onCreated(function () {
	tasks = RealTasks.find();
	imageData = ImageTestData.find();
	imageDataPTS = ImageTestDataPTS.find();
	errorRates = ErrorRates.find().fetch()[0].image_errs;

	worker = Workers.findOne({"workerId": worker_Id});
	taskType = worker.taskType;

	this.roundNum = new ReactiveVar(1);
	this.taskNum = new ReactiveVar(Math.floor(Math.random()*tasks.count()));

	var task = tasks.fetch()[this.taskNum.get()];
	currentAnswer = task.answer;
});

Template.training_image_game.helpers({
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
		var answer;
		if(currentAnswer) {
			do {
				template.taskNum.set(Math.floor(Math.random()*tasks.count()));
				answer = tasks.fetch()[template.taskNum.get()].answer;
			} while(answer);
		} else {
			do {
				template.taskNum.set(Math.floor(Math.random()*tasks.count()));
				answer = tasks.fetch()[template.taskNum.get()].answer;
			} while(!answer);
		}
		currentAnswer = answer;

		pressedNext();
		updateTable();
	},
	'click #next-btn': function(event, template){
    event.preventDefault();
    Router.go('training_to_real');
  }
};
