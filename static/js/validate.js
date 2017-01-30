$(document).ready(function(){
  $("#filedrag").click(false);
  $("#filedrag").on('drag dragstart dragend dragover dragenter dragleave drop',function(e){
    e.preventDefault();
    e.stopPropagation();
  })
  .on('drop',function(e){
    var file = e.originalEvent.dataTransfer.files[0];
    if(file.type == "text/html"){
      htmlValidate(file);
    }
    else if(file.type == "text/css"){
      cssValidate(file);
    }
  })
});

function htmlValidate(file){
  $('#errors').html('')
  var reader = new FileReader();
  reader.onload = function(e){
    $('#filename').text(file.name)
    $('#filedrag').removeClass();
    $('#filedrag').addClass('ready');
    $('#dragcontent').text('give it a sec...');
    req = new FormData();
    req.append('out','json');
    req.append('content',reader.result);
    $.ajax("http://html5.validator.nu/",{
      data: req,
      dataType: 'json',
      type: 'POST',
      processData: false,
      contentType: false,
    })
    .done(function(data){
      console.log("validator.nu request successful");
      var errors = data.messages;
      var errored = false;
      if(errors.length){
        for(var i=0;i<errors.length;i++){
          if(errors[i].subType == "warning"){
            var error = $('<div class="warning"></div>');
            warned = true;
          }
          else if(errors[i].type == "error"){
            var error = $('<div class="error"></div>');
            errored = true;
          }
          error.html('Line '+errors[i].lastLine+", column "+errors[i].lastColumn+": <br/><strong>"+errors[i].message+"</strong>");
          $('#errors').append(error);
        }
        $('#filedrag').removeClass();
        if(errored){
          $('#filedrag').addClass('fail')
          $('#dragcontent').text(errors.length+' errors/warnings:');
        }
        else if (!errored && warned){
          $('#filedrag').addClass('warn')
          $('#dragcontent').text(errors.length+' warnings:');
        }
      }
      else{
        $('#filedrag').removeClass();
        $('#filedrag').addClass('success');
        $('#dragcontent').text('validation successful!');
      }
    })
    .fail(function(){
        $('#filedrag').removeClass();
        $('#filedrag').addClass('fail');
        $('#dragcontent').text("whoa! validator's broken.");
    });
  }
  reader.readAsText(file);
}
function cssValidate(file){
  var reader = new FileReader();
  reader.onload = function(e){
    $('#filedrag').removeClass();
    $('#filedrag').addClass('ready');
    $('#dragcontent').text('give it a sec...');
    $.ajax("validate",{
      data: {'css': reader.result},
      dataType: 'json',
      type: 'POST',
    })
    .done(function(data){
      console.log("internal css validation request successful");
      var errors = data.messages;
      var errored = false;
      var warned = false;
      if(errors.length){
        $('#errors').html('');
        for(var i=0;i<errors.length;i++){
          if(errors[i].type == "warning"){
            var error = $('<div class="warning"></div>');
            warned = true;
          }
          else if(errors[i].type == "error"){
            var error = $('<div class="error"></div>');
            errored = true;
          }
          error.html('Line '+errors[i].line+", column "+errors[i].col+": <br/><strong>"+errors[i].message+"</strong>");
          $('#errors').append(error);
        }
        $('#filedrag').removeClass();
        if(errored){
          $('#filedrag').addClass('fail')
          $('#dragcontent').text(errors.length+' errors/warnings:');
        }
        else if (!errored && warned){
          $('#filedrag').addClass('warn')
          $('#dragcontent').text(errors.length+' warnings:');
        }
      }
      else{
        $('#filedrag').removeClass();
        $('#filedrag').addClass('success');
        $('#dragcontent').text('validation successful!');
      }
    })
    .fail(function(){
        $('#filedrag').removeClass();
        $('#filedrag').addClass('fail');
        $('#dragcontent').text("whoa! validator's broken.");
    });
  }
  reader.readAsText(file);
}
