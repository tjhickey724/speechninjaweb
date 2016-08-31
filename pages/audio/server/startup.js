Meteor.startup(function(){
  Recording.remove({});
  Recording.insert({user:"test",recording:"not recording",success:false});

})
