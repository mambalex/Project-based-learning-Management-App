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
    var password = $('.signup-password').val();
    var confirmPassword = $('.comfirm-password').val();
    var userType = $('#user-type').val();
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
        user_type: $('#user-type').val(),
        email: $('.signup-email').val(),
        passwd: $('.signup-password').val(),
    };
    // console.log(data);
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
        success:function (rsp_data) {
            console.log(rsp_data);
            $('#successAlert').text("successfully log in!").show();
            $('#errorAlert').hide();

            localStorage.setItem('token', JSON.stringify(rsp_data));
            console.log(JSON.parse(localStorage.getItem('token')).token);
            setTimeout(function(){ 
                window.location.pathname = "./student";},3000);
               // if(rsp_data.user_type == 2){

               //      $.ajax({
               //          type:'GET',
               //          url: '/student',
               //          headers: {
               //              'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
               //          },
               //      success:function (rsp_data){
               //          console.log(rsp_data);
               //       }
               //       })
               //      }else if(rsp_data.user_type == 0){
               //      window.location.pathname = "./lecturer";
               //  } }, 3000);
        },
        error:function (rsp_data) {
            console.log(rsp_data);
            $('#errorAlert').text(data.error).show();
            $('#successAlert').hide();
        }
    });

 });









