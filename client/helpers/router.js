worker_Id = '';
assignment_Id = '';
hit_Id = '';
urls = '';
startTime = '';
endTime = '';

gup = function(path, name){
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec(path);
    if( results == null )
      return "";
    else
      return results[1];
 };


Router.route('/', function(){
		path = window.location.href;
		worker_Id = gup(path, 'workerId');
    if(worker_Id == "") {
      worker_Id = Math.random().toString(36).substring(7);
    }
		assignment_Id = gup(path, 'assignmentId');
		hit_Id = gup(path, 'hitId');
		bonusLevel = gup(path, 'urls');

		this.layout('MainLayout');
		this.render('intro');
	});

Router.route('/welcome', function(){
		this.layout('MainLayout');
		this.render('welcome');
	});

Router.route('/transit', function(){
		this.layout('MainLayout');
		this.render('transit');
	});

Router.route('/bonus', function(){
		this.layout('MainLayout');
		this.render('bonus');
	});

Router.route('/bonus2', function(){
		this.layout('MainLayout');
		this.render('bonus2');
	});

Router.route('/bonus_control', function(){
		this.layout('MainLayout');
		this.render('bonus_control');
	});

Router.route('/bonus_pts', function(){
		this.layout('MainLayout');
		this.render('bonus_pts');
	});

Router.route('/end', function(){
		this.layout('MainLayout');
		this.render('end');
	});

Router.route('/error', function(){
		this.layout('MainLayout');
		this.render('error');
	});

Router.route('/payment', function(){
		this.layout('MainLayout');
		this.render('payment');
  });

Router.route('/training_candy_game', function() {
  this.layout('MainLayout');
  this.render('training_candy_game');
});

Router.route('/training_candy_payment', function() {
  this.layout('MainLayout');
  this.render('training_candy_payment');
});

Router.route('/training_image_game', function() {
  this.layout('MainLayout');
  this.render('training_image_game');
});

Router.route('/training_to_real', function() {
  this.layout('MainLayout');
  this.render('training_to_real');
});

Router.route('/real_candy_game', function() {
  this.layout('MainLayout');
  this.render('real_candy_game');
});

Router.route('/real_candy_payment', function() {
  this.layout('MainLayout');
  this.render('real_candy_payment');
});

Router.route('/real_image_game', function() {
  this.layout('MainLayout');
  this.render('real_image_game');
});
