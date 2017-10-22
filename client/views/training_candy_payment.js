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

  var payment, altChoice, altPayment, errorRate;
  var references = [];

  var newTr = worker.trainingCandyRounds.slice();
  var last = newTr[newTr.length-1];

  var report = candyData.fetch()[last.taskNum];
  //p0 = 0 = mm, p1 = 1 = gummy
  if(candyClaim) {
    //claimed gm
    errorRate = errorRates[1];
    altChoice = 'M&M';
    payment = report.pay_1;
    altPayment = report.pay_0;

  } else {
    //claimed mm
    errorRate = errorRates[0];
    altChoice = 'Gummy Bear';
    payment = report.pay_0;
    altPayment = report.pay_1;
  }

  for (i = 0; i < NUM_REFS; i++) {
    references.push(parseInt(report.reports[Math.floor(Math.random()*report.reports.length)]));
	}

  console.log(references);

  var wrapper = document.createElement('H4');
  var paymentText = document.createTextNode('Your bonus payment would have been: $' + payment);
  var altPaymentText = document.createTextNode('Had you chosen to report ' + altChoice +
                                                ' instead, your bonus payment would have been: $' + altPayment);
  wrapper.appendChild(paymentText);
  wrapper.appendChild(document.createElement('br'));
  wrapper.appendChild(document.createElement('br'));
  wrapper.appendChild(altPaymentText);
  btns.appendChild(wrapper);

  var rn = worker.trainingCandyRounds.length + 1;
  if(rn <= 3) {
    document.getElementById('welcome-btn').style.visibility = "visible";
  } else {
    document.getElementById('next-btn').style.visibility = "visible";
  }

  last.candyClaim = candyClaim;
  last.bonus = payment;
  last.altBonus = altPayment;
  last.errorRate = errorRate;
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
      var cellBonus = row.insertCell(4);
      var cellAltBonus = row.insertCell(5);
      var cellErrorRate = row.insertCell(6);

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

      cellBonus.innerHTML = "$" + round.bonus;
      cellAltBonus.innerHTML = "$" + round.altBonus;
      cellErrorRate.innerHTML = round.errorRate;

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
