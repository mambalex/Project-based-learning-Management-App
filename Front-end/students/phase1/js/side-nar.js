//click Group
$(".navgrp").click( function(){
	$(".notes-wrapper").hide()
	$(".group-info").show()
	$(".add-group").show()


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
    $(".notes-wrapper").show()
    $(".group-info").hide()
    $(".group_container").hide()
});
