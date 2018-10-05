// $("#profile").on('click', function(e){
//     e.preventDefault();
//     window.location.pathname = "./profile";})
    // $.ajax({
    //     type:'POST',
    //     url:'/api/login',
    //     headers: {
    //         'Authorization': 'Basic ' + btoa(email + ':' + passwd)
    //     },
    //     success:function (rsp_data) {
    //         console.log(rsp_data);
    //         $('#successAlert').text("successfully log in!").show();
    //         $('#errorAlert').hide();

    //         localStorage.setItem('token', JSON.stringify(rsp_data))
    //         console.log(JSON.parse(localStorage.getItem('token')));
    //         setTimeout(function(){ 
    //            if(rsp_data.user_type == 2){
    //             window.location.href = "./student";
    //         }else if(rsp_data.user_type == 0){
    //             window.location.pathname = "./lecturer";
    //         } }, 3000);
    //     },
    //     error:function (rsp_data) {
    //         console.log(rsp_data);
    //         $('#errorAlert').text(data.error).show();
    //         $('#successAlert').hide();
    //     }
    // });
// })




// phase1

// side-nav

function getProjectList(){
    var projectList;
    $.ajax({
        type:'POST',
        url:'/api/get_self_project_list',
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        success(rsp_data){
            console.log(rsp_data);
            projectList = rsp_data['data'];
        }
    })
    return projectList;
}

function getSelfGroup(projId){
        $.ajax({
        type:'POST',
        url:'/api/current_group',
        data:projId,
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
    }).done(function(rsp_data){
        if(rsp_data['code']==200){
            var description = rsp_data['data']['description'];
            var groupName = rsp_data['data']['group_name'];
            var members = rsp_data['data']['memeber'];
            $("#group-name-own").val(groupName);
            $("#group-note-own").val(description);
            members.forEach(function(val){
                 $("#memebers").append(`<li>${val['name']}</li>`)
            })
        }})
}

function getGroupList(projId){
        $.ajax({
        type:'POST',
        url:'/api/get_group_list',
        data:projId,
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
    }).done(function(rsp_data){
        if(rsp_data['code']==200){
            var groupId = rsp_data['data']['group_uuid'];
            var groupName = rsp_data['data']['group_name'];
            var members = rsp_data['data']['memeber'];
            
           
        }})   
}

// click group
$(document).on('click', '.navgrp', function(e){
    $(".notes-wrapper").hide();
    $(".documenets").hide();
    $(".group-info").show();
    $(".add-group").show();
    $(".all-groups").show();
    var projectList = getProjectList();
    var projectId = projectList[0]['project_uuid']
    getSelfGroup(projectId);

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