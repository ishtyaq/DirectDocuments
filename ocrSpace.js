$(document).ready(function () {
    $("#imgProfile").change(function (em) {
        try {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#pImg").attr('src', e.target.result);
              //  console.log(e.target.result);
                
               
            };
            startOCR(em.target.files[0]);
            reader.readAsDataURL(em.target.files[0]);
           // console.log(em.target.files[0]);
            
           

        } catch (ex) { }
    });
});
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
                console.log(errorMessage);
                console.log(errorDetails);
            }
                

            if (parsedResults != null)
            {
                console.log(parsedResults);
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
                    $("#result-list").append(parsedText);
                });
            }
        }
        ,
        failure: function (response) {
             
            console.log(response);
            
        },
        error: function (response) {
            
            console.log(response);
            
        }
    });
}