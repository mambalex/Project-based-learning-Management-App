$("#logout").click( function(){
    $(location).attr('href','/');
    localStorage.clear();
});

$("#profile").click( function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    window.open(url, '_blank');
});


$(document).on('click', '.user', function(e){
    e.preventDefault();
    $('.project').find('.dropdown-content').hide();
    if( $(this).find('.dropdown-content').css('display') === 'block' ){
        $(this).find('.dropdown-content').hide();
    }else{$(this).find('.dropdown-content').css('display','block');}
})

$(document).on('click', '.project', function(e){
    e.preventDefault();
    $('.user').find('.dropdown-content').hide();
    if( $(this).find('.dropdown-content').css('display') === 'block' ){
        $(this).find('.dropdown-content').hide();
    }else{$(this).find('.dropdown-content').css('display','block');}
})

$( ".dropdown-content" ).on({
    mouseleave: function() {
        $('.dropdown-content').hide();
    }
})

$("#logout").click( function(){
    $(location).attr('href','/');
    localStorage.clear();
});

$("#profile").click( function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    window.open(url, '_blank');
});


$("#phase-1").click(function(){
    if ($('.complete').length ===0){
        $(this).addClass('complete');
        $('.phase1').show();
        $('.active').click();
        $('.phase2').hide();
        $('.phase3').hide();
        $('.phase4').hide();
    }
    else if($('.complete').length ===1 && $("#phase-1").hasClass('complete')){
        $(this).removeClass('complete')
    }
})

$("#phase-2").click(function(){
    if($("#phase-1").hasClass('complete') && !$("#phase-2").hasClass('complete')){
        $(this).addClass('complete');
        $('.phase1').hide();
        $('.phase3').hide();
        $('.phase4').hide();
        $('.phase2').show();
        $('.active').click();
    }else if($("#phase-2").hasClass('complete') && !$("#phase-3").hasClass('complete')){
        $(this).removeClass('complete');
        $('.phase2').hide();
        $('.phase1').show();
        $('.active').click();
    }
})

$("#phase-3").click(function(){
    if($("#phase-2").hasClass('complete') && !$("#phase-3").hasClass('complete')){
        $(this).toggleClass('complete')
        $('.active').click();
        $('.phase1').hide();
        $('.phase2').hide();
        $('.phase4').hide();
        $('.phase3').show();

    }
    else if($(this).hasClass('complete') && $('#phase-2').hasClass('complete')&& !$('#phase-4').hasClass('complete')){
        $(this).toggleClass('complete')
        $('.phase3').hide();
        $('.phase2').show();
        $('.active').click();
    }
})

$("#phase-4").click(function(){
    if($("#phase-3").hasClass('complete') && $('.complete').length ===3){
        $(this).addClass('complete')
        $('.active').click();
         $('.phase3').hide();
        $('.phase4').show();
    }else if($('.complete').length ===4){
        $(this).removeClass('complete')
        $('.phase1').hide();
        $('.phase2').hide();
        $('.phase4').hide();
        $('.phase3').show();
        $('.active').click();
    }
})



// $("#phase-1").click(function(){
//     if ($('.complete').length ===0){$(this).addClass('complete')}
//     else if($('.complete').length ===1 && $("#phase-1").hasClass('complete')){
//         $(this).removeClass('complete')
//     }
// })

// $("#phase-2").click(function(){
//     if($("#phase-1").hasClass('complete') && !$("#phase-2").hasClass('complete')){
//         $(this).addClass('complete');
//         $('.phase1').hide();
//         $('.phase2').show();
//     }else if($("#phase-2").hasClass('complete') && !$("#phase-3").hasClass('complete')){
//         $(this).removeClass('complete');
//         $('.phase2').hide();
//         $('.phase1').show();
//     }
// })

// $("#phase-3").click(function(){
//     if($("#phase-2").hasClass('complete') && !$("#phase-4").hasClass('complete')){
//         $(this).toggleClass('complete')
//     }
// })

// $("#phase-4").click(function(){
//     if($("#phase-3").hasClass('complete') && $('.complete').length ===3){
//         $(this).addClass('complete')
//     }else if($('.complete').length ===4){
//         $(this).removeClass('complete')
//     }
// })







