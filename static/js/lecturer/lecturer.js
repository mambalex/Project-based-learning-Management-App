var array = document.location.href.toString().split("/");
var username = array[array.length - 1];
var selfProjectList = JSON.parse(localStorage.getItem(`${username}ProjectList`));
var currentProject; //id
var reminderList={};
var groupList;
var projectInfo={};
var phaseList={};
var taskList={}; //name -> uuid
var allTasks={}; //uuid -> task
var groupInfo={};
var currentPhase;



$(".layer").show();
$(".remove-layer").hide();
// $(".clearfix").click();
$(document).ready(function(){
    getAllInfo();
    displayProjects();
    $(".clearfix").click();
    $(".select-project").show();
})

//select project
$(document).on('click', "#select-project", function(e){
    e.preventDefault();
    currentProject = $(this).siblings('select').val(); //id
    displayCurrentProject();
    $(".select-project").hide();
    $(".layer").hide();
    getCurrentProjectData();
    welcomeUser();
    $(".active").click();
    displayPhaseName();
    displayAllReminder();
    displayGroupInfo();
    displayTasks();
    displayResources();
    displayMarking();
    displayDueDate(1);
    displayDueDate(2);
    displayDueDate(3);
    displayDueDate(4);
})

function getAllInfo(){
    return $.ajax({
            type:'POST',
            url:'/api/lecturer_main_info',
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
                        userProfile['currentProject'] = currentProject;
                        localStorage.setItem('lecturer_profile', JSON.stringify(userProfile));
            }
    })
}

function getCurrentProjectData() {
           selfProjectList.forEach(function (proj) {
                    if(proj['project_uuid'] == currentProject){
                            groupList = proj['group_list'];
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


function welcomeUser(){
    var name = userProfile['name'];
    $(".welcome-user").text(`Welcome ${name} `);
    $(".welcome-user").show();
}


function displayCurrentProject() {
    var projectName;
    selfProjectList.forEach(function (proj) {
        if(proj['project_uuid'] == currentProject){
            projectName = proj['project_name'];
        }
    })
    $("#current-project").text(projectName);
}


//display phase name
function displayPhaseName() {
    for(var phase in phaseList){
        let idx = phaseList[phase]['phase_index'];
        $(`.p${idx}-name`).text(phase);
    }
}

//display projects
function displayProjects () {
    if(!selfProjectList){
        window.open(`/create_project/${username}`, '_blank');
        alert('please create a project')
        return
    }
    //select project popup
    $(".select-project select option").remove();
    selfProjectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $(".select-project select").append(`
                <option value=${id}>${name}</option>
        `)
    });

    //all projects navbar
    $(".header .project-dropdown a").remove();
    selfProjectList.forEach(function (proj) {
        var name = proj['project_name'];
        var id = proj['project_uuid'];
        $(".project-dropdown").append(`
        <a>${name}<span class="id">${id}</span></a>
    `)
    })
     $(".project-dropdown").append(`<a id="create-project">Create a project</a>`)
}

//display group
function displayGroupInfo() {
    // all groups
    $("#all-groups li").remove();
    for (var key in groupInfo) {
        var val = groupInfo[key];
        var groupId = val['group_uuid'];
        var groupName = val['group_name'];
        var description = val['description'];
        var members = val['member'];
        var group_uuid = val['group_uuid']
        if (members.length !== 0) {
            $("#all-groups").append(`
                <li>
                <div class="title">${groupName}</div>
                <div class="description">${description}</div>
                <div class="num-members">Members: <span>${members.length}</span></div>
                <div class="join g-popup">Info</div> 
                </li>`)
        }
    }
}

//display reminders
function displayAllReminder(){
    var taskListReverse = swap(taskList);
    $(".reminder-list").find("li").remove();
    reminderList.forEach(function (val) {
        var message = val["message"];
        var ass_uuid = val['ass_uuid'];
        var reminder_uuid = val['reminder_uuid'];
        var date = val['post_time'];
        var task = taskListReverse[ass_uuid];
        if(val['submit_check']=="no"){
            task = "Project"
        }
        $(".reminder-list").append(`<li >
                                <div class="id">${reminder_uuid}</div>
                                <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                                <div class="content">${message}</div>
                                <div class="task">Task: <span id="task-name">${task}</span></div>
                                <div class="date"><span class="due">${date}</span></div>
                            </li>`)
    })
}

//display tasks
function displayTasks() {
    //reminder task
    $(".task-select option").remove();
    for(let task in taskList){
        $(".task-select").append(`
                <option value=${taskList[task]}>${task}</option>
            `)
    }
    $(".task-select").append(`<option value=${currentProject}>Project</option>`)

    //deadline phase
    $(".deadline-selector option").remove();
    $(".deadline-selector").append(`<option value="" hidden>Options</option>`)
    for(let phase in phaseList ){
        $(".deadline-selector").append(`
                <option value=${phaseList[phase]['phase_uuid']}>${phase}</option>
            `)
    }
    //deadline  task
    for(let task in taskList){
        $(".deadline-selector").append(`
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


//display marking
function displayMarking() {

       for(var phase in phaseList){
               // let index = phase.split(" ")[1];
               let index = phaseList[phase]['phase_index'];
               //add task
               $(`.mark-container${index}`).find(".select-task option").remove();
               $(`.mark-container${index}`).find(".select-task").append(`   
                            <option value="" hidden="" class="task-option">TASK NAMES</option>`)
               phaseList[phase]['task_list'].forEach(function(task){
                     $(`.mark-container${index}`).find(".select-task").append(`
                            <option value=${task['task_uuid']}>${task['task_name']}</option>
                     `)
                 })
               //add group

                $(`.mark-container${index}`).find(".select-group option").remove();
                $(`.mark-container${index}`).find(".select-group").append(`  
                            <option value="" hidden="" class="group-option">GROUPS</option>`)
                groupList.forEach(function (group) {
                    $(`.mark-container${index}`).find(".select-group").append(`
                            <option value=${group['group_uuid']}>${group['group_name']}</option>
                     `)
                })
                //add all group option
                $(`.mark-container${index}`).find(".select-group").append(`
                            <option value="All groups">All Groups</option>
                     `)
                $(`.mark-container${index}`).find(".select-group2 option[value='All groups']").remove();
        }
}

//display resources
function displayResources(){
    for(var phase in phaseList ){
        let phase_num = phaseList[phase]['phase_index'];
        $(`.phase${phase_num}-doc`).find("tbody tr").remove();
        //no files
        if(phaseList[phase]['resource_list'].length==0){
            $(`.phase${phase_num}-doc`).find("tbody").append(`
                            <tr>
                                  <td>Doc</td>
                                  <td>No files</td>                   
                              </tr>   
            `)
        }
        //display files
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

//display deadline
function displayDueDate(id){
    var phase;
    for(var p in phaseList){
        if(phaseList[p]['phase_index']==id){
            phase = phaseList[p]['phase_name']
        }
    }
    let phaseDueDate = {};
    $(`.due-date${id}`).find("ul li").remove();
    phaseDueDate[`${phase}`] = phaseList[phase]['deadline'];
    //append phase due date to phaseDueDate object
    phaseList[phase]['task_list'].forEach(function (task) {
        phaseDueDate[`${task['task_name']}`] = task['deadline']
    });
    //append task due date to phaseDueDate object
    for(let task in phaseDueDate){
        let d = new Date(phaseDueDate[task]);
        phaseDueDate[task] = d.getTime()/1000;
    }
    //sort due date
    let keysSorted = Object.keys(phaseDueDate).sort((a,b) => phaseDueDate[a]-phaseDueDate[b]);
    let now = new Date();
    //display all due date in sorted phaseDueDate
    keysSorted.forEach(function (key) {
        var dayLeft = Math.ceil((phaseDueDate[key] - now.getTime()/1000)/(60 * 60 * 24));
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


//create a project
$(document).on('click', "#create-project", function(e){
        e.preventDefault();
     window.open(`/create_project/${username}`, '_blank');
})


//logout
$("#logout").click(function(){
     window.location.pathname = "/";
})



function popUp(src, sucessOrFail, text, click){
   $(src).find(sucessOrFail).text(text).show();
    setTimeout(function(){
         $(click).click();
    },4000)
}


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







//phase 1

//only one checkbox can be selected in the group forming part
$('input.generate-group').on('change', function() {
    $('input.generate-group').not(this).prop('checked', false);  
});

// side-nav

//click Group
$(".navgrp").click( function(){
    $(".alert").hide()
    $(".notes-wrapper").hide()
    $(".upload-files").hide()
    $(".mark-container").hide();
    $(".documents").hide()
    $(".new_note").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".deadline_view").hide()
    // $(".group-info").show()
    $(".group-wrapper").css("display","flex");

});

//Click reminder
$(".reminder").click(function(){
    $(".alert").hide()
    $(".notes-wrapper").hide()
    $(".upload-files").hide()
    $(".documents").hide()
    $(".mark-container").hide();
    // $(".group-info").hide()
    $(".group-wrapper").hide()
    $(".deadline_view").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".new_note").css('display','flex')
    $(".task-select").val($(".task-select option:first").val());
    $(".group-select").val($(".group-select option:first").val());
    $(".new-reminder-msg").val("");
})

//Click Phase1
$(".active").click( function(){
    $(".alert").hide()
    // $(".group-info").hide()
     $(".group-wrapper").hide()
    $(".new_note").hide()
    $(".upload-files").hide()
    $(".documents").hide()
    $(".mark-container").hide();
    $(".deadline_view").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".notes-wrapper").show()
});

//Click Deadline
$(".deadline").click( function(){
    $(".alert").hide()
    $(".group-wrapper").hide()
    // $(".group-info").hide()
    $(".new_note").hide()
    $(".upload-files").hide()
    $(".documents").hide()
    $(".mark-container").hide();
    $(".notes-wrapper").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".deadline_view").show()
    $(".deadline-selector").val($(".deadline-selector option:first").val());
    $(".others-deadline").hide();
});

//Click Resources
$(".upload").click( function(){
    $(".alert").hide()
    $(".group-wrapper").hide()
    // $(".group-info").hide()
    $(".new_note").hide()
    $(".mark-container").hide();
    $(".notes-wrapper").hide()
    $(".deadline_view").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".upload-files").show()
    $(".documents").show()
    $(".reset").click();
});

//Click Mark
$(".mark").click( function(){
    $(".alert").hide()
    $(".group-wrapper").hide()
    // $(".group-info").hide()
    $(".new_note").hide()
    $(".notes-wrapper").hide()
    $(".deadline_view").hide()
    $(".upload-files").hide()
    $(".documents").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".mark-container .mark-doc").show()
    $(".reset").click();
    $(".mark-container").show();
    $(".mark-container select").val("");
    $(".mark-container .select-group-task").click();
});

//Click Mark distribution
$(".distribution").click( function(){
    $(".alert").hide()
    $(".group-wrapper").hide()
    // $(".group-info").hide()
    $(".new_note").hide()
    $(".notes-wrapper").hide()
    $(".deadline_view").hide()
    $(".upload-files").hide()
    $(".documents").hide()
    $(".mark-container .mark-doc").hide()
    $(".reset").click();
    $(".mark-container").hide();
    $(".mark-container select").val("");
    $(".mark-container .select-group-task").click();
    $("#distribution").show();
    $("#distribution2").show();
    $("#select-task-distribution").show();
});



//generate groups
$(document).on('click', '.group-info .btn-success', function(e){
            var btn = $(this);
            var groupSize = $(this).siblings('.group-size').find('input').val();
            var ramdomOrManual;
            $(".group-info input[type=checkbox]").each(function () {
                    var self = $(this);
                    if (self.is(':checked')) {
                        ramdomOrManual = self.attr("name");
                    }
            });
            if(!ramdomOrManual){
                alert('Please select an option')
                return
            }
             if(ramdomOrManual=="Randomly" && !groupSize){
                alert('Please enter a group size')
                return
            }
            var data={
                "ramdomOrManual":ramdomOrManual,
                'project_uuid': currentProject,
                'group_size':groupSize
            }
           btn.addClass("running");
           $.ajax({
            type: 'POST',
            url: '/api/change_group_method',
            contentType: "application/json",
            data:JSON.stringify({"update_data":data}),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                btn.removeClass("running");
                alert("Oops! Something went wrong!");
            }
        }).done(function(rsp_data){
            console.log(rsp_data);
            btn.removeClass("running");
            if(rsp_data['code']==200){
                alert("Successfully generated.")
                $('.group-size').find('input').val("");
                getAllInfo();
                getCurrentProjectData();
                displayGroupInfo();
            }
           })
})

//click group name popup
$(document).on('click', '.g-popup', function(e){
    e.preventDefault();
    var group_name = $(this).siblings('.title').text();
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

//close popup
$(document).mouseup(function(e)
{
    var container = $(".group-popup");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        container.hide();
    }
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

// click reset
 $("button[type='reset']").on('click',function() {
    $(".phase1-title").val('');
    $("#phase1-description").val('');
 })


//upload file

$(document).on('click', '.phase-doc-upload', function(e){
        e.preventDefault();
        var button = $(this);
        button.addClass("running");
        var title = $(this).closest(".upload-files").find(".title").val();
        var description = $(this).closest(".upload-files").find(".description").val();
        var file = $(this).closest(".upload-files").find("input[type=file]").prop('files')[0];
        var phaseId = $(this).closest(".upload-files").find(".upload-selector").val();
        if(phaseId=="" | !file){
            popUp(".upload-files", ".alert-danger","Incorrect input",".upload");
            button.removeClass("running");
            return
        }
        // var phaseId = phaseList[phase]['phase_uuid'];
        var formData = new FormData();
        formData.append('upload_file', file);       
        formData.append('description', description);
        formData.append('title', title);
        formData.append('project_uuid', currentProject);
        formData.append('phase_uuid', phaseId);
        $.ajax({
            type: 'POST',
            url: '/api/upload_resource',
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                button.removeClass("running");
                popUp(".upload-files", ".alert-danger","Something went wrong",".upload");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    button.removeClass("running");
                    popUp(".upload-files", ".alert-success","Successfully uploaded", ".upload");
                    getAllInfo();
                    getCurrentProjectData();
                    displayResources();
                }else{
                    button.removeClass("running");
                    popUp(".upload-files", ".alert-danger","Something went wrong",".upload");
                }
            })
})

function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}



//new reminder
$(".new_note").find('.btn-info').on('click',function(){
    var msg = $(this).siblings(".new-reminder-msg").val();
    var task_uuid = $(this).siblings(".task-select").val();
    var task = $(this).siblings(".task-select").find(":selected").text();
    var groupType = $(this).siblings(".group-select").val();
    var submit_check;
    var btn = $(this);
    btn.addClass("running");
    if(groupType=="All groups"){
        submit_check = 'no';
    }else{ submit_check = 'yes'}
    if(!msg | !task_uuid | !groupType){
        alert("Incorrect input!");
        btn.removeClass("running");
        return
    }

    var data = {
                project_uuid: currentProject,
                ass_uuid:task_uuid,
                message:msg,
                submit_check:submit_check
            }
    $.ajax({
            type: 'POST',
            url: '/api/create_new_reminder',
            contentType: "application/json",
            data:JSON.stringify(data),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                btn.removeClass("running");
                popUp(".new_note", ".alert-danger","Something went wrong",".reminder");
            }
        }).done(function(rsp_data){
                btn.removeClass("running");
                console.log(data);
                var time = rsp_data['timestamp'];
                var reminder_uuid = rsp_data['reminder_uuid'];
                if(rsp_data['code']==200){
                    popUp(".new_note", ".alert-success","Successfully create new message",".reminder");
                    getAllInfo();
                    getCurrentProjectData();
                    displayAllReminder();
                   // $(".reminder-list").append(`<li >
                   //              <div class="id">${reminder_uuid}</div>
                   //              <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                   //              <div class="content"><p class="text">${msg}</p></div>
                   //              <div class="task">Task: <span id="task-name">${task}</span></div>
                   //              <div class="date"><span class="due">${time}</span></div>
                   //          </li>`);
                   //      data['time']= time;
                   //      data['reminder_uuid'] = reminder_uuid;
                   //      var d = new Date(time)
                   //      reminderList[d.getTime()/1000] = data;
                }else{
                    alert("Something went wrong");
                    btn.removeClass("running");
                    popUp(".new_note", ".alert-danger","Something went wrong",".reminder");
                    // $("#errorAlert-phase1").text("File upload fails").show();
                    // $("#successAlert-phase1").hide();
                }
    })
})

//delete a reminder
$(document).on('click', '.delete-reminder', function(e){
        var message = $(this).siblings(".content").text();
        var temp = $(this).closest('li');
        console.log(message);
        var reminder_uuid = $(this).siblings(".id").text();
        var data={'reminder_uuid' :reminder_uuid}
        $.ajax({
            type: 'POST',
            url: '/api/delete_reminder',
            contentType: "application/json",
            data:JSON.stringify(data),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                alert("Something went wrong");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    getAllInfo();
                    getCurrentProjectData();
                    displayAllReminder();
                    // temp.remove();
                    // for(var time in reminderList){
                    //     for(var key in reminderList[time]){
                    //         if(reminderList[time][key]== reminder_uuid){
                    //             console.log(reminderList[time]);
                    //             delete reminderList.time;
                    //         }
                    //     }
                    // }
                    alert("Successfully delete the message");
                    // $("#successAlert-phase1").text("Successfully uploaded!").show();
                    // $("#errorAlert-phase1").hide();
                }else{
                    alert("Something went wrong");
                    // $("#errorAlert-phase1").text("File upload fails").show();
                    // $("#successAlert-phase1").hide();
                }
    })

})




//set Dateline

$('.deadline-selector').change(function(){ 
  if($(this).val() == 'Others'){
     $(".others-deadline").show();
  }else{
    $(".others-deadline").hide();
  }
});

$(".saveDeadline").on('click',function(){
    var btn = $(this);
    btn.addClass("running");
    var taskId = $(this).closest('.deadline-container').find(".deadline-selector").val();
    var taskName = $(this).closest('.deadline-container').find(".deadline-selector").find(":selected").text();
    var month = $(this).closest('.deadline-container').find(".text-info").text().split(" ")[1];
    var day = $(this).closest('.deadline-container').find(".text-info").text().split(" ")[2].slice(0, -1);
    var year = $(this).closest('.deadline-container').find(".text-info").text().split(" ")[3];
    month = getMonthFromString(month);
    if(!taskId){
        btn.removeClass("running");
        alert("Please select a task");
        return
    }
    var data = {
                deadline:`${year}-${month}-${day}`,
                name:taskName,
                ass_uuid:taskId
            }
    $.ajax({
            type: 'POST',
            url: '/api/change_ass',
            contentType: "application/json",
            data:JSON.stringify(data),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error: function() {
                btn.removeClass("running");
                popUp(".deadline-container", ".alert-danger","Something went wrong",".deadline");
            }
        }).done(function(data){
                btn.removeClass("running");
                console.log(data);
                if(data['code']==200){
                    popUp(".deadline-container", ".alert-success","Successfully set a deadline",".deadline");
                    getAllInfo();
                    getCurrentProjectData();
                    displayDueDate(1);
                    displayDueDate(2);
                    displayDueDate(3);
                    displayDueDate(4);
                    // $("#successAlert-phase1").text("Successfully uploaded!").show();
                    // $("#errorAlert-phase1").hide();
                }else{
                    popUp(".deadline-container", ".alert-danger","Something went wrong",".deadline");
                    // $("#errorAlert-phase1").text("File upload fails").show();
                    // $("#successAlert-phase1").hide();
                }
        })

  
})

$(document).on('click', '.deadline-button', function(e){
    var date = $(this).closest('.deadline-container').find(".text-info");
    $("#firstDeadline").click();
    $(".modal-footer").find("button").on("click",function () {
        date.text($(".firstDate").text());
    })
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




//select marking group and task
$(document).on("click", ".select-group-task", function(e){
        var groupId = $(this).siblings('.select-group').val();
        var taskId = $(this).siblings('.select-task').val();
        var document = $(this).siblings('.mark-doc').find('tbody');
        console.log(groupId, taskId);
        if(groupId && taskId){
            document.find('tr').remove();
            var flag = 'no';
            for(var task_id in allTasks){
                if (task_id == taskId){
                    //display all group's file
                            if(groupId=="All groups"){
                                flag = 'yes';

                             //display submitted groups' files
                                for (var group of allTasks[task_id]['submit_group']){
                                                    flag = 'yes';
                                                    let mark;
                                                    if(group['mark']=="None"){
                                                        mark = 'Unmarked';
                                                    }else{
                                                        mark = group['mark'];
                                                    }

                                                    var arr = group['file_address'].split("/");
                                                    var fileName = arr[arr.length - 1];
                                                    var filePath = `../temp/${fileName}`
                                                    document.append(`
                                                    <tr>
                                                      <td>${group['group_name']}</td>
                                                      <td><span class="id">yes</span>${fileName}</td>                                                           <td class="group-mark">${mark}</td>
                                                      <td align="right">
                                                     <a href=${filePath} target="_blank" class="btn btn-success btn-xs view_file">
                                                              <span class="glyphicon glyphicon-file"></span>
                                                              <span class="hidden-xs files">View</span>
                                                       </a>
                                                      </td>
                                                  </tr>                                                            
                                                    `)

                                }
                                 //display unsubmitted groups' files
                                for (var group of allTasks[task_id]['unsubmit_group']){
                                            var mark = "Unmarked";
                                            if(group['mark']!="None"){mark = group['mark']}
                                                            flag = 'yes';
                                                            var num = document.find("tr").length;
                                                            document.append(`
                                                            <tr>
                                                              <td>${group['group_name']}</td>
                                                              <td><span class="id">no</span>Have not submitted</td>                                                                 <td class="group-mark">${mark}</td>
                                                              <td align="right"> </td>                                           
                                                            </tr>                                                        
                                                            `)
                                        }

                            }else{
                                   //display specific group's file
                                    for (var group of allTasks[task_id]['submit_group']){
                                        var mark = "Unmarked";
                                        if(group['mark']!="None"){mark = group['mark']}
                                        if(group['group_uuid']==groupId){
                                                flag = 'yes';
                                                var num = document.find("tr").length;
                                                var arr = group['file_address'].split("/");
                                                var fileName = arr[arr.length - 1];
                                                var filePath = `../temp/${fileName}`
                                                document.append(`
                                                <tr>
                                                  <td>Doc${num+1}</td>
                                                  <td><span class="id">yes</span>${fileName}</td>   
                                                   <td class="group-mark">${ group['mark']}</td>                
                                                  <td align="right">
                                                   <a href=${filePath} target="_blank" class="btn btn-success btn-xs view_file">
                                                          <span class="glyphicon glyphicon-file"></span>
                                                          <span class="hidden-xs files">View</span>
                                                   </a>
                                                  </td>
                                              </tr>                                                            
                                                `)
                                        }
                                    }

                                    //display specific unsubmitted group
                                    for (var group of allTasks[task_id]['unsubmit_group']){
                                        var mark = "Unmarked";
                                        if(group['mark']!="None"){mark = group['mark']}
                                        if(group['group_uuid']==groupId){
                                            var mark = "Unmarked";
                                            if(group['mark']!="None"){mark = group['mark']}
                                                            flag = 'yes';
                                                            var num = document.find("tr").length;
                                                            document.append(`
                                                            <tr>
                                                              <td>${group['group_name']}</td>
                                                              <td><span class="id">no</span>Have not submitted</td>                                                                 <td class="group-mark">${mark}</td>
                                                              <td align="right"> </td>                                           
                                                            </tr>                                                        
                                                            `)
                                                 }
                                    }
                            }
                }
            }
        }else{
               document.find('tr').remove();
                document.append(`
                                  <tr>
                                  <td>Doc1</td>
                                  <td>No files <span class="id">no</span></td>
                                  </tr>
                `)
         }
});


//submit mark
$(document).on('click', '.mark-container .button .btn', function(e){
    e.preventDefault();
    var button = $(this);
    var flag = $(this).siblings('.mark-doc').find('.id').text();
    if(flag =='no'){
        alert("No file to mark")
        return
    }
    button.addClass("running");
    var task = $(this).parent().siblings('.select-task').val();
    var group = $(this).parent().siblings('.select-group2').val();
    var mark = $(this).parent().siblings('.phase1-mark').val();
    var data = {
                task_id:task,
                group_id:group,
                mark:mark
            };
    $.ajax({
            type: 'POST',
            url: '/api/mark_submittion',
            contentType: "application/json",
            data:JSON.stringify({"mark_data":data}),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error: function () {
                alert("Something went wrong!");
                button.removeClass("running");
            }

        }).done(function (rsp_data) {
            button.removeClass("running");
            if(rsp_data['code']==200){
                alert("Successfully marked!")
                getAllInfo();
                getCurrentProjectData();
                $(".select-group-task").click();
            }
        })
})



//switch project
$(document).on('click', ".project-dropdown a", function(e){
    let id = $(this).find('.id').text();
    currentProject = id;
    displayCurrentProject();
    getAllInfo();
    selfProjectList.forEach(function (proj) {
        if(proj['project_uuid'] == currentProject){
                groupInfo={};
                phaseList={};
                taskList={}; //name -> uuid
                allTasks={}; //uuid -> task
                reminderList={};
                groupList = [];
                groupList = proj['group_list'];
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
    welcomeUser();
    $(".active").click();
    displayPhaseName();
    displayAllReminder();
    displayGroupInfo();
    displayTasks();
    displayResources();
    displayMarkMarking();
    displayDueDate(1);
    displayDueDate(2);
    displayDueDate(3);
    displayDueDate(4);
})


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
                data: ["<50","50-65","65-75","75-85","85-100"]
            },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                itemStyle: {color: '#d9534f'},
                data: [0, 0, 0, 0, 0, 0]
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
                {value:300, name:'<50'},
                {value:335, name:'50-65'},
                {value:274, name:'65-75'},
                {value:235, name:'75-85'},
                {value:400, name:'85-100'}
            ]
        }
    ]
})


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
    if (reminderOrnot == "yes"){
            var data = {
                project_uuid: currentProject,
                ass_uuid:currentProject,
                message:msg,
                submit_check:'no'
            }
            $.ajax({
                    type: 'POST',
                    url: '/api/create_new_reminder',
                    contentType: "application/json",
                    data:JSON.stringify(data),
                    headers:{
                        'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
                    },
                    error:function(){
                        answer = "Oops! something went wrong!";
                        reminderOrnot = 'no';
                        addMessage(answer,"bot");
                        return
                    },
                    success:function () {
                         answer = "Successfully created a reminder :)";
                         reminderOrnot = 'no';
                         addMessage(answer,"bot");
                         getAllInfo();
                         getCurrentProjectData();
                         displayAllReminder();
                         return
                    }
                })

    }else{
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
                    answer = "What would you like to send?"
                    reminderOrnot = 'yes';
                }else{
                    answer = rsp_data['reply'];
                }
                addMessage(answer,"bot");
            }
             })
    }

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



    // var flag = 'no';
    // if(e.which == 13){
    //     e.preventDefault();
    //     var name = userProfile['name'];
    //     var msg = $("#chatbotInput").val();
    //     if(msg==="deadline for phase1"){
    //         $(".chat-history").append(`<div class="chat-message clearfix">
    //                   <div class="chat-message-content clearfix">
    //                     <span class="chat-time">13:35</span>
    //                     <h5>Bot</h5>
    //                     <p>2018-10-12 10:59:59</p>
    //                   </div>
    //                 </div><hr>`);
    //               var d = $('.chat-history');
    //                  d.scrollTop(d.prop("scrollHeight"));
    //     }else if(msg ==="send a new reminder"){
    //         $(".chat-history").append(`<div class="chat-message clearfix">
    //                   <div class="chat-message-content clearfix">
    //                     <span class="chat-time">13:35</span>
    //                     <h5>Bot</h5>
    //                     <p>Sure, what do you want to send?</p>
    //                   </div>
    //                 </div><hr>`);
    //                   var d = $('.chat-history');
    //                  d.scrollTop(d.prop("scrollHeight"));
    //     }else if(msg="Welcome to comp9323"){
    //                   newReminder();
    //                      $(".chat-history").append(`<div class="chat-message clearfix">
    //                   <div class="chat-message-content clearfix">
    //                     <span class="chat-time">13:35</span>
    //                     <h5>Bot</h5>
    //                     <p>New reminder has been sent :)</p>
    //                   </div>
    //                 </div><hr>`);
    //                 var date = new Date().toISOString().split('T')[0];
    //                 $(".reminder-list").append(`<li >
    //                          <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
    //                             <div class="content">Welcome to comp9323!</div>
    //                             <div class="task">Task: <span id="task-name">Project</span></div>
    //                             <div class="date"><span class="due">${date}</span></div>
    //                         </li>`);
    //                 var d = $('.chat-history');
    //                  d.scrollTop(d.prop("scrollHeight"));
    //     }else{
    //         $(".chat-history").append(`<div class="chat-message clearfix">
    //                   <div class="chat-message-content clearfix">
    //                     <span class="chat-time">13:35</span>
    //                     <h5>Bot</h5>
    //                     <p>Emm..</p>
    //                   </div>
    //                 </div><hr>`);
    //          var d = $('.chat-history');
    //         d.scrollTop(d.prop("scrollHeight"));
    //     }
    //
    //
    // }
});

$(".tag").on('click',function(){
    var msg = $(".new-reminder-msg").val();
    var newMsg = `${msg}#mark#`;
    $(".new-reminder-msg").val(newMsg);
})





