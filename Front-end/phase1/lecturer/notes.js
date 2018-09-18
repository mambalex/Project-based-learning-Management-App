var typingTimer;
var doneTypingInterval = 10;
var finaldoneTypingInterval = 2000;

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
};

var today = new Date();
var m = today.getMonth();
var d = today.getDate();

m = checkTime(m);
d = checkTime(d);

$('.content, .title').keydown(function() {
  	clearTimeout(typingTimer);
  	if ($('.content, .title').val) {
    	typingTimer = setTimeout(function() {
      	$(".rest").removeClass('active');
	 		$(".notes-dot").removeClass('saved');
    	}, doneTypingInterval);
  	}
});

$('.content, .title').keyup(function() {
  	clearTimeout(typingTimer);
  	typingTimer = setTimeout(function() {
    	$('.rest').addClass('active');
	 	$('.notes-dot').addClass('saved');
		$('.comment').html('Last updated by you on ' + d + '/' + m +'')
  	}, finaldoneTypingInterval);
});

function previewFile() {
	var file = document.querySelector('input[type=file]').files[0];
  	var reader  = new FileReader();

  	reader.onloadend = function () {
    	reader.result;
	 	console.log(reader.result)
	 	$('.content').append('<img src="' + reader.result + '" />');
  	}

  	if (file) {
    	reader.readAsDataURL(file);
		clearTimeout(typingTimer);
		typingTimer = setTimeout(function() {
			$('.rest').addClass('active');
			$('.notes-dot').addClass('saved');
			$('.comment').html('Last updated by you on ' + d + '/' + m +'')
		}, finaldoneTypingInterval);
  	} else {
  	}
}

document.onpaste = function(event){
  	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  	console.log(JSON.stringify(items)); // will give you the mime types
  	for (index in items) {
    	var item = items[index];
    	if (item.kind === 'file') {
      	var blob = item.getAsFile();
      	var reader = new FileReader();
      	reader.onload = function(event){
        		console.log(event.target.result); // data url!
				$('.content').append('<img src="' + event.target.result + '" />');
				$('.comment').html('Last updated by you on ' + d + '/' + m +'')
			};
      	reader.readAsDataURL(blob);
    	}
  	}
}