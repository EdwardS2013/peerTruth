Meteor.subscribe('workers');
Meteor.subscribe('candyTestData');
Meteor.subscribe('errorRates');

var candyData, errorRates, worker;
const NUM_REFS = 2;

function getBonus(candyClaim) {
  var btns = document.getElementById('answerArea');
  while(btns.lastChild) {
    btns.removeChild(btns.lastChild);
  }

  var payment, altChoice, altPayment, payAvg, payTruth, payLie, payMM, payGM, errorRate;
  var references = [];

  var newTr = worker.trainingCandyRounds.slice();
  var last = newTr[newTr.length-1];

  var report = candyData.fetch()[last.taskNum];
  var pay_0 = parseFloat(report.pay_0);
  var pay_1 = parseFloat(report.pay_1);
  //p0 = 0 = mm, p1 = 1 = gummy
  if(candyClaim) {
    //claimed gm
    errorRate = errorRates[1];
    altChoice = 'M&M';
    payment = pay_1;
    altPayment = pay_0;
  } else {
    //claimed mm
    errorRate = errorRates[0];
    altChoice = 'Gummy Bear';
    payment = pay_0;
    altPayment = pay_1;
  }

  if(newTr.length < 2) {
    payAvg = payment;
    payMM = pay_0;
    payGM = pay_1;
    if(last.candyType) {
      //truth GM
      payTruth = pay_1;
      payLie = pay_0;
    } else {
      //truth MM
      payTruth = pay_0;
      payLie = pay_1;
    }
  } else {
    var previous = newTr[newTr.length-2];
    payAvg = ((previous.payAvg*(newTr.length-1))+payment)/(newTr.length);
    payMM = ((previous.payMM*(newTr.length-1))+pay_0)/(newTr.length);
    payGM = ((previous.payGM*(newTr.length-1))+pay_1)/(newTr.length);
    if(last.candyType) {
      //truth GM
      payTruth = ((previous.payTruth*(newTr.length-1))+pay_1)/(newTr.length);
      payLie = ((previous.payLie*(newTr.length-1))+pay_0)/(newTr.length);
    } else {
      //truth MM
      payTruth = ((previous.payTruth*(newTr.length-1))+pay_0)/(newTr.length);
      payLie = ((previous.payLie*(newTr.length-1))+pay_1)/(newTr.length);
    }
  }

  for (i = 0; i < NUM_REFS; i++) {
    references.push(parseInt(report.reports[Math.floor(Math.random()*report.reports.length)]));
	}

  console.log(references);

  var rn = worker.trainingCandyRounds.length + 1;
  if(rn <= 5) {
    document.getElementById('welcome-btn').style.visibility = "visible";
  } else {
    document.getElementById('next-btn').style.visibility = "visible";
  }

  last.candyClaim = candyClaim;
  last.bonus = payment;
  last.altBonus = altPayment;
  last.payAvg = payAvg;
  last.payTruth = payTruth;
  last.payLie = payLie;
  last.payMM = payMM;
  last.payGM = payGM;
  last.errorRate = parseFloat(errorRate);
  last.references = references;
  Workers.update({_id: worker._id}, {$set: {"trainingCandyRounds": newTr}});
}

Template.training_candy_payment.onCreated(function () {
	candyData = CandyTestData.find();
	errorRates = ErrorRates.find().fetch()[0].candy_errs;

	worker = Workers.findOne({"workerId": worker_Id});
});

Template.training_candy_payment.rendered=function(){
  $('html,body').scrollTop(0);

  var tr = worker.trainingCandyRounds;
  var roundNum = 1;
  tr.forEach(function(round) {
    //not an in-progress round
    if(round.bonus != null) {
      var otherClaims = [1, 0];
      var row = document.getElementById("history-table").insertRow(-1);

      var cellRound = row.insertCell(0);
      var cellYourCandy = row.insertCell(1);
      var cellYourClaim = row.insertCell(2);
      var cellOtherClaims = row.insertCell(3);
      var cellAvg = row.insertCell(4);
      var cellTruth = row.insertCell(5);
      var cellLie = row.insertCell(6);
      var cellGM = row.insertCell(7);
      var cellMM = row.insertCell(8);

      cellRound.innerHTML = roundNum;
      if(round.candyType) {
        cellYourCandy.innerHTML = "<img src=\"/images/gm.png\" id=\"history-image\">";
      } else {
        cellYourCandy.innerHTML = "<img src=\"/images/mm.png\" id=\"history-image\">";
      }

      if(round.candyClaim) {
        cellYourClaim.innerHTML = "<img src=\"/images/gm.png\" id=\"history-image\">";
      } else {
        cellYourClaim.innerHTML = "<img src=\"/images/mm.png\" id=\"history-image\">";
      }

      for(var i = 0; i < round.references.length; i++) {
  			if(round.references[i]) {
  				cellOtherClaims.innerHTML += "<img src=\"/images/gm.png\" id=\"history-image\">";
  			} else {
  				cellOtherClaims.innerHTML += "<img src=\"/images/mm.png\" id=\"history-image\">";
  			}
  		}
      console.log(typeof(round.payAvg));

      cellAvg.innerHTML = "$" + round.payAvg.toFixed(2);
      cellTruth.innerHTML = "$" + round.payTruth.toFixed(2);
      cellLie.innerHTML = "$" + round.payLie.toFixed(2);
      cellGM.innerHTML = "$" + round.payGM.toFixed(2);
      cellMM.innerHTML = "$" + round.payMM.toFixed(2);

      roundNum += 1;
    }
  });
};

Template.training_candy_payment.events={
  'click #submit-mm': function(event, template){
    getBonus(0);
  },
  'click #submit-gm': function(event, template){
    getBonus(1);
  },
  'click #welcome-btn': function(event, template){
    event.preventDefault();
    Router.go('training_candy_game');
  },
  'click #next-btn': function(event, template){
    event.preventDefault();
    Router.go('training_image_game');
  }
};
