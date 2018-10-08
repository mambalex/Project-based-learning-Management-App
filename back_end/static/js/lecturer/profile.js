$(document).on('click', ".update", function(e){
    e.preventDefault();
    if($(this).text()=='update'){
    var data_to_update = $(this).siblings();
    // alert($(this).parent().contents().get(0).nodeValue);
    $(this).text('comform');
    data_to_update.attr('contenteditable', 'true');
    data_to_update.focus();
    }else{
        // alert($(this).siblings().text());
        var data_to_update = $(this).siblings();
        data_to_update.attr('contenteditable', 'false');
        $(this).text('update');
    }
});



$(document).ready(function(){
    var profile = JSON.parse(localStorage.getItem('profile'));
    console.log(profile);
    $("#name").text(profile['name']);
    $("#dob").text(profile['dob']);
    $("#email").text(profile['email']);
    $("#gender").text(profile['gender']);
})


$(document).on('click', "#save", function(e){
    var name = $("#name").text();
    var dob = $("#dob").text();
    var github = $("#github").text();
    var gender = $("#gender").text();
    var passwd = $("#password").text();
    // console.log(name,dob,email,gender,passwd)
    $.ajax({
            type:'POST',
            url:'/api/change_user_profile',
            contentType: "application/json",
            data:JSON.stringify({
                    'name': name,
                    'dob': dob,
                    'gender': gender,
                    // 'passwd': passwd
            }),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
            },
            success(rsp_data){
                console.log(rsp_data)
                alert("sucessfully updated!")
            }
        })
})









