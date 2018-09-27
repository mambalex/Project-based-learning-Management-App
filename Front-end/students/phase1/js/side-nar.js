
$(document).on('click', '.navgrp', function(e){
    $(".notes-wrapper").hide();
    // $(".due-date").hide();
    $(".documenets").hide();
    $(".group-info").show();
    $(".add-group").show();
    $(".all-groups").show();

});

$(document).on('click', '.add-group', function(e){
    $(".group_container").show();
    $(".add-group").hide();

});
$(document).on('click', '.cancel-group', function(e){
    $(".group_container").hide();
    $(".add-group").show();
})


//click Phase1
$(".phase").click( function(){
    $(".notes-wrapper").show();
    $(".due-date").show();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documenets").hide();
});

//click Documents

$(".document").click( function(){
    $(".notes-wrapper").hide();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documenets").show();
});
