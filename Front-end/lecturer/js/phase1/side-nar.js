//click Group
$(".navgrp").click( function(){
	$(".notes-wrapper").hide()
	$(".upload-files").hide()
	$(".documenets").hide()
	$(".new_note").hide()
	$(".deadline_view").hide()
	$(".group-info").show()
});

//Click reminder
$(".reminder").click(function(){
	$(".notes-wrapper").hide()
    $(".upload-files").hide()
    $(".documenets").hide()
	$(".group-info").hide()
	$(".deadline_view").hide()
	$(".new_note").show()
})

//Click Phase1
$(".active").click( function(){
	$(".group-info").hide()
	$(".new_note").hide()
    $(".upload-files").hide()
    $(".documenets").hide()
	$(".deadline_view").hide()
	$(".notes-wrapper").show()
});

//Click Deadline
$(".deadline").click( function(){
	$(".group-info").hide()
	$(".new_note").hide()
    $(".upload-files").hide()
    $(".documenets").hide()
	$(".notes-wrapper").hide()
	$(".deadline_view").show()
});

//Click Documents
$(".upload").click( function(){
    $(".group-info").hide()
    $(".new_note").hide()
    $(".notes-wrapper").hide()
    $(".deadline_view").hide()
    $(".upload-files").show()
    $(".documenets").show()
});