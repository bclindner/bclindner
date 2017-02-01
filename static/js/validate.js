$(document).ready(function(){
  //option event
  $('#colorblind').change(function(){
    if($('#colorblind').prop('checked')){
      $("link[rel='stylesheet']").attr('href','/static/css/validate.cb.css');
      console.log("switching to colorblind stylesheet")
    }
    else{
      $("link[rel='stylesheet']").attr('href','/static/css/validate.css');
      console.log("switching to normal stylesheet")
    }
  });
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
  giveItASec(file.name);
  readFile(file,function(result){
    req = new FormData();
    req.append('out','json');
    req.append('content',result);
    $.ajax("http://html5.validator.nu/",{
      data: req,
      dataType: 'json',
      type: 'POST',
      processData: false,
      contentType: false,
    })
    .done(function(data){
      console.log("validator.nu request successful");
      handleErrors(data.messages)
    })
    .fail(handleFail);
  });
}
function cssValidate(file){
  giveItASec(file.name)
  readFile(file,function(result){
    $.ajax("validate",{
      data: {'css': result},
      dataType: 'json',
      type: 'POST',
    })
    .done(function(data){
      console.log("internal css validation request successful");
      handleErrors(data.messages)
    })
    .fail(handleFail);
  });
}
//helper functions
function readFile(file,callback){
  var reader = new FileReader();
  reader.onload = function(e){
    callback(reader.result);
  }
  reader.readAsText(file);
}
function handleErrors(errors){
  var errored = 0;
  for(var i=0;i<errors.length;i++){
    e = errors[i];
    if(e.type == "error"){
      var error = $('<div class="error"></div>');
      errored = 1;
    }
    else{
      var error = $('<div class="warning"></div>');
      if(errored != 1) errored = 2;
    }
    if(typeof e.lastLine === undefined){
      error.html('Line '+e.line+", column "+e.col+": <br/><strong>"+e.message+"</strong>");
    }
    else{
      error.html('Line '+e.lastLine+", column "+e.lastColumn+": <br/><strong>"+e.message+"</strong>");
    }
    $('#errors').append(error);
  }
  $('#filedrag').removeClass();
  if(errored == 1){
    $('#filedrag').addClass('fail')
    $('#dragcontent').text(errors.length+' errors/warnings:');
  }
  else if (errored == 2){
    $('#filedrag').addClass('warn')
    $('#dragcontent').text(errors.length+' warnings:');
  }
  else{
    $('#filedrag').removeClass();
    $('#filedrag').addClass('success');
    $('#dragcontent').text('validation successful!');
  }
}
function giveItASec(filename){
  $('#errors').html('')
  $('#filename').text(filename)
  $('#filedrag').removeClass();
  $('#filedrag').addClass('ready');
  $('#dragcontent').text('give it a sec...');
}
function handleFail(xhr,status,error){
  $('#filedrag').removeClass();
  $('#filedrag').addClass('fail');
  $('#dragcontent').text("whoa! validator's broken.");
  var error = $('<div class="error"></div>');
  error.html("VALIDATOR ERROR: <br/><strong>"+xhr.responseText+"</strong>");
  $('#errors').append(error);
}
