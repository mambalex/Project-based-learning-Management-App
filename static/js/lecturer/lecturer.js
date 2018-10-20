const projectId = "A5259728-C967-11E8-8220-4C3275989EF5";
var array = document.location.href.toString().split("/");
var username = array[array.length - 1];
var selfProjectList = JSON.parse(localStorage.getItem(`${username}ProjectList`));
var currentProject;
var reminderList={};
var groupList;
var projectInfo={};
var phaseList={};
var taskList={}; //name -> uuid
var allTasks={}; //uuid -> task
var groupInfo={};
var currentPhase;


$('#live-chat').hide();
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
    welcomeUser();
    $(".active").click();
    displayPhaseName();
    displayAllReminder();
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
                        localStorage.setItem('profile', JSON.stringify(userProfile));
            }
    })
}



function welcomeUser(){
    var name = userProfile['name'];
    $(".welcome-user").text(`Welcome ${name} `);
    $(".welcome-user").show();
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
        $(".reminder-list").append(`<li >
                                <div class="id">${reminder_uuid}</div>
                                <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                                <div class="content">${message}</div>
                                <div class="task">Task: <span id="task-name">${task}</span></div>
                                <div class="date"><span class="due">${date}</span></div>
                            </li>`)
    })
}

//display deadline
function displayTasks() {
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
               phaseList[phase]['task_list'].forEach(function(task){
                     $(`.mark-container${index}`).find(".select-task").append(`
                            <option value=${task['task_uuid']}>${task['task_name']}</option>
                     `)
                 })
               //add group
                groupList.forEach(function (group) {
                    $(`.mark-container${index}`).find(".select-group").append(`
                            <option value=${group['group_uuid']}>${group['group_name']}</option>
                     `)
                })

        }
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

//display deadline
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
    },3000)
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
    $(".group-info").show()

});

//Click reminder
$(".reminder").click(function(){
    $(".alert").hide()
    $(".notes-wrapper").hide()
    $(".upload-files").hide()
    $(".documents").hide()
    $(".mark-container").hide();
    $(".group-info").hide()
    $(".deadline_view").hide()
    $("#distribution").hide();
    $("#distribution2").hide();
    $("#select-task-distribution").hide();
    $(".new_note").css('display','flex')
    $("#task-select").val($("#task-select option:first").val());
    $("#group-select").val($("#group-select option:first").val());
    $(".new-reminder-msg").val("");
})

//Click Phase1
$(".active").click( function(){
    $(".alert").hide()
    $(".group-info").hide()
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
    $(".group-info").hide()
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
    $(".group-info").hide()
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
    $(".group-info").hide()
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
    $(".group-info").hide()
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
$(document).on('click', '.group-info button', function(e){
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
           $.ajax({
            type: 'POST',
            url: '/api/change_group_method',
            contentType: "application/json",
            data:JSON.stringify({"update_data":data}),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                alert("Oops! Something went wrong!");
            }
        }).done(function(rsp_data){
            if(rsp_data['code']==200){
                alert("Successfully create random groups")
                $('.group-size').find('input').val("");
            }
           })
})




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
        var title = $(this).closest(".upload-files").find(".title").val();
        var description = $(this).closest(".upload-files").find(".description").val();
        var file = $(this).closest(".upload-files").find("input[type=file]").prop('files')[0];
        var phase = $(this).closest(".upload-files").find(".upload-selector").val();
        if(phase==""){
            popUp(".upload-files", ".alert-danger","Please select a phase",".upload");
            return
        }
        var phaseId = phaseList[phase]['phase_uuid'];
        var formData = new FormData();
        formData.append('upload_file', file);       
        formData.append('description', description);
        formData.append('title', title);
        formData.append('project_uuid', projectId);
        formData.append('phase_uuid', phaseId);
        $.ajax({
            type: 'POST',
            url: '/api/upload_resource',
            data: formData,
            contentType: false,
            cache: false,
            contentType: false,
            processData: false,
            async: false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(){
                popUp(".upload-files", ".alert-danger","Something went wrong",".upload");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    popUp(".upload-files", ".alert-success","Successfully uploaded", ".upload");
                    getAllInfo();
                    displayResources();
                }else{
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
    var msg = $(".new-reminder-msg").val();
    var task = $("#task-select").val();
    var groupType = $("#group-select").val();
    var submit_check;
    var task_uuid;
    if(groupType=="All groups"){
        submit_check = 'no';
    }else{ submit_check = 'yes'}
    if(task=="Others"){
        task_uuid = projectId;
    }else{
        task_uuid = taskList[task];
        console.log(taskList);
        console.log(taskList[task]);
    }
    console.log(msg, task, groupType,submit_check,task_uuid)
    var data = {
                project_uuid: projectId,
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
                popUp(".new_note", ".alert-danger","Something went wrong",".reminder");
            }
        }).done(function(rsp_data){
                console.log(data);
                var time = rsp_data['timestamp'];
                var reminder_uuid = rsp_data['reminder_uuid'];
                if(rsp_data['code']==200){
                    popUp(".new_note", ".alert-success","Successfully create new message",".reminder");
                   $(".reminder-list").append(`<li >
                                <div class="id">${reminder_uuid}</div>
                                <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                                <div class="content"><p class="text">${msg}</p></div>
                                <div class="task">Task: <span id="task-name">${task}</span></div>
                                <div class="date"><span class="due">${time}</span></div>
                            </li>`);
                        data['time']= time;
                        data['reminder_uuid'] = reminder_uuid;
                        var d = new Date(time)
                        reminderList[d.getTime()/1000] = data;
                }else{
                    alert("Something went wrong");
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
                    temp.remove();
                    for(var time in reminderList){
                        for(var key in reminderList[time]){
                            if(reminderList[time][key]== reminder_uuid){
                                console.log(reminderList[time]);
                                delete reminderList.time;
                            }
                        }
                    }
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
    var taskId = $(this).closest('.deadline-container').find(".deadline-selector").val();
    var taskName = $(this).closest('.deadline-container').find(".deadline-selector").find(":selected").text();
    var month = $(this).closest('.deadline-container').find(".text-info").text().split(" ")[1];
    var day = $(this).closest('.deadline-container').find(".text-info").text().split(" ")[2].slice(0, -1);
    var year = $(this).closest('.deadline-container').find(".text-info").text().split(" ")[3];
    month = getMonthFromString(month);
    var data = {
                deadline:`${year}-${month}-${day}`,
                name:taskName,
                ass_uuid:taskId
            }
    console.log(data);
    $.ajax({
            type: 'POST',
            url: '/api/change_ass',
            contentType: "application/json",
            data:JSON.stringify(data),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error: function() {
                popUp(".deadline-container", ".alert-danger","Something went wrong",".deadline");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    popUp(".deadline-container", ".alert-success","Successfully set a deadline",".deadline");
                    getAllInfo();
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

//chat bot
$('#live-chat header').on('click', function() {
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');

});

$('.chat-close').on('click', function(e) {
    e.preventDefault();
    $('#live-chat').fadeOut(300);

});


//demo create new reminder
function newReminder(){
    var msg = "Welcome to comp9323!"
    var task_uuid = projectId;
    var submit_check = 'no';
    var data = {
                project_uuid: projectId,
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
            }

        }).done(function(data){
                console.log(data);
                var time = data['timestamp'];
                var d = new Date(time);
                reminderList[d.getTime()/1000] = data['timestamp']['reminder_uuid'];
    })
}




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
                    for (const group of allTasks[task_id]['submit_group']){
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
                }
            }
            if(flag == 'no'){
                document.find('tr').remove();
                document.append(`
                                  <tr>
                                  <td>Doc1</td>                             
                                  <td><span class="id">no</span>Have not submitted</td>
                                  </tr>
                `)
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
$(document).on('click', '.mark-container .button', function(e){
    e.preventDefault();
    var flag = $(this).siblings('.mark-doc').find('.id').text();
    if(flag =='no'){
        alert("No file to mark")
        return
    }
    var task = $(this).siblings('.select-task').val();
    var group = $(this).siblings('.select-group').val();
    var mark = $(this).siblings('.phase1-mark').val();
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
            }

        }).done(function (rsp_data) {
            if(rsp_data['code']==200){
                alert("Successfully marked!")
            }
        })
})



//switch project
$(document).on('click', ".project-dropdown a", function(e){
    let id = $(this).find('.id').text();
    currentProject = id;
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
    displayTasks();
    displayResources();
    displayMarking();
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

$(document).on("keypress", "#chatbotInput", function(e){
    var flag = 'no';
    if(e.which == 13){
        e.preventDefault();
        var name = userProfile['name'];
        var msg = $("#chatbotInput").val();
        if(msg==="deadline for phase1"){
            $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>2018-10-12 10:59:59</p>
                      </div> 
                    </div><hr>`);
                  var d = $('.chat-history');
                     d.scrollTop(d.prop("scrollHeight"));
        }else if(msg ==="send a new reminder"){
            $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>Sure, what do you want to send?</p>
                      </div> 
                    </div><hr>`);
                      var d = $('.chat-history');
                     d.scrollTop(d.prop("scrollHeight"));
        }else if(msg="Welcome to comp9323"){
                      newReminder();
                         $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>New reminder has been sent :)</p>
                      </div> 
                    </div><hr>`);
                    var date = new Date().toISOString().split('T')[0];
                    $(".reminder-list").append(`<li >
                             <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                                <div class="content">Welcome to comp9323!</div>
                                <div class="task">Task: <span id="task-name">Project</span></div>
                                <div class="date"><span class="due">${date}</span></div>
                            </li>`);
                    var d = $('.chat-history');
                     d.scrollTop(d.prop("scrollHeight"));
        }else{
            $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>Emm..</p>
                      </div> 
                    </div><hr>`);
             var d = $('.chat-history');
            d.scrollTop(d.prop("scrollHeight"));
        }


    }
});

$(".tag").on('click',function(){
    var msg = $(".new-reminder-msg").val();
    var newMsg = `#mark# ${msg}`;
    $(".new-reminder-msg").val(newMsg);
})





