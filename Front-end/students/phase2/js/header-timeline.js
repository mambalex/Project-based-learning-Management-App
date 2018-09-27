

$(document).on('click', '.user', function(e){
    e.preventDefault();
    if( $('.dropdown-content').css('display') === 'block' ){
        $('.dropdown-content').hide();
    }else{$('.dropdown-content').css('display','block');}
})

$( ".dropdown-content" ).on({
    mouseleave: function() {
        $('.dropdown-content').hide();
    }
})






$("#phase-1").click(function(){
    if ($('.complete').length ===0){$(this).addClass('complete')}
    else if($('.complete').length ===1 && $("#phase-1").hasClass('complete')){
        $(this).removeClass('complete')
    }
})

$("#phase-2").click(function(){
    if($("#phase-1").hasClass('complete') && !$("#phase-3").hasClass('complete')){
        $(this).toggleClass('complete')
    }
})
$("#phase-3").click(function(){
    if($("#phase-2").hasClass('complete') && !$("#phase-4").hasClass('complete')){
        $(this).toggleClass('complete')
    }
})

$("#phase-4").click(function(){
    if($("#phase-3").hasClass('complete') && $('.complete').length ===3){
        $(this).addClass('complete')
    }else if($('.complete').length ===4){
        $(this).removeClass('complete')
    }
})







