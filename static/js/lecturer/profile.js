var email;
var profile;
var currentProject;

var array = document.location.href.toString().split("/");
var studentOrlecturer = array[array.length - 1];


$(document).ready(function(){
    profile = JSON.parse(localStorage.getItem(`${studentOrlecturer}_profile`));
    console.log(profile);
    email = profile['email'];
    currentProject = profile['currentProject'];
    $("#name").text(profile['name']);
    $("#dob").text(profile['dob']);
    $("#email").text(profile['email']);
    $("#gender").text(profile['gender']);
})


$(document).on('click', "#save", function(e){
    var name = $("#name").text();
    var dob = $("#dob").text();
    // var github = $("#github").text();
    var gender = $("#gender").text();
    var passwd = $("#password").text();
    console.log(name,dob,email,gender,passwd)
    $.ajax({
            type:'POST',
            url:'/api/change_user_profile',
            contentType: "application/json",
            data:JSON.stringify({
                    'name': name,
                    'dob': dob,
                    'gender': gender,
                    'passwd': passwd
            }),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(email)).token+':')
            },
            success:function(rsp_data){
                console.log(rsp_data);
                $(".alert-success").text("Successfully updated!").show();
                $(".alert-danger").hide();
                getAllInfo(studentOrlecturer);
                window.location.reload();
                setTimeout(function(){
                    $(".alert-success").hide();
                    },3000)
            },
            erro:function(rsp_data){
                console.log(rsp_data);
                $(".alert-danger").text("Oops! Something went wrong!").show();
                $(".alert-success").hide();
                setTimeout(function(){
                    $(".alert-danger").hide();
                    },3000)
            }
        })
})


function getAllInfo(studentOrLecturer){
    return $.ajax({
            type:'POST',
            url:`/api/${studentOrLecturer}_main_info`,
            contentType: "application/json",
            data:JSON.stringify({'project_uuid':currentProject}),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(email)).token+':')
            },
            success(rsp_data){
                        userProfile = rsp_data['user_profile'];
                        localStorage.setItem(`${studentOrLecturer}_profile`, JSON.stringify(userProfile));
                        window.reload();
            }
    })
}



$(document).on('click', ".update", function(e){
    e.preventDefault();
    if($(this).text()=='update'){
    var data_to_update = $(this).siblings();
    // alert($(this).parent().contents().get(0).nodeValue);
    $(this).text('confirm');
    data_to_update.attr('contenteditable', 'true');
    data_to_update.focus();
    }else{
        // alert($(this).siblings().text());
        var data_to_update = $(this).siblings();
        data_to_update.attr('contenteditable', 'false');
        $(this).text('update');
    }
});




