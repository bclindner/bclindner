$(document).ready(function(){
  //option: colorblind
  //file array
  var files = [];
  //default #dragcontent blurb
  var defaultText = $('dragcontent').html();
  $("#filedrag").click(false);
  $("#filedrag").on('drag dragstart dragend dragover dragenter dragleave drop',function(e){
    e.preventDefault();
    e.stopPropagation();
  })
  .on('drop',function(e){
    handleFile(files,e);
    if(files.length == 2){
      console.log('running');
      check(files[0],files[1]);
    }
    else if(files.length == 1){
      $('#dragcontent').text('drop another file');
    }
  });
  //also check when file selects are changed
  $('#list1').change(function(){onSelectChanged(files)});
  $('#list2').change(function(){onSelectChanged(files)});
});

//helper functions
function readFile(file,callback){
  console.log(file);
  var reader = new FileReader();
  reader.onload = function(e){
    callback(reader.result);
  }
  reader.readAsText(file);
}
function check(file1,file2){
  $('#dragcontent').html('give it a sec...');
  readFile(file1,function(text1){
    readFile(file2,function(text2){
      $('#filename').text(file1.name+" & "+file2.name);
      $('#diff').html('');
      diffMethod = getMethod();
      var diff = diffMethod(text1,text2);
      console.log(diff)
      dCount = 0;
      diff.forEach(function(part){
        if(part.added || part.removed){
          dCount++;
        }
        if($('#colorblind').is(':checked')){
          var color = part.added ? '#009e73' : part.removed ? '#d55e00' : '#eee';
        }
        else{
          var color = part.added ? 'green' : part.removed ? 'red' : '#eee';
        }
        var span = $('<span></span>');
        span.css('background-color',color);
        span.text(part.value)
        $('#diff').append(span);
      });
      $('#dragcontent').html(dCount+" differences")
    });
  });
}
function handleFile(files,e){
    if(e.originalEvent.dataTransfer.files.length == 1){
      files.push(e.originalEvent.dataTransfer.files[0]);
    }
    else if(e.originalEvent.dataTransfer.files.length > 1){
      for(i=0;i<e.originalEvent.dataTransfer.files.length;i++){
        files.push(e.originalEvent.dataTransfer.files[i]);
      }
    }
  updateLists(files);
}
function updateLists(files){
  var lists = [$('#list1'), $('#list2')];
  for(i=0;i<2;i++){
    var list = lists[i];
    list.html('');
    for(j=0;j<files.length;j++){
      var file = files[j];
      var option = $('<option></option>');
      option.val(j);
      option.text("["+j+"]: "+file.name);
      if(j == files.length - 1 && i == 1){
        option.prop('selected',true);
      }
      list.append(option)
    }
  }
}
function onSelectChanged(files){
  console.log('changed');
  var values = [$('#list1').val(),$('#list2').val()];
  console.log(files);
  console.log(values);
  check(files[values[0]],files[values[1]]);
}
function getMethod(){
  switch ($('#methods').val()){
    case 'chars':
      return JsDiff.diffChars;
    case 'words':
      return JsDiff.diffWords;
    case 'lines':
      return JsDiff.diffLines;
    default:
      return JsDiff.diffChars;
  }
}
