var projectList;
const projectId = "A5259728-C967-11E8-8220-4C3275989EF5";
var groupInfo={};
var selfGroup={};
var selfGroupStatus;
var userInfo={};
var phaseList={};
var reminderList={};
var projectInfo={};
var userProfile={};
var inGroupOrnot;
var currentGroupName;

// $(".loaders").hide();

$(document).ready(function(){
    getAllInfo();
    $(".loaders").hide();
    $(".phase1-nav").click();
    displayReminder();
    displayGroupInfo();
    displayDeadline(1);
    displayDeadline(2);
    displayDeadline(3);
    displayDeadline(4);
})




function getAllInfo(){
    return $.ajax({
            type:'POST',
            url:'/api/student_main_info',
            contentType: "application/json",
            data:JSON.stringify({'project_uuid':projectId}),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
            },
            success(rsp_data){
                        console.log(rsp_data);
                        selfGroup = rsp_data['group_info'];  
                        selfGroupStatus = rsp_data['group_info']['status']
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
                        console.log(selfGroup)
                        console.log(groupInfo)       
                        console.log(phaseList)       
                        console.log(projectInfo)       
                        console.log(userProfile)       
            }
    })
}

function displayReminder(){
    var max = 0;
    var latestReminder;
    console.log(reminderList);
    var reminderTimeList = Object.keys(reminderList);
    reminderTimeList.forEach(function(val){
        var temp = new Date(val);
        var timeSTamp = temp.getTime();
        if(timeSTamp > max){
            max = timeSTamp;
            latestReminder = val;
        }
    })
    console.log(latestReminder);
    var latestMessage = reminderList[latestReminder];
    console.log(latestMessage);
    var temp = new Date(latestReminder);
    var now = new Date();
    var daypass = Math.ceil((now.getTime()/1000 - temp.getTime()/1000)/(60 * 60 * 24));
    $(".reminder").text(latestMessage);
    $(".daypass").text(daypass);


}

function displayGroupInfo(){
    //current group
    if(selfGroupStatus==1){
            inGroupOrnot = 'yes';
            $(".leave").show();
            var description = selfGroup['description'];
            currentGroupName = selfGroup['group_name'];
            var members = selfGroup['member'];
            $("#group-name-own").text(currentGroupName);
            $("#group-note-own").text(description);
            members.forEach(function(val){
                 $("#members").append(`<li>${val['name']}</li>`)
            })
        }else if(selfGroupStatus==0){
                inGroupOrnot = 'no';
                $(".leave").hide();
                $("#group-name-own").text("You have not group");
        }
    // all groups
        for(var key in groupInfo){
            var val = groupInfo[key];
            var groupId = val['group_uuid'];
            var groupName = val['group_name'];
            var description = val['description'];
            var members = val['member'];
            var group_uuid = val['group_uuid']          
            if(members.length !==0){
                 $("#all-groups").append(`<li><div class="title g-popup">${groupName}</div><div class="description">${description}</div><div class="num-members">Members: <span>${members.length}</span></div><div class="join">Join</div> </li>`)
            }
        }
}
function displayDeadline(id){
    var phase = "Phase "+id;
    let allDeadlines = {};
    //phase deadline
    var d = new Date();
    var phase1Due = phaseList[phase]['deadline'].split(" ")[0];
    var newD = new Date(phase1Due);
    console.log(d.getTime(), newD.getTime());
    var phase1left = Math.ceil((newD.getTime()/1000 - d.getTime()/1000)/(60 * 60 * 24));
    allDeadlines[phase1left] = [phase];
    console.log(allDeadlines);

    //task deadline
    var taskList = phaseList[phase]['task_list'];
    console.log(taskList);
    taskList.forEach(function(val){
        var taskDeadline = val['deadline'].split(" ")[0];
        var taskName = val['task_name'];
        var taskId = val['task_uuid'];
        var d = new Date();
        var taskD = new Date(taskDeadline);
        var taskleft = Math.ceil((taskD.getTime()/1000 - d.getTime()/1000)/(60 * 60 * 24));
        if(taskleft in allDeadlines){
            allDeadlines[taskleft].push(taskName);
        }else{allDeadlines[taskleft] = [taskName];}
        
    })
    console.log(allDeadlines);
    var deadlines = Object.keys(allDeadlines);
    deadlines.sort(function(a, b){return a - b});
    deadlines.forEach(function(left){
        allDeadlines[left].forEach(function(val){
            // var temp = `.${phase}`;
            // console.log(temp);
            $(`.phase${id}`).find(".all-dealines").append(`<li >
                              <div class='content'>${val}</div>
                              <div class='date'><span class="due">${left}</span> days from now</div>
                          </li>`);
        })
    })
}


// function setProfileCookie(){
//     setCookie('name', userProfile['name'], 1, "/");
//     setCookie('dob', userProfile['dob'], 1, "/");
//     setCookie('gender', userProfile['gender'], 1, "/");
//     setCookie('email', userProfile['email'], 1, "/");
// }

// function setCookie(cname, cvalue, exdays, path) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     var expires = "expires="+ d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
// }

// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(';');
//     for(var i = 0; i <ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }






// phase1

//reminder





//deadline

// var myDate="26-02-2012";
// myDate=myDate.split("-");
// var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
// alert(new Date(newDate).getTime()); //w
// var d = new Date();
// var phase1Due = phaseList['Phase 1']['deadline'];
// var dueTimeStamp = Date.parse(phase1Due);
// var diff = new Date(dueTimeStamp - d.getTime());
// var daysLeft = diff.getUTCDate()-1;
// console.log('days left: ',daysLeft)
// $(".phase1-due").


//click logout
$("#logout").click(function(){
     window.location.pathname = "/";
})
// side-nav





// create new group
$(document).on('click', '#group-save', function(e){
        e.preventDefault();
        var createOrSearch = 'create';
        if($(".searchCan").hasClass("active")){
            createOrSearch = 'search';
        }
        if(inGroupOrnot=="yes"){
            $("#errorAlert-create-group").text("You already got a group").show();
            $("#successAlert-create-group").hide();
            $(".leave").show();
            return
        }

        if(createOrSearch=="create"){
                    var group_name =$("#new-group-name").val();
                    var note = $("#new-group-note").val();
                    $.ajax({
                        type:'POST',
                        url:'/api/create_group',
                        contentType: "application/json",
                        data:JSON.stringify({'project_uuid':projectId, 'group_name':group_name, 'note':note}),
                        headers:{
                            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
                        },
                        }).done(function(rsp_data){
                            console.log(rsp_data)
                            if(rsp_data['code']==200){
                                currentGroupName = group_name;
                                selfGroup['group_name'] = currentGroupName;
                                selfGroup['description'] = note;
                                selfGroup['member'] = [{email:userProfile['email'],name:userProfile['name']}];
                                groupInfo[group_name] = {group_uuid: `${rsp_data['group_uuid']}`, group_name: `${group_name}`,member:[{name:`${userProfile['name']}`}]};
                                console.log(selfGroup)
                                console.log(groupInfo);
                                //display in all group
                                $("#all-groups").append(`<li><div class="title g-popup">${group_name}</div><div class="description">${note}</div><div class="num-members">Members: <span>1</span></div><div class="join">Join</div> </li>`);
                                // display in current group
                                $("#group-name-own").text(group_name);
                                $("#group-note-own").text(note);
                                $("#members").append(`<li>${userProfile['name']}</li>`);
                                $("#successAlert-create-group").text("Sucessfully create a group!").show();
                                $("#errorAlert-create-group").hide();
                                inGroupOrnot = 'yes';
                                $(".leave").show();
                                setTimeout(function(){
                                        $(".cancel-group").click();
                                },2000)
                                }
                        });
        }
})


// join a group
$(document).on('click', '.join', function(e){
        e.preventDefault();
        console.log("in group: "+inGroupOrnot)
        var groupName = $(this).siblings('.title').text();
        var group_uuid = groupInfo[groupName]['group_uuid'];
        if(inGroupOrnot=="yes"){
            alert("You already have a group");
            $(".leave").show();
            return
        }
        $.ajax({
        type:'POST',
        url:'/api/join_group',
        contentType: "application/json",
        data:JSON.stringify({'project_uuid':projectId, 'group_uuid':group_uuid}),
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        }).done(function(rsp_data){
            if(rsp_data['code']==400){
                alert("You already have a group")
            }else{
                currentGroupName = groupName;
                alert("Congrats! you successfully join a group");
                inGroupOrnot = 'yes';
                $(".leave").show();
                //change member's number
                let num = groupInfo[groupName]["member"].length;
                $('.g-popup:contains("'+groupName+'")').siblings(".num-members").find('span').text(++num);
                // console.log(groupInfo[groupName]);
                // console.log(userInfo);
                groupInfo[groupName]['member'].push({name:`${userProfile['name']}`})
                var description = groupInfo[groupName]['description'];
                var members = groupInfo[groupName]['member'];
                selfGroup['group_name'] = currentGroupName;
                selfGroup['description'] = description;
                selfGroup['member'] = [{email:userProfile['email'],name:userProfile['name']}];
                //display in self group part
                $("#group-name-own").text(groupName);
                $("#group-note-own").text(description);
                members.forEach(function(val){
                     $("#members").append(`<li>${val['name']}</li>`)
            })

            }
        })
});


//leave a group
$(document).on('click', '.leave', function(e){
        e.preventDefault();
        var groupName = $("#group-name-own").text();
        var group_uuid = groupInfo[groupName]['group_uuid'];
        if(inGroupOrnot == "no"){
            return
        }
        console.log(groupInfo)
        $.ajax({
            type:'POST',
            url:'/api/leave_group',
            contentType: "application/json",
            data:JSON.stringify({'group_uuid':group_uuid}),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
            },
            }).done(function(rsp_data){
                        currentGroupName = "None";
                        console.log(rsp_data)
                        inGroupOrnot = 'no';
                        $(".leave").hide();
                        $("#group-name-own").text("You have not group");
                        $("#group-note-own").text("");
                        $("#members").find("li").remove(); 
                        selfGroup = {};          
                        groupInfo[groupName]['member'].forEach(function(item, index, object) {
                                  if (item['name'] === userProfile['name']) {
                                        object.splice(index, 1);
                                  }
                        });
                        let num = groupInfo[groupName]["member"].length;
                        // console.log(num);
                        // console.log(groupInfo[groupName]["member"]);
                        if(num==0){
                            $('.g-popup:contains("'+groupName+'")').parent().remove();
                        }else{$('.g-popup:contains("'+groupName+'")').siblings(".num-members").find('span').text(num);}
            })
});



//phase 1 upload files
$("#upload-btn-phase1").click(function(e){
        e.preventDefault();
        var uuid = "A529FD7A-C967-11E8-A7BE-4C3275989EF5";
        var file = $('#upload-file1').find("input[type=file]").prop('files')[0];
        console.log(file);
        console.log(uuid);
        var formData = new FormData();
        formData.append('upload_file', file);
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



//click Phase1
$(".phase1-nav").click( function(){
    $(".notes-wrapper").show();
    $(".due-date").show();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documents").hide();
    $(".phase1-mark").hide();
    $("#phase1-upload").hide();
    $("#successAlert-phase1").hide();
    $("#errorAlert-phase1").hide();
    $("button[type='reset']").click();
});

// click group
$(document).on('click', '.navgrp', function(e){
    $(".notes-wrapper").hide();
    $(".documents").hide();
    $(".group-info").show();
    $(".add-group").show();
    $(".all-groups").show();
    $(".phase1-mark").hide();
    $("#phase1-upload").hide();
    $("#successAlert-phase1").hide();
    $("#errorAlert-phase1").hide();
    $("button[type='reset']").click();
});


//click Documents
$(".document").click( function(){
    $(".notes-wrapper").hide();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documents").show();
    $(".phase1-mark").hide();
    $("#phase1-upload").hide();
    $("#successAlert-phase1").hide();
    $("#errorAlert-phase1").hide();
    $("button[type='reset']").click();
});

// click proposal
$(".nav-proposal").click( function(){
    $(".notes-wrapper").hide();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documents").hide();
    $(".phase1-mark").hide();
    $("#phase1-upload").show();
    $("#successAlert-phase1").hide();
    $("#errorAlert-phase1").hide();
    $("button[type='reset']").click();
});

//click mark
$(".navmark1").click(function(){
    $(".notes-wrapper").hide();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documents").hide();
    $(".phase1-mark").show();
    $("#phase1-upload").hide();
    $("#successAlert-phase1").hide();
    $("#errorAlert-phase1").hide();
    $("button[type='reset']").click();
})

// group

// click-add-group
$(document).on('click', '.add-group', function(e){
    e.preventDefault();
    $(".group_container").show();
    $(".add-group").hide();
    $("#errorAlert-create-group").hide();
    $("#successAlert-create-group").hide();
});

// click cancel
$(document).on('click', '.cancel-group', function(e){
    e.preventDefault();
    $(".group_container").hide();
    $(".add-group").show();
});

//click search
$("document").on('click', '#add-candidates', function(e){
    alert("hhh");
    $("#group-candidate").text("Search for candidates");
    $("#group-candidate-msg").text("Use the form below to search candidates");
});


//click group name popup
$(document).on('click', '.g-popup', function(e){
    e.preventDefault();
    var group_name = $(this).text();
    // console.log(group_name)
    // console.log(groupInfo)
    let description = groupInfo[group_name]['description']
    let members = groupInfo[group_name]['member']
    $(".group-popup").find(".group-name").text(group_name);
    $(".group-popup").find(".note").text(description);
    $(".group-popup").find(".all-members").children().remove();
    members.forEach(function(val){
         $(".group-popup").find(".all-members").append(`<li>${val['name']}</li>`)
    })
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


//phase 2 upload files
$("#upload-btn-phase2").click(function(e){
        e.preventDefault();
        var uuid;
        var designUuid = '2733B150-C9EA-11E8-94AC-4C3275989EF5';
        var rqmUuid = 'A52CF4BE-C967-11E8-8B38-4C3275989EF5';
        if ($("#phase2-upload").find('.design').css('display')=="none"){
            uuid = rqmUuid;
        }else{ uuid = designUuid;}
        var file = $('#upload-file2').find("input[type=file]").prop('files')[0];
        console.log(file);
        console.log(uuid);
        var formData = new FormData();
        formData.append('upload_file', file);
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
                    $("#successAlert-phase2").text("Successfully uploaded!").show();
                    $("#errorAlert-phase2").hide();
                }else{
                    $("#errorAlert-phase2").text("File upload fails").show();
                    $("#successAlert-phase2").hide();
                }
            })
        
})



//side-nav

//click Phase2
$(".phase2-nav").click( function(){
    $(".notes-wrapper-2").show();
    $(".file-input").hide();
    $(".document-2").hide();
    $(".phase2-mark").hide();
    $("#successAlert-phase2").hide();
    $("#errorAlert-phase2").hide();
    $("button[type='reset']").click();

});

//click requirement document
$(document).on('click', '.nav-requirement', function(e){
    e.preventDefault();
    $(".phase2-mark").hide();
    $(".notes-wrapper-2").hide();
    $(".document-2").hide();
    $(".design").hide();
    $(".requirement").show();
    $(".file-input").show();
    $("#successAlert-phase2").hide();
    $("#errorAlert-phase2").hide();
    $("button[type='reset']").click();
    
})

//click design document
$(document).on('click', '.nav-design', function(e){
    e.preventDefault();
    $(".phase2-mark").hide();
    $(".notes-wrapper-2").hide();
    $(".document-2").hide();
    $(".requirement").hide();
    $(".file-input").show();
    $(".design").show(); 
    $("#successAlert-phase2").hide();
    $("#errorAlert-phase2").hide();
    $("button[type='reset']").click();
})

//click resources
$(document).on('click', '.document', function(e){
    e.preventDefault();
    $(".file-input").hide();
    $(".notes-wrapper-2").hide();
    $(".requirement").hide();
    $(".design").hide();
    $(".phase2-mark").hide();
    $(".document-2").show();
    $("#successAlert-phase2").hide();
    $("#errorAlert-phase2").hide();
    $("button[type='reset']").click();
})

//click mark
$(document).on('click', '.navmark2', function(e){
    e.preventDefault();
    $(".file-input").hide();
    $(".notes-wrapper-2").hide();
    $(".requirement").hide();
    $(".design").hide();
    $(".document-2").hide();
    $(".phase2-mark").show();
    $("#successAlert-phase2").hide();
    $("#errorAlert-phase2").hide();
    $("button[type='reset']").click();
})


//phase 3

//click phase3
$(document).on('click', '.phase3-nav', function(e){
    $(".notes-wrapper-3").show();
    $(".file-input").hide();
    $(".document-3").hide();
    $(".phase3-mark").hide();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
})

//click uploading files
$(document).on('click', '.upload-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").show();
    $(".document-3").hide();
    $(".phase3-mark").hide();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
})

//click resources
$(document).on('click', '.document-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").hide();
    $(".document-3").show();
    $(".phase3-mark").hide();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
})

//click mark
$(document).on('click', '.navmark3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").hide();
    $(".document-3").hide();
    $(".phase3-mark").show();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
});

//click add input
$(document).on('click', '.add-input', function(e){
    $("#upload-file3").append(`<div class="input-group inputFile" >
                            <input type="text"   class="form-control" placeholder='Choose a file...' />
                            <span class="input-group-btn">
                            <button class="btn btn-default btn-choose" type="button">Choose</button>
                            </span>
                            <div class="remove-input"><i class="fas fa-minus-circle fa-2x"></i></div>
                        </div>`)
})
//click remove btn
$(document).on('click', '.remove-input', function(e){
    $(this).parent().remove();
})


//phase 3 upload file
$("#upload-btn-phase3").click(function(e){
        e.preventDefault();
        var uuid = "A52FA206-C967-11E8-989A-4C3275989EF5";
        var file = $('#upload-file3').find("input[type=file]").prop('files')[0];
        var formData = new FormData();
        formData.append('upload_file', file);
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
                    $("#successAlert-phase3").text("Successfully uploaded!").show();
                    $("#errorAlert-phase3").hide();
                }else{
                    $("#errorAlert-phase3").text("File upload fails").show();
                    $("#successAlert-phase3").hide();
                }
            })
})

//phase4

//click phase4
$(document).on('click', '.phase4-nav', function(e){
    $(".notes-wrapper-4").show();
    $(".document-4").hide();
    $(".phase4-mark").hide();
    $("button[type='reset']").click();
})

//click resources
$(document).on('click', '.document-nav-4', function(e){
    $(".notes-wrapper-4").hide();
    $(".document-4").show();
    $(".phase4-mark").hide();
    $("button[type='reset']").click();
})

//click mark
$(document).on('click', '.navmark4', function(e){
    $(".notes-wrapper-4").hide();
    $(".document-4").hide();
    $(".phase4-mark").show();
    $("button[type='reset']").click();
})









