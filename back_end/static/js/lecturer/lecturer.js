const projectId = "A5259728-C967-11E8-8220-4C3275989EF5";
var userInfo={};
var reminderList={};
var projectInfo={};
var phaseList={};
var groupInfo={};
var currentPhase;

$(document).ready(function(){
    getAllInfo();
    $(".loaders").hide();
    welcomeUser();
    $(".active").click();
})

//logout
$("#logout").click(function(){
     window.location.pathname = "/";
})

//view files
$(".files").on('click',function(){
    
})

//set Dateline
$(".saveDeadline").on('click',function(){
    var month = $(".text-info").text().split(" ")[1];
    var day = $(".text-info").text().split(" ")[2].slice(0, -1);
    var year = $(".text-info").text().split(" ")[3];
    month = getMonthFromString(month);
    console.log(`${year}-${month}-${day}`);
})


function getMonthFromString(mon){
    var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
    ];
    return months.indexOf(mon) + 1
}



function getAllInfo(){
    return $.ajax({
            type:'POST',
            url:'/api/lecturer_main_info',
            contentType: "application/json",
            data:JSON.stringify({'project_uuid':projectId}),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
            },
            success(rsp_data){
                        console.log(rsp_data);
                        // selfGroup = rsp_data['group_info'];  
                        // selfGroupStatus = rsp_data['group_info']['status']
                        rsp_data['group_list'].forEach(function(val){
                            groupInfo[val['group_name']]= val;
                        });   
                        rsp_data['phase_list'].forEach(function(val){
                            phaseList[val['phase_name']]= val;
                        }); 
                        rsp_data['reminder_list'].forEach(function(val){
                            reminderList[val['post_time']] = val['message'];
                        });
                        projectInfo = rsp_data['project_info'];
                        userProfile = rsp_data['user_profile']; 
                        localStorage.setItem('profile', JSON.stringify(userProfile));
                        console.log(groupInfo)       
                        console.log(phaseList)       
                        console.log(projectInfo)       
                        console.log(userProfile)       
            }
    })
}



function welcomeUser(){
    var name = userProfile['name'];
    $(".welcome-user").text(`Welcome ${name} `);
    $(".welcome-user").show();
}






//phase 1

//only one checkbox be selected 
$('input.generate-group').on('change', function() {
    $('input.generate-group').not(this).prop('checked', false);  
});


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
    $(".new_note").css('display','inline-block')
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

//upload file

$(document).on('click', '.phase1-upload', function(e){
        e.preventDefault();
        var title = $(".phase1-title").val();
        var description = $("#phase1-description").val();
        var file = $('#phase1-file').find("input[type=file]").prop('files')[0];

        var formData = new FormData();
        formData.append('upload_file', file);
        // formData.append('description', description);
        // formData.append('title', title);
        formData.append('group_uuid', groupInfo[selfGroup['group_name']]['group_uuid']);
        formData.append('assessment_uuid', uuid);
        $.ajax({
            type: 'POST',
            url: '/api/submit_file',
            data: formData,
            contentType: false,
            cache: false,
            // enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            async: false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    $("#successAlert-phase1").text("Successfully uploaded!").show();
                    $("#errorAlert-phase1").hide();
                }else{
                    $("#errorAlert-phase1").text("File upload fails").show();
                    $("#successAlert-phase1").hide();
                }
            })
})


//new reminder
$(".new_note").find('.btn-info').on('click',function(){
    var msg = $(".new-reminder-msg").val();
    var task = $("#task-select").val();
    var groupType = $("#group-select").val();
    console.log(msg, task, groupType)
})













