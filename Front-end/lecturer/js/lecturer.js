

// login-signup
$(".log-in").click( function(e){
    e.stopImmediatePropagation();
    $(".layer").show();
    $(".login-signup").show();
});

$(".remove-layer").click( function(e){
    $(".layer").hide();
    $(".login-signup").hide();
});


$("#showSignUp").click( function(){
    $(".login").fadeOut("slow");
    $(".signup").fadeIn();
})

$("#showLogin").click( function(){
    $(".signup").hide();
    $(".login").show();
})

$("#loginButton").click( function(){
    $(".layer").hide();
    $(".login-signup").hide();
    $(".welcome-page").hide();
    $(".container").css('display','flex');
})


// side-nav

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



// file-input
function bs_input_file() {
    $(".input-file").before(
        function() {
            if ( ! $(this).prev().hasClass('input-ghost') ) {
                var element = $("<input type='file' class='input-ghost' style='visibility:hidden; height:0'>");
                element.attr("name",$(this).attr("name"));
                element.change(function(){
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function(){
                    element.click();
                });
                $(this).find("button.btn-reset").click(function(){
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor","pointer");
                $(this).find('input').mousedown(function() {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                return element;
            }
        }
    );
}
$(function() {
    bs_input_file();
});