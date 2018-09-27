$(function(){
    $("#header-timeline").load("header-timeline.html");
});


$(document).on('click', '.g-popup', function(e){
    e.preventDefault();
    $(".group-popup").show();
})

$(document).on('click', '.group-popup-close', function(e){
    e.preventDefault();
    $(".group-popup").hide();
})
