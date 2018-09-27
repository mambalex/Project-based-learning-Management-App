$("#phase1").click(function(){
	if ($('.complete').length ===0){$(this).addClass('complete')}
	else if($('.complete').length ===1 && $("#phase1").hasClass('complete')){
		$(this).removeClass('complete')
	}
})

$("#phase2").click(function(){
  if($("#phase1").hasClass('complete') && !$("#phase3").hasClass('complete')){
		$(this).toggleClass('complete')
	}
})
$("#phase3").click(function(){
  if($("#phase2").hasClass('complete') && !$("#phase4").hasClass('complete')){
		$(this).toggleClass('complete')
	}
})

$("#phase4").click(function(){
  if($("#phase3").hasClass('complete') && $('.complete').length ===3){
		$(this).addClass('complete')
	}else if($('.complete').length ===4){
		$(this).removeClass('complete')
	}
})







