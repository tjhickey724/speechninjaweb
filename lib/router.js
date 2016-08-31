Router.configure({
  layoutTemplate: 'layout',
});

Router.route('/',{name:"home"});
Router.route('audio');
Router.route('audio2');


/*
  This code allows the Meteor server to be called
  from another client or server with the path /record
  and a JSON packet for data. It will then do some work
  and respond.  In our case, we want to have it record
  the audio, analyze it, and send the result to the user.
  The cleaner way would be to have the Blender code run
  a socketserver and then use the http package to send
  a message back to the Pytbon server, but
  this approach works and it is shorter and simpler.

  So we will change the contents of the Collection
  which starts recording and at the end updates the data
  We'll wait 3 seconds then read the collection and
  send the data back... hmmmm.... pretty hacky!!
*/
Router.map(function () {
  this.route('serverFile', {
    path: '/record/',
    where: 'server',

    action: function () {
      //var filename = this.params.filename;
      //resp = {'lat' : this.request.body.lat,
      //        'lon' : this.request.body.lon};
      console.log("storing Response");
      let status = Recording.findOne();
      Recording.update(status._id,{$set:{recording:true}});

      Meteor._sleepForMs(3000);
      status = Recording.findOne();

      this.response.writeHead(200, {'Content-Type':
                                    'application/json; charset=utf-8'});
      this.response.end(JSON.stringify(status)+"\n");

    }
  });
});


function responseTest(response){
  return () => {
     response.writeHead(200, {'Content-Type':
                                'application/json; charset=utf-8'});
     response.end(JSON.stringify(resp));
   }
}
