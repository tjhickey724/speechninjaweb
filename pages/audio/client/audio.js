const audioRecorder = new AudioRecorder();

Template.audio.events({
  "click .js-record": function(event){
    const text = $(".js-record").html();
    if (text=="Record"){
      console.log("you clicked Record");
      $(".js-record").html("Stop");
      audioRecorder.startRecording();
    } else {
      console.log("you clicked Stop");
      $(".js-record").html("Record");
      audioRecorder.stopRecording(
        'Uint8Array','ArrayBufferFile',
        function(error,result){
          theAudioResult = result;
          console.log([error,result]);
        }
      )
    }
  }
});

Template.audio.onRendered(function(){
// fork getUserMedia for multiple browser versions, for those
// that need prefixes
navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
// define other variables
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var myAudio = document.querySelector('audio');
var pre = document.querySelector('pre');
var video = document.querySelector('video');
var myScript = document.querySelector('script');
var range = document.getElementById('the-range');
console.log("the range is");
console.dir(range);

//var range = document.querySelector('input');
var freqResponseOutput = document.querySelector('.freq-response-output');
// Create variables to store mouse pointer Y coordinate
// and HEIGHT of screen
var CurY;
var HEIGHT = window.innerHeight;
// create float32 arrays for getFrequencyResponse
var myFrequencyArray = new Float32Array(5);
myFrequencyArray[0] = 1000;
myFrequencyArray[1] = 2000;
myFrequencyArray[2] = 3000;
myFrequencyArray[3] = 4000;
myFrequencyArray[4] = 5000;
var magResponseOutput = new Float32Array(5);
var phaseResponseOutput = new Float32Array(5);
// getUserMedia block - grab stream
// put it into a MediaStreamAudioSourceNode
// also output the visuals into a video element
if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints: audio and video for this app
      {
         audio: true,
         video: true
      },
      // Success callback
      function(stream) {
        console.dir(stream);
        video = $("#the-video");
         video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
         video.onloadedmetadata = function(e) {
            video.play();
            video.muted = 'true';
         };
         // Create a MediaStreamAudioSourceNode
         // Feed the HTMLMediaElement into it
         var source = audioCtx.createMediaStreamSource(stream);
          // Create a biquadfilter
          var biquadFilter = audioCtx.createBiquadFilter();
          biquadFilter.type = "lowshelf";
          biquadFilter.frequency.value = 1000;
          console.dir(range);
          biquadFilter.gain.value = range.value;
          // connect the AudioBufferSourceNode to the gainNode
          // and the gainNode to the destination, so we can play the
          // music and adjust the volume using the mouse cursor
          source.connect(biquadFilter);
          biquadFilter.connect(audioCtx.destination);
          // Get new mouse pointer coordinates when mouse is moved
          // then set new gain value
          range.oninput = function() {
              biquadFilter.gain.value = range.value;
          }
          function calcFrequencyResponse() {
            biquadFilter.getFrequencyResponse(myFrequencyArray,magResponseOutput,phaseResponseOutput);
            for(i = 0; i <= myFrequencyArray.length-1;i++){
              var listItem = document.createElement('li');
              listItem.innerHTML = '' + myFrequencyArray[i] + 'Hz: Magnitude ' + magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
              freqResponseOutput.appendChild(listItem);
            }
          }
          calcFrequencyResponse();
      },
      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}
// dump script to pre element
//
 });
