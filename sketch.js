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
//let imgeModelURL = 'https://teachablemachine.withgoogle.com/models/gZ_Es72pk/';
let imgeModelURL = 'https://teachablemachine.withgoogle.com/models/dfNBM-C8y/';
// A variable to hold the image we want to classify
let img;
var dropzone ; // document.getElementById('dropzone');
function preload() {
  dropzone = select('#dropzone');
  $('#progressbar').show();
  // classifier = ml5.imageClassifier('MobileNet',modelLoaded);
  //classifier = ml5.imageClassifier(imgeModelURL + 'model.json');
  classifier = ml5.imageClassifier(imgeModelURL + 'model.json', modelLoaded);
  $('#progressbar').hide();
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
  //var dropzone;
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

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};
// ['dragenter', 'dragover'].forEach(eventName => {
//   dropzone.addEventListener(eventName, e => dropContainer.classList.add('highlight'), false)
// });

// ['dragleave', 'drop'].forEach(eventName => {
//   dropzone.addEventListener(eventName, e => dropContainer.classList.remove('highlight'), false)
// });

// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//   dropzone.addEventListener(eventName, preventDefaults, false)
// });

// dropzone.addEventListener('drop', gotFile, false);

function gotFile(e)
{
  // const dt = e.dataTransfer;
  // console.log(dt);
  // createP(file.name);
  // createP(file.type);
  // createP(file.size);
  // img = createImg(file.data, file.name);
  fileData = e.data;
 // console.log(file);
  img = loadImage(fileData);
  $("#selected-image1").attr("src", e.data);
  classifier.classify(img, gotResult);
  //console.log($("#image-selector").prop('files')[0]);
}

function dropHandler(event){
  event.preventDefault();
  console.log(event);
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
    $("#prediction-list1").append('<li> <b>Error:</b> ' + error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  let label = results[0].label;
  // fill(0);
  // textSize(64);
  // text(label,10,height-100);
  $("#prediction-list1").empty();
  $("#prediction-list1").append('<li> <b>Document Type:</b> ' + label);
  $("#prediction-list1").append('\nConfidence: ' + nf(results[0].confidence, 0, 2) + '</li>');
//  createDiv('Label: ' + label);
//  createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
}
let imageLoaded;
let fileData;
function onChange(e){
  console.log(e);

}
$(document).ready(function () {
  $("#image-selector").change(function (em) {
   // alert('here');
    imageLoaded = false;
    //console.log(em);
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log(e);
      let dataURL = e.target.result;
      $("#selected-image").attr("src", dataURL);
      
      $("#prediction-list").empty();
      imageLoaded = true;
      console.log(reader);
     
      
    }
   
      //let file = imageSelector.prop('files')[0]; 
      fileData = em.target.files[0]; // $("#image-selector").prop('files')[0];
      reader.readAsDataURL(fileData);
    //   img = loadImage(reader.result);
     // classifier.classify(img, gotResult);
     //  img = loadImage(reader.readAsDataURL(fileData));
     startOCR(fileData);
      console.log(img);
  });
});


function predictResult(){
  $('#progressbar').show();
  console.log('starting processing');
  $("#prediction-list").empty();
  //classifier.classify(img, gotResult);
  // strt OCR process
  startOCR(fileData);
  $('#progressbar').hide();
};

function startOCR(fileToUpload)
{
    console.log('startOCR');
    //Prepare form data
    var formData = new FormData();
    formData.append("file", fileToUpload);
  //  formData.append("url", "URL-of-Image-or-PDF-file");
    formData.append("language", "eng");
    formData.append("apikey", "af3ece4fef88957");
    formData.append("isOverlayRequired", false);
    formData.append("OCREngine", 2);
    console.log('starting ocr process');
    //Send OCR Parsing request asynchronously
    jQuery.ajax({
        url: 'https://api.ocr.space/parse/image',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (ocrParsedResult) {
            console.log('success');
            //Get the parsed results, exit code and error message and details
            var parsedResults = ocrParsedResult["ParsedResults"];
            var ocrExitCode = ocrParsedResult["OCRExitCode"];
            var isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"];
            var errorMessage = ocrParsedResult["ErrorMessage"];
            var errorDetails = ocrParsedResult["ErrorDetails"];
            var processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"];
            //If we have got parsed results, then loop over the results to do something
            if (errorMessage) {
              $("#prediction-list").append('<li><b>Validation:</b>' + errorMessage + '</li>');
                console.log(errorMessage);
               //  console.log(errorDetails);
            }
                

            if (parsedResults != null)
            {
                console.log('Result' + parsedResults);
                //Loop through the parsed results
                $.each(parsedResults, function (index, value)
                {
                    var exitCode = value["FileParseExitCode"];
                    var parsedText = value["ParsedText"];
                    var errorMessage = value["ParsedTextFileName"];
                    var errorDetails = value["ErrorDetails"];

                    var textOverlay = value["TextOverlay"];
                    var pageText = '';
                    console.log(parsedText);
                    // $("#result-list").append(parsedText);
                    $("#prediction-list").append('<li><b>Text:</b>' + parsedText + '</li>');
                });
            }
        }
        ,
        failure: function (response) {
            // console.log(response);
            //console.log('F' + response[0]);
            $("#prediction-list").append('<li><b>Failure:</b>' + response + '</li>');

        },
        error: function (response) {
         // console.log(response);
         // console.log('E' + response[0]);
          $("#prediction-list").append('<li><b>Error:</b>' + response + '</li>');
            
        }
    });
}