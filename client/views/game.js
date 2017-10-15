Template.game.helpers({
	text: function(){
		//var currentRound = Workers.find({"workerId":worker_Id});
		//return currentRound.
		return Session.get("roundNum");
	},
	id: function(){
		return currentPuzzle;
	},
	key:function(){
		return currentWord;
	},
	key2:function(){
		return currentWord;
	},
});

Template.game.rendered=function(){
	$('html,body').scrollTop(0);
	startTime = new Date();
};

Template.game.events={
	'click #candy-btn': function(event, template){
		var candyButton = document.getElementById('candy-btn');
		candyButton.parentNode.removeChild(candyButton);
		var candyDiv =  document.getElementById('candyArea');

		var wrapHeader = document.createElement('H3');
		var gummyText = document.createTextNode('Your candy is: Gummy bear');
		var mmText = document.createTextNode('Your candy is: M&M');
		if(Math.random() >= 0.5) {
			wrapHeader.appendChild(mmText);
		} else {
			wrapHeader.appendChild(gummyText);
		}

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

		Router.go('payment');
	}
};
