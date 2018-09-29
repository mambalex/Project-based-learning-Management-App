//sign-up AJAX

$("#signupButton").on('click',function () {
    var data = {
        email: $('.signup-email').val(),
        passwd: $('.signup-password').val(),
    };

    $.ajax({
       type:'POST',
        url:'/api/create_user',
        data: data,
        success:function () {
            alert("successfully sign in")
        },
        error:function () {
            alert('something went wrong')
        }

    });
});







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


// phase1

// side-nav

// click group
$(document).on('click', '.navgrp', function(e){
    $(".notes-wrapper").hide();
    $(".documenets").hide();
    $(".group-info").show();
    $(".add-group").show();
    $(".all-groups").show();

});

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


// group

// click-add-group
$(document).on('click', '.add-group', function(e){
    $(".group_container").show();
    $(".add-group").hide();
});

// click cancel
$(document).on('click', '.cancel-group', function(e){
    $(".group_container").hide();
    $(".add-group").show();
});

//click group name popup
$(document).on('click', '.g-popup', function(e){
    e.preventDefault();
    $(".group-popup").show();
});

//click group popup close
$(document).on('click', '.group-popup-close', function(e){
    e.preventDefault();
    $(".group-popup").hide();
});


// phase2
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

//side-nav
$(document).on('click', '.nav-design', function(e){
    e.preventDefault();
    $(".requirement").hide();
    $(".design").show();
})

$(document).on('click', '.nav-requirement', function(e){
    e.preventDefault();
    $(".requirement").show();
    $(".design").hide();
})