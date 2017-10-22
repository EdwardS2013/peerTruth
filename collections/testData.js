TestData = new Meteor.Collection('testData');

TestData.allow({
  insert: function(){ return false; },
  update: function(){ return false; },
  remove: function(){ return false; }
});

TestData.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});
