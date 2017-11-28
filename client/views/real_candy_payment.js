Meteor.subscribe('workers');

const ROUND_TOTAL = 5;

function getBonus(candyClaim) {
  var btns = document.getElementById('answerArea');
  while(btns.lastChild) {
    btns.removeChild(btns.lastChild);
  }

  var payment, altChoice, altPayment, errorRate;

  //calculate payments, error rate, etc
  var mmPay = 1;
  var gmPay = 0.35;
  if(candyClaim) {
    //claimed mm
    payment = mmPay;
    altPayment = gmPay;
    altChoice = 'Gummy Bear';
    errorRate = 0.1;
  } else {
    //claimed gm
    payment = gmPay;
    altPayment = mmPay;
    altChoice = 'M&M';
    errorRate = 0.1;
  }

  var worker = Workers.findOne({"workerId": worker_Id});
  var newTr = worker.dataCandyRound.slice();
  var last = newTr[newTr.length-1];

  last.candyClaim = candyClaim;
  last.bonus = payment;
  last.altBonus = altPayment;
  last.errorRate = errorRate;
  Workers.update({_id: worker._id}, {$set: {"dataCandyRound": newTr}});

  var rn = worker.dataCandyRound.length + 1;
  if(rn <= ROUND_TOTAL) {
    document.getElementById('welcome-btn').style.visibility = "visible";
  } else {
    document.getElementById('next-btn').style.visibility = "visible";
  }
}

Template.real_candy_payment.rendered=function(){
	$('html,body').scrollTop(0);
	startTime = new Date();
};

Template.real_candy_payment.events={
  'click #submit-mm': function(event, template){
    getBonus(1);
  },
  'click #submit-gm': function(event, template){
    getBonus(0);
  },
  'click #welcome-btn': function(event, template){
    event.preventDefault();
    Router.go('real_candy_game');
  },
  'click #next-btn': function(event, template){
    event.preventDefault();
    Router.go('real_image_game');
  }
};
