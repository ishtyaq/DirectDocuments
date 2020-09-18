

let imageLoaded = false;
let classifier;
let imgeModelURL = 'https://teachablemachine.withgoogle.com/models/gZ_Es72pk/';
// A variable to hold the image we want to classify
let img;
// const imageSelector = document.getElementById('image-selector');
// const predictionList = document.getElementById('prediction-list');
// const progressBar = document.getElementById('progress-bar');
// const predictButton = document.getElementById('predict-button');
// const selectedImage = document.getElementById('selected-image');

function preload() {
  // classifier = ml5.imageClassifier('MobileNet',modelLoaded);
  //classifier = ml5.imageClassifier(imgeModelURL + 'model.json');
  //console.log(imageSelector);
  classifier = ml5.imageClassifier(imgeModelURL + 'model.json', modelLoaded);

 // img = loadImage('images/images.jpeg', imageReady);
}
function modelLoaded(){
    console.log('Model loaded');
   
   //  classifier.classify(img, gotResult);

}
// $("#image-selector")
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#image-selector").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	
    //let file = imageSelector.prop('files')[0]; 
    let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
// let modelLoaded = false;
// $( document ).ready(async function () {
// 	modelLoaded = false;
//    //  $('.progress-bar').show();
//    progressBar.show();
//     console.log( "Loading model..." );
//     model = await tf.loadGraphModel('model/model.json');
//     console.log( "Model loaded." );
//    //  $('.progress-bar').hide();
//    progressBar.hide();
// 	modelLoaded = true;
// });

// $("#predict-button")
$("#predict-button").click(async function () {
	// if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
	
   //  let image = selectedImage.get(0); // $('#selected-image').get(0);
    let image =  $('#selected-image').get(0);
    classifier.classify(image, gotResult);
	// Pre-process the image
	// console.log( "Loading image..." );
	// let tensor = tf.browser.fromPixels(image, 3)
	// 	.resizeNearestNeighbor([224, 224]) // change the image size
	// 	.expandDims()
	// 	.toFloat()
	// 	.reverse(-1); // RGB -> BGR
	// let predictions = await model.predict(tensor).data();
	// console.log(predictions);
	// let top5 = Array.from(predictions)
	// 	.map(function (p, i) { // this is Array.map
	// 		return {
	// 			probability: p,
	// 			className: TARGET_CLASSES[i] // we are selecting the value from the obj
	// 		};
	// 	}).sort(function (a, b) {
	// 		return b.probability - a.probability;
	// 	}).slice(0, 2);

	// $("#prediction-list").empty();
	// top5.forEach(function (p) {
	// 	$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
	// 	});
});

// A function to run when we get any errors and the results
function gotResult(error, results) {
    // Display error in the console
    if (error) {
      console.error(error);
    }
    // The results are in an array ordered by confidence.
    console.log(results);
    
    $("#prediction-list").append('Class: ' + results[0].label);
    $("#prediction-list").append('Confidence: ' + nf(results[0].confidence, 0, 2));

    
   // createDiv('Label: ' + label);
    //createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
  }