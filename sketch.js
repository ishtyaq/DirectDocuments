// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;
//let imgeModelURL = './my-model/'; // //'https://teachablemachine.withgoogle.com/models/gZ_Es72pk/';
let imgeModelURL = 'https://teachablemachine.withgoogle.com/models/gZ_Es72pk/';

// A variable to hold the image we want to classify
let img;

function preload() {
  $('.progress-bar').show();
  // classifier = ml5.imageClassifier('MobileNet',modelLoaded);
  //classifier = ml5.imageClassifier(imgeModelURL + 'model.json');
  classifier = ml5.imageClassifier(imgeModelURL + 'model.json', modelLoaded);
  $('.progress-bar').hide();
  //img = loadImage('images/images.jpeg', imageReady);
}
function imageReady(){
    console.log('image loaded');
   
    //classifier.classify(img, gotResult);
   
}
// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');
  }
  var dropzone;
function setup() {
  createCanvas(640, 480);
  // image(img, 0, 0, width, height);
  //$("#selected-image").attr("src",'images/images.jpeg');
  
  dropzone = select('#dropzone');
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile,unhighlight);
  // background(0);
}
function gotFile(file)
{
  // createP(file.name);
  // createP(file.type);
  // createP(file.size);
  // img = createImg(file.data, file.name);
  img = loadImage(file.data);
  $("#selected-image").attr("src", file.data);
}
function highlight(){
  dropzone.style('background-color','#ccc');
}
function unhighlight(){
  dropzone.style('background-color','#fff');
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  let label = results[0].label;
  // fill(0);
  // textSize(64);
  // text(label,10,height-100);
  $("#prediction-list").append('Label: ' + label);
  $("#prediction-list").append('\nConfidence: ' + nf(results[0].confidence, 0, 2));
//  createDiv('Label: ' + label);
//  createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
}
let imageLoaded;
$("#image-selector").change(function () {
  alert('here');
  imageLoaded = false;
  console.log('change image');
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	
    //let file = imageSelector.prop('files')[0]; 
    let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

function predictResult(){
  $('.progress-bar').show();
  console.log('starting processing');
  $("#prediction-list").empty();
  classifier.classify(img, gotResult);
  $('.progress-bar').hide();
};