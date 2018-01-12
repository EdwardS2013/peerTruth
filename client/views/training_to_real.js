Template.training_to_real.rendered=function(){
	$('html,body').scrollTop(0);
};

Template.training_to_real.events={
  'click #welcome-btn': function(event, template) {
    event.preventDefault();

		var today = new Date();
		time.push(today.toString());
		console.log(time);

    Router.go('real_candy_game');
  }
};
