console.log("loading the worker!");
this.onmessage = function(e){
  console.log("got a message");
  console.dir(e);
};
