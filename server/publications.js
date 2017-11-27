Meteor.publish('allFinishedWorkers',function(){
	return FinishedWorkers.find({},{fields:{assignmentId:false, hitId:false, submitTime:false, group: false, leftMoney: false, totalBonus: false}});
});

Meteor.publish('workers',function(){
	return Workers.find({}, {fields:{
									assignmentId: false,
									hitId: false,
									group: false,
									time: false,
								}});
});

Meteor.publish('realTasks', function(){
	return RealTasks.find();
});

Meteor.publish('candyTestData', function(){
	return CandyTestData.find();
});

Meteor.publish('candyTestDataPTS', function(){
	return CandyTestDataPTS.find();
});

Meteor.publish('imageTestData', function(){
	return ImageTestData.find();
});

Meteor.publish('imageTestDataPTS', function(){
	return ImageTestDataPTS.find();
});

Meteor.publish('errorRates', function(){
	return ErrorRates.find();
});
