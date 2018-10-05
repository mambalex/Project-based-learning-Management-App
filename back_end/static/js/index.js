// login-signup page
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
    $(".login").hide();
    $(".signup").fadeIn("slow");
    $('.signup-email').val('');
    $('.signup-password').val('');
    $('.comfirm-password').val('');
    $('#user-type').val('');
})

$("#showLogin").click( function(){
    $(".signup").hide();
    $(".login").fadeIn("slow");
    $('.login-email').val('');
    $('.login-password').val('');
})



// sign-up request
$(".signup").on('submit',function (e) {
    e.preventDefault();
    var email = $('.signup-email').val();
    var password = $('.signup-password').val();
    var confirmPassword = $('.comfirm-password').val();
    var userType = $('#user-type').val();
    if(password ==""|| email==""){
        $('#errorAlert2').text("Email and password are needed").show();
        $('#successAlert2').hide();
        return
    }
    if (!userType){
        $('#errorAlert2').text("please select user type").show();
        $('#successAlert2').hide();
        return
    }else if( password !== confirmPassword){
        $('#errorAlert2').text("confirm password must match").show();
        $('#successAlert2').hide();
        return
    }

    var data = {
        user_type: userType,
        email: email,
        passwd: password
    };
    console.log(data);
    $.ajax({
        type:'POST',
        url:'/api/create_user',
        data: data,
        success:function (rsp_data) {
            alert("successfully sign up");
            $('#successAlert2').text("successfully sign up").show();
            $('#errorAlert2').hide();
            setTimeout(function(){ 
               $(".signup").hide();
               $(".login").fadeIn("slow"); 
           }, 3000);
            
            console.log(rsp_data);

        },
        error:function (rsp_data) {
            console.log(rsp_data);
            alert("something went wrong");
        }
    });
});


// login request
$(".login").on('submit',function (e) {
    e.preventDefault();
    var email = $('.login-email').val();
    var passwd = $('.login-password').val();
    var data = {
        email: $('.login-email').val(),
        passwd: $('.login-password').val(),
    };

    $.ajax({
        type:'POST',
        url:'/api/login',
        data: data,
        // success:function (rsp_data) {
        //     console.log(rsp_data);
        //     $('#successAlert').text("successfully log in!").show();
        //     $('#errorAlert').hide();

        //     localStorage.setItem('token', JSON.stringify(rsp_data));
        //     console.log(JSON.parse(localStorage.getItem('token')).token);
        //     setTimeout(function(){ 
        //         window.location.pathname = "./student";},1500);
        // },
        // error:function (rsp_data) {
        //     console.log(rsp_data);
        //     $('#errorAlert').text(data.error).show();
        //     $('#successAlert').hide();
        // }
    }).done(function(rsp_data){
        console.log(rsp_data);
        var status = rsp_data['code'];
        var user_type = rsp_data['user_type'];
        if(status == '200'){
            $('#successAlert').text("Successfully sign up").show();
            $('#errorAlert').hide();
            localStorage.setItem('token', JSON.stringify(rsp_data));
            console.log(JSON.parse(localStorage.getItem('token')).token);
            setTimeout(function(){ 
                if(user_type == 'student'){
                     window.location.pathname = "./student";
                }else{
                     window.location.pathname = "./lecturer";
                }
             },1500)
        }else if(status == '400'){
            $('#errorAlert').text(rsp_data['msg']).show();
            $('#successAlert').hide();
        }
    })

 });









