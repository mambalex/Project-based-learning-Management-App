// sign-up AJAX
$("#signupButton").on('click',function () {
    var data = {
        user_type: $('#user-type').val(),
        email: $('.signup-email').val(),
        passwd: $('.signup-password').val(),
    };
    $.ajax({
        type:'POST',
        url:'/api/create_user',
        data: data,
        success:function () {
            alert("successfully sign in");
        },
        error:function () {
            alert('something went wrong');
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