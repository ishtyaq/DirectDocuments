let net;
const URL = 'https://teachablemachine.withgoogle.com/models/dfNBM-C8y/';
let model,  labelContainer, maxPredictions;
let fileData;
let firstResult;
async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
    console.log('Successfully loaded model');
  $('#prediction-list').append('Model Loaded');

  // custom model
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Make a prediction through the model on our image.
  // const imgEl = document.getElementById('img');
  // const results = await net.classify(imgEl);
  // console.log(results);
  // if(results){
  //   $("#prediction-list").append('<li> <b>Document Type:</b> ' + results[0].className);
  //   $("#prediction-list").append('\nConfidence: ' + results[0].probability + '</li>');
  // }
  
  //console.log(result);
}


$(document).ready(function () {
  $("#image-selector").change(function (em) {
   // alert('here');
    imageLoaded = false;
    //console.log(em);
    let reader = new FileReader();
    reader.onload = function (e) {
     // console.log(e);
      let dataURL = e.target.result;
      $("#selected-image").attr("src", dataURL);
      
      $("#prediction-list").empty();
      imageLoaded = true;
     // console.log(reader);
     
      
    }
   
      //let file = imageSelector.prop('files')[0]; 
      fileData = em.target.files[0]; // $("#image-selector").prop('files')[0];
      reader.readAsDataURL(fileData);
    //   img = loadImage(reader.result);
     // classifier.classify(img, gotResult);
     //  img = loadImage(reader.readAsDataURL(fileData));
    
   
    // console.log(img);
  });
});

// run the webcam image through the image model
async function predict() {
    console.log('inside predict');
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(document.getElementById('selected-image'));
    if(prediction.length>0){
      firstResult = prediction[0];
      // $("#prediction-list").append('<li> <b>Document Type:</b> ' + prediction[0].className);
      // $("#prediction-list").append('\nConfidence: ' + prediction[0].probability + '</li>');
    }
    else{
      $("#prediction-list").append('No result found.');
    }
    // for (let i = 0; i < maxPredictions; i++) {
    //     const classPrediction =
    //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //    // labelContainer.childNodes[i].innerHTML = classPrediction;
       
      
    // }
}
async function startProcess(){
  startOCR(fileData);
  console.log('Start..');
  //$("#prediction-list").empty();
  predict();
  console.log(firstResult);
  startDetection();
 
  console.log('End..');
 
}
async function startDetection()
{
  
  console.log('inside mobilenet');
  net = await mobilenet.load();
 // const fileData = e.data;
 // console.log(file);
  //img = loadImage(fileData);
  //$("#selected-image1").attr("src", fileData);
  //$("#prediction-list").empty();
  
  const imgEl = document.getElementById('selected-image');

  const results = await net.classify(imgEl);
  console.log(results);
  if(results){
    if(firstResult.probability > results[0].probability){
      $("#prediction-list").append('<li> <b>Document Type:</b> ' + firstResult.className);
      $("#prediction-list").append('\nConfidence: ' + firstResult.probability + '</li>');
    }
    else{
      $("#prediction-list").append('<li> <b>Object Type:</b> ' + results[0].className);
      $("#prediction-list").append('Confidence: ' + results[0].probability.toFixed(2) + '</li>');
    }
   
  }

  console.log('process ended');

 
}

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

app();