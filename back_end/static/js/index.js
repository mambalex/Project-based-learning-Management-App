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