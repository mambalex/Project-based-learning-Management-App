var array = document.location.href.toString().split("/");
var username = array[array.length - 1];
var selfProjectList = JSON.parse(localStorage.getItem(`${username}ProjectList`));
var projectList = JSON.parse(localStorage.getItem("allProjectList"));
var currentProject;


var groupInfo={};
var selfGroup={};
var selfGroupStatus;
var phaseList={};
var taskList={}; //name -> uuid
var allTasks={}; //uuid -> task
var reminderList={};
var userProfile={};
var ungroupedStudents;
var inGroupOrnot;
var currentGroupName;


$(".layer").show();
$(".remove-layer").hide();
$(document).ready(function(){
    getAllInfo();
    displayProjects();
    $(".select-project").show();
})


//select project
$(document).on('click', "#select-project", function(e){
    e.preventDefault();
    currentProject = $(this).siblings('select').val(); //id
    $(".select-project").hide();
    $(".layer").hide();
    getCurrentProjectData();
    welcomeUser();
    $(".phase1-nav").click();
    displayPhaseName();
    displayTasks();
    displayResources();
    displayReminder();
    if(selfGroup["status"]==1){
        displayMarks();
    }
    displayGroupInfo();
    displayDueDate(1);
    displayDueDate(2);
    displayDueDate(3);
    displayDueDate(4);
})

function getCurrentProjectData() {
      selfProjectList.forEach(function (proj) {
        if(proj['project_uuid'] == currentProject){
                groupInfo={};
                selfGroup={};
                phaseList={};
                taskList={}; //name -> uuid
                allTasks={}; //uuid -> task
                reminderList={};
                groupMethod = proj['group_method'];
                if(groupMethod==1){
                    $(".add-group-btn").hide();
                    $(".join").hide();
                    $(".leave").hide();
                }else{
                    $(".add-group-btn").show();
                    $(".join").show();
                    $(".leave").show();
                }
                ungroupedStudents=  proj['ungroup_student'];
                selfGroup = proj['group_info'];
                if(selfGroup['status']==0){
                    inGroupOrnot = 'no'
                }else{
                    inGroupOrnot = 'yes'
                }
                selfGroupStatus = proj['group_info']['status'];
                proj['group_list'].forEach(function(val){
                    groupInfo[val['group_name']]= val;
                });
                proj['phase_list'].forEach(function(val){
                    phaseList[val['phase_name']]= val;
                });
                for(var phase in phaseList){
                    phaseList[phase]['task_list'].forEach(function(task){
                        taskList[task['task_name']] = task['task_uuid'];
                        allTasks[task['task_uuid']] = task;
                    })
                }
                reminderList = proj['reminder_list'];
        }
    })
}

function getAllInfo(){
    $(".clearfix").click();
    return $.ajax({
            type:'POST',
            url:'/api/student_main_info',
            contentType: "application/json",
            data:JSON.stringify({'project_uuid':currentProject}),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            success(rsp_data){
                        console.log(rsp_data);
                        projectList = rsp_data['all_project_list'];
                        selfProjectList = rsp_data['self_project_list'];
                        userProfile = rsp_data['user_profile'];
                        localStorage.setItem('profile', JSON.stringify(userProfile));
            }
    })
}

function welcomeUser(){
    var name = userProfile['name'];
    $(".welcome-user").text(`Welcome ${name}`);
    $(".welcome-user").show();
}


//display phase name
function displayPhaseName() {
    for(var phase in phaseList){
        let idx = phaseList[phase]['phase_index'];
        $(`.p${idx}-name`).text(phase);
    }
}

function displayProjects () {
    //select project popup
    $(".select-project select option").remove();
    selfProjectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $(".select-project select").append(`
                <option value=${id}>${name}</option>
        `)
    });

    //enrolled project navbar
    $(".header .project-dropdown a").remove();
    selfProjectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $(".project-dropdown").append(`
        <a>${name}<span class="id">${id}</span></a>
    `)
    })
     $(".project-dropdown").append(`<a id="enrolNav">Enrol</a>`)

    //navbar click enrol
    $('.enrol select option').remove();
    projectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $('.enrol select').append(`
             <option value=${id}>${name}</option>
        `)
    })
}

//display tasks
function displayTasks() {
    $(".task-selector option").remove();
    for(let task in taskList){
        $(".task-selector").append(`
                <option value=${taskList[task]}>${task}</option>
            `)
    }
    // mark task disctribution
     $("#distribution-selector option").remove();
    $("#distribution-selector").append(`<option value="" hidden>Task Names</option>`)
    for(let task in taskList){
        $("#distribution-selector").append(`
                <option value=${taskList[task]}>${task}</option>
            `)
    }
    $("#distribution-selector").append(`<option value="Final Mark"}>Final Mark</option>`);
}

//display resources
function displayResources(){
    for(var phase in phaseList ){
        let phase_num = phase.split(" ")[1];
        $(`.phase${phase_num}-doc`).find("tbody tr").remove();
        if(phaseList[phase]['resource_list'].length==0){
            $(`.phase${phase_num}-doc`).find("tbody").append(`
                            <tr>
                                  <td>Doc</td>
                                  <td>No files</td>                   
                              </tr>   
            `)
        }
        phaseList[phase]['resource_list'].forEach(function (doc) {
            var num = $(`.phase${phase_num}-doc`).find("tbody tr").length;
            var displayName = doc['filename'];
            var arr = doc['file_addr'].split('/');
            var fileName = arr[arr.length - 1];
            var filePath = `../temp/${fileName}`
            $(`.phase${phase_num}-doc`).find("tbody").append(`
                            <tr>
                                  <td>Doc${num+1}</td>
                                  <td>${displayName}</td>                   
                                  <td align="right">
                                      <a href=${filePath} target="_blank" class="btn btn-success btn-xs view_file">
                                          <span class="glyphicon glyphicon-file"></span>
                                          <span class="hidden-xs files">View</span>
                                      </a>
                                  </td>
                              </tr>   
            `)
        })

    }
}


function displayReminder(){

    console.log(reminderList);
    $(".notes-wrapper li").remove();
    reminderList.forEach(function (val) {
        var date = val['post_time'];
        var text = val['message'];
        $(".notes-wrapper").append(`
                        <li>
                            <div class="content reminder">${text}</div>
                            <div class="line">${date}</div>
                        </li>

        `)
    })
}

function displayGroupInfo(){
    //current group
    $("#members li").remove();
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
        $("#all-groups li").remove();
        console.log(groupInfo);
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
        //display all students that not in a group
        $("#ungrouped tr").remove();
        ungroupedStudents.forEach(function (std) {
            if(std['email']!= username){
                            $("#ungrouped").append(`
                                  <tr class="cans">
                                    <td class="can-left">Candidate 1</td>
                                    <td >${std['name']}</td>
                                    <td align="right">
                                        <a class="btn btn-success btn-xs add-can">
                                            <span class="id">${std['email']}</span>
                                            <span class="glyphicon glyphicon-plus"></span>
                                            <span class="hidden-xs"> Add</span>
                                        </a>
                                    </td>
                                  </tr> 
                `);
            }
        })


}

//display duedate
function displayDueDate(id){
    let phase = "Phase "+id;
    let phaseDueDate = {};
    $(`.due-date${id}`).find("ul li").remove();
    phaseDueDate[`${phase}`] = phaseList[phase]['deadline'];
    phaseList[phase]['task_list'].forEach(function (task) {
        phaseDueDate[`${task['task_name']}`] = task['deadline']
    });
    for(let task in phaseDueDate){
        let d = new Date(phaseDueDate[task]);
        phaseDueDate[task] = d.getTime()/1000;
    }
    let keysSorted = Object.keys(phaseDueDate).sort((a,b) => phaseDueDate[a]-phaseDueDate[b]);
    let now = new Date();
    keysSorted.forEach(function (key) {
        var dayLeft = Math.ceil((phaseDueDate[key] - now.getTime()/1000)/(60 * 60 * 24));
        console.log(dayLeft)
        if(dayLeft <=0 ){
            $(`.due-date${id}`).find("ul").append(`
                          <li>
                              <div class="content">${key}</div>
                              <div class="date"><span class="due"></span>Overdue</div>
                          </li>
            `)
        }else{
            $(`.due-date${id}`).find("ul").append(`
                          <li>
                              <div class="content">${key}</div>
                              <div class="date"><span class="due">${dayLeft}</span> days from now</div>
                          </li>
            `)
        }
    })
}


//display mark
function displayMarks(){
     // p3-mark
        for(var phase in phaseList ){
        let phase_num = phase.split(" ")[1];
        $(`.p${phase_num}-mark`).find("li").remove();
        phaseList[phase]['task_list'].forEach(function (task) {
            var taskName = task['task_name'];
            var markStatus = task['mark_result']['status'];
            var mark = task['mark_result']['mark'];
            if(markStatus=="Marked"){
                $(`.p${phase_num}-mark`).append(`
                    <li><div class="taskName">${taskName}: </div><div class="taskMark">${mark}</div></li>
                `)
            }else{
                $(`.p${phase_num}-mark`).append(`
                     <li><div class="taskName">${taskName}: </div><div class="taskMark">Unmarked</div></li>
                `)
            }
        })

    }
}




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
                        data:JSON.stringify({'project_uuid':currentProject, 'group_name':group_name, 'note':note}),
                        headers:{
                            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
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


//search group members
$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".cans").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


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
        data:JSON.stringify({'project_uuid':currentProject, 'group_uuid':group_uuid}),
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
        },
        }).done(function(rsp_data){
             console.log(rsp_data);
            if(rsp_data['code']==400){
                alert("You already have a group")
            }else{
                currentGroupName = groupName;
                alert("Congrats! you successfully join a group");
                getAllInfo();
                getCurrentProjectData();
                displayGroupInfo();
            //     inGroupOrnot = 'yes';
            //     $(".leave").show();
            //     //change member's number
            //     let num = groupInfo[groupName]["member"].length;
            //     $('.g-popup:contains("'+groupName+'")').siblings(".num-members").find('span').text(++num);
            //     // console.log(groupInfo[groupName]);
            //     // console.log(userInfo);
            //     groupInfo[groupName]['member'].push({name:`${userProfile['name']}`})
            //     var description = groupInfo[groupName]['description'];
            //     var members = groupInfo[groupName]['member'];
            //     selfGroup['group_name'] = currentGroupName;
            //     selfGroup['description'] = description;
            //     selfGroup['member'] = [{email:userProfile['email'],name:userProfile['name']}];
            //     //display in self group part
            //     $("#group-name-own").text(groupName);
            //     $("#group-note-own").text(description);
            //     members.forEach(function(val){
            //          $("#members").append(`<li>${val['name']}</li>`)
            // })

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
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
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
    $(".phase1 .file-input").hide();
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
    $(".phase1 .file-input").hide();
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
    $(".phase1 .file-input").hide();
    $("#successAlert-phase1").hide();
    $("#errorAlert-phase1").hide();
    $("button[type='reset']").click();
});

// click uploading files
$(".upload-nav-1").click( function(){
    $(".notes-wrapper").hide();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documents").hide();
    $(".phase1-mark").hide();
    $(".phase1 .file-input").show();
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
    $(".phase1 .file-input").hide();
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

//click add candidate to group
$(document).on('click', ".add-can", function(e) {
    var email = $(this).find(".id").text();
    if (selfGroup['status'] == 0) {
        alert("You are not in a group!")
        return
    }
    var groupId = selfGroup['group_uuid'];
    $.ajax({
        type: 'POST',
        url: '/api/invite_group',
        contentType: "application/json",
        data: JSON.stringify({'project_uuid': currentProject, 'group_uuid': groupId, 'email': email}),
        async: false,
        headers: {
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token + ':')
        }
        }).done(function (rsp) {
            console.log(rsp);
            if (rsp['code'] == 200) {
                alert("Successfully invited this student");
                getAllInfo();
                getCurrentProjectData();
                displayGroupInfo();
                $(".clearfix").click();
            } else {
                alert("Oops! Something went wrong!");
            }
    })
})


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

//click Phase2
$(".phase2-nav").click( function(){
    $(".notes-wrapper-2").show();
    $(".file-input").hide();
    $(".phase2-doc").hide();
    $(".phase2-mark").hide();
    $("#successAlert-phase2").hide();
    $("#errorAlert-phase2").hide();
    $("button[type='reset']").click();

});



//click uploading files
$(document).on('click', '.upload-nav-2', function(e){
    e.preventDefault();
    $(".phase2-mark").hide();
    $(".notes-wrapper-2").hide();
    $(".phase2-doc").hide();
    $(".requirement").hide();
    $(".file-input").show();
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
    $(".phase2-doc").show();
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
    $(".phase2-doc").hide();
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
    $(".phase3-doc").hide();
    $(".phase3-mark").hide();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
})

//click uploading files
$(document).on('click', '.upload-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").show();
    $(".phase3-doc").hide();
    $(".phase3-mark").hide();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
})

//click resources
$(document).on('click', '.document-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").hide();
    $(".phase3-doc").show();
    $(".phase3-mark").hide();
    $("#successAlert-phase3").hide();
    $("#errorAlert-phase3").hide();
    $("button[type='reset']").click();
})

//click mark
$(document).on('click', '.navmark3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").hide();
    $(".phase3-doc").hide();
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


// //phase 3 upload file
// $("#upload-btn-phase3").click(function(e){
//         e.preventDefault();
//         var uuid = "A52FA206-C967-11E8-989A-4C3275989EF5";
//         var file = $('#upload-file3').find("input[type=file]").prop('files')[0];
//         var formData = new FormData();
//         formData.append('upload_file', file);
//         formData.append('group_uuid', groupInfo[selfGroup['group_name']]['group_uuid']);
//         formData.append('assessment_uuid', uuid);
//         $.ajax({
//             type: 'POST',
//             url: '/api/submit_file',
//             data: formData,
//             contentType: false,
//             cache: false,
//             // enctype: 'multipart/form-data',
//             contentType: false,
//             processData: false,
//             async: false,
//             headers:{
//                 'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
//             }
//         }).done(function(data){
//                 console.log(data);
//                 if(data['code']==200){
//                     $("#successAlert-phase3").text("Successfully uploaded!").show();
//                     $("#errorAlert-phase3").hide();
//                 }else{
//                     $("#errorAlert-phase3").text("File upload fails").show();
//                     $("#successAlert-phase3").hide();
//                 }
//             })
// })

//phase4

//click phase4
$(document).on('click', '.phase4-nav', function(e){
    $(".notes-wrapper-4").show();
    $(".phase4-doc").hide();
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".phase4-mark").hide();
    $(".file-input").hide();
    $("button[type='reset']").click();
})

//click uploading files
$(document).on('click', '.upload-nav-4', function(e){
    $(".notes-wrapper-4").hide();
    $(".phase4-doc").hide();
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".phase4-mark").hide();
    $(".file-input").show();
    $("button[type='reset']").click();
})

//click resources
$(document).on('click', '.document-nav-4', function(e){
    $(".notes-wrapper-4").hide();
     $(".file-input").hide();
     $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".phase4-doc").show();
    $(".phase4-mark").hide();
    $("button[type='reset']").click();
})

//click mark
$(document).on('click', '.navmark4', function(e){
    $(".notes-wrapper-4").hide();
    $(".file-input").hide();
    $(".phase4-doc").hide();
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".phase4-mark").show();
    $("button[type='reset']").click();
})

// click distribution
$(document).on('click', '.distribution', function(e){
    $(".notes-wrapper-4").hide();
    $(".file-input").hide();
    $(".phase4-doc").hide();
    $(".phase4-mark").hide();
    $("#distribution").show();
    $("#distribution2").show();
    $("#select-task-distribution").show();
    $("button[type='reset']").click();
})



// click enrol
$(document).on('click', "#enrolNav", function(e){
    e.stopImmediatePropagation();
    $(".layer").show();
    $(".remove-layer").show();
    $(".enrol").show();
});

$(document).on('click', ".remove-layer", function(e){
    $(".layer").hide();
    $(".enrol").hide();
    $(".select-project").hide();
});


//enrol project
$(document).on('click', "#enrolButton", function(e){
    e.preventDefault();
    var projectId = $(this).siblings('select').val();
    var projectName = $(this).siblings("select").find("option:selected").text();
    $.ajax({
            type:'POST',
            url:'/api/enrol_project',
            contentType: "application/json",
            data:JSON.stringify({'project_uuid':projectId}),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            }
    }).done(function (rsp_data) {
            console.log(rsp_data);
            if(rsp_data['code'] == 200){
                 console.log(rsp_data);
                 alert('Successfully enrolled')
                 getAllInfo();
                 getCurrentProjectData();
                 displayProjects();
            }else if(rsp_data['code'] == 400){
                alert("Already enrol in this project!");
            }
    })

})




function displayProjects () {
    //select project popup
    $(".select-project select option").remove();
    selfProjectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $(".select-project select").append(`
                <option value=${id}>${name}</option>
        `)
    });

    //enrolled project navbar
    $(".header .project-dropdown a").remove();
    selfProjectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $(".project-dropdown").append(`
        <a>${name}<span class="id">${id}</span></a>
    `)
    })
     $(".project-dropdown").append(`<a id="enrolNav">Enrol</a>`)

    //navbar click enrol
    $('.enrol select option').remove();
    projectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $('.enrol select').append(`
             <option value=${id}>${name}</option>
        `)
    })

}


//upload files
$(document).on('click', ".upload-btn", function(e){
        e.preventDefault();
        var btn = $(this);
        var taskId = $(this).closest('.file-input').find(".task-selector").val();
        var file = $(this).closest('.file-input').find("input[type=file]").prop('files')[0];
        if(inGroupOrnot=="no" || selfGroup["status"]==0){
            alert("Sorry, you have no group!")
            return
        }
        if(!taskId || !file){
            alert('Wrong input')
            return
        }
        btn.addClass("running");
        var formData = new FormData();
        formData.append('upload_file', file);
        formData.append('group_uuid', groupInfo[selfGroup['group_name']]['group_uuid']);
        formData.append('assessment_uuid', taskId);
        $.ajax({
            type: 'POST',
            url: '/api/submit_file',
            data: formData,
            contentType: false,
            cache: false,
            contentType: false,
            processData: false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                   btn.removeClass("running");
                   alert("Oops! Something went wrong!")

            }
        }).done(function(data){
                console.log(data);
                btn.removeClass("running");
                if(data['code']==200){
                    alert("Successfully uploaded!");
                     setTimeout(function(){
                         btn.siblings("button").click();
                     },2000)
                }else{
                     alert("File upload fails!")
                     setTimeout(function(){
                         btn.siblings("button").click();
                     },2000)
                }
            })

})

//switch project
$(document).on('click', ".project-dropdown a", function(e){
    let id = $(this).find('.id').text();
    currentProject = id;
    getAllInfo();
    getCurrentProjectData();
    welcomeUser();
    $(".phase1-nav").click();
    displayPhaseName();
    displayTasks();
    displayResources();
    displayReminder();
    displayGroupInfo();
    displayDueDate(1);
    displayDueDate(2);
    displayDueDate(3);
    displayDueDate(4);
})


//distribution
//distribution
$(document).on('change', '#distribution-selector', function(){
    var taskId = $("#distribution-selector").val();
    console.log(taskId);
    if(taskId != "Final Mark"){
        for( var id in allTasks){
            if(id==taskId){
                var markDitribution1 = allTasks[id]['mark_distribution1'];
                var markDitribution2 = allTasks[id]['mark_distribution2'];
                console.log(markDitribution1);
                console.log(markDitribution2);
                markDitribution1["ti"]
                var myChart = echarts.init(document.getElementById('distribution'));
                myChart.setOption(markDitribution1);
                var myChart2 = echarts.init(document.getElementById('distribution2'));
                myChart2.setOption({series:[markDitribution2]});
            }
        }

    }else{
         selfProjectList.forEach(function (proj) {
             if(proj['project_uuid'] == currentProject){
                  var markDitribution1 = proj["mark_distribution1"];
                  var markDitribution2 = proj["mark_distribution2"];
                  var myChart = echarts.init(document.getElementById('distribution'));
                  myChart.setOption(markDitribution1);
                  var myChart2 = echarts.init(document.getElementById('distribution2'));
                  myChart2.setOption({series:[markDitribution2]});
             }
        })
    }
})



var myChart = echarts.init(document.getElementById('distribution'));
var option = {
            title: {
                text: 'Mark Distribution'
            },
            tooltip: {},
            legend: {
                data:['Mark']
            },
            xAxis: {
                data: ["50-","50-60","60-70","70-80","80-90","90+"]
            },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                itemStyle: {color: '#d9534f'},
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

myChart.setOption(option);

var myChart2 = echarts.init(document.getElementById('distribution2'));
myChart2.setOption({
    series : [
        {
            roseType: 'angle',
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            stillShowZeroSum:false,
            data:[
                {value:235, name:'50-'},
                {value:235, name:'50-60'},
                {value:274, name:'60-70'},
                {value:310, name:'70-80'},
                {value:335, name:'80-90'},
                {value:400, name:'90+'}
            ]
        }
    ]
})


//chat bot
$('#live-chat header').on('click', function() {
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');

});

$('.chat-close').on('click', function(e) {
    e.preventDefault();
    $('#live-chat').fadeOut(300);

});

//chat bot

//add message to chat window
function addMessage(msg, botOrUser){
    if(botOrUser == "bot"){
            $(".chat-history").append(`       
                        <div class="chat-message clearfix">
                          <div class="chat-message-content clearfix">
                            <h5>Bot</h5>
                            <p>${msg}</p>
                          </div>
                    </div><hr>`
            );
    }else{
        $(".chat-history").append(`       
                                <div class="chat-message clearfix userChat">
                                      <div class="chat-message-content clearfix">
                                        <p>${msg}</p>
                                      </div>
                                </div>
                                <hr>`);
    }
    var d = $('.chat-history');
    d.scrollTop(d.prop("scrollHeight"));
}


var reminderOrnot = "no";
//get answer
function getChatBotAnswer(msg){
            var answer;
            $.ajax({
            type:'POST',
            url:'/api/chatbot',
            contentType: "application/json",
            // async:false,
            data:JSON.stringify({'msg':msg,'project_uuid':currentProject}),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            success(rsp_data){
                console.log(rsp_data);
                if(rsp_data["action"]=='reminder'){
                    answer = "Emm.."
                }else{
                    answer = rsp_data['reply'];
                }
                addMessage(answer,"bot");
            }
             })
}



$(document).on("keypress", "#chatbotInput", function(e){
    //press enter
    if(e.which == 13){
        e.preventDefault();
        var msg = $("#chatbotInput").val();
        $("#chatbotInput").val("");
        addMessage(msg,"user");
        getChatBotAnswer(msg);
    }
});