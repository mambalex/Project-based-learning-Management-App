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
    }).done(function(rsp_data){
        console.log(rsp_data);
        var status = rsp_data['code'];
        if(status == '201'){
            $('#successAlert2').text("Successfully sign up").show();
            $('#errorAlert2').hide();
            setTimeout(function(){ 
               $(".signup").hide();
               $(".login").fadeIn("slow"); 
            }, 2000);
        }else if(status == '400'){
            $('#errorAlert2').text(rsp_data['msg']).show();
            $('#successAlert2').hide();
        }

    })
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
    }).done(function(rsp_data){
        console.log(rsp_data);
        var status = rsp_data['code'];
        var user_type = rsp_data['user_type'];
        var userId = rsp_data['user_id'];
        if(status == '200'){
            $('#successAlert').text("Successfully login").show();
            $('#errorAlert').hide();
            // 
            setTimeout(function(){ 
                if(user_type == 'student'){
                    localStorage.setItem(`${userId}ProjectList`, JSON.stringify(rsp_data['self_project_list']));
                    localStorage.setItem("allProjectList", JSON.stringify(rsp_data['all_project_list']));
                    localStorage.setItem(userId, JSON.stringify(rsp_data));
                    window.location.pathname = `./student/${userId}`;
                }else{
                    localStorage.setItem(`${userId}ProjectList`, JSON.stringify(rsp_data['self_project_list']));
                    localStorage.setItem(userId, JSON.stringify(rsp_data));
                     window.location.pathname = `./lecturer/${userId}`;
                }
             },1500)
        }else if(status == '400'){
            $('#errorAlert').text(rsp_data['msg']).show();
            $('#successAlert').hide();
        }
    })

 });









