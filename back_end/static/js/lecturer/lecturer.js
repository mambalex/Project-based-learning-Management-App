const projectId = "A5259728-C967-11E8-8220-4C3275989EF5";
var userInfo={};
var reminderList={};
var projectInfo={};
var phaseList={};
var taskList={};
var groupInfo={};
var currentPhase;

$('#live-chat').hide();
$(document).ready(function(){
    getAllInfo();
    $(".loaders").hide();
    $(".active").click();
    $('#live-chat header').click(); 
    $('#live-chat').show();

    welcomeUser();
    displayAllReminder();

})

//logout
$("#logout").click(function(){
     window.location.pathname = "/";
})

//view files
// $(".files").on('click',function(){
    
// })

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



function getAllInfo(){
    return $.ajax({
            type:'POST',
            url:'/api/lecturer_main_info',
            contentType: "application/json",
            data:JSON.stringify({'project_uuid':projectId}),
            async:false,
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('lecturer_token')).token+':')
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
                        for(var phase in phaseList){
                            console.log(phaseList[phase]);
                            phaseList[phase]['task_list'].forEach(function(task){
                                taskList[task['task_name']] = task['task_uuid'];
                            })
                        }
                        rsp_data['reminder_list'].forEach(function(val){
                            var d = new Date(val['post_time'])
                            reminderList[d.getTime()/1000] = val;
                            // reminderList[val['post_time']] = val;
                        });
                        projectInfo = rsp_data['project_info'];
                        userProfile = rsp_data['user_profile']; 
                        localStorage.setItem('profile', JSON.stringify(userProfile));
                        console.log(groupInfo)       
                        console.log(phaseList)       
                        console.log(projectInfo)       
                        console.log(userProfile)   
                        console.log(taskList)  
                        console.log(reminderList)  
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
    $(".alert").hide()
    $(".notes-wrapper").hide()
    $(".upload-files").hide()
    $(".documenets").hide()
    $(".new_note").hide()
    $(".deadline_view").hide()
    $(".group-info").show()

});

//Click reminder
$(".reminder").click(function(){
    $(".alert").hide()
    $(".notes-wrapper").hide()
    $(".upload-files").hide()
    $(".documenets").hide()
    $(".group-info").hide()
    $(".deadline_view").hide()
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
    $(".documenets").hide()
    $(".deadline_view").hide()
    $(".notes-wrapper").show()
});

//Click Deadline
$(".deadline").click( function(){
    $(".alert").hide()
    $(".group-info").hide()
    $(".new_note").hide()
    $(".upload-files").hide()
    $(".documenets").hide()
    $(".notes-wrapper").hide()
    $(".deadline_view").show()
    $(".deadline-selector").val($(".deadline-selector option:first").val());
    $(".others-deadline").hide();
});

//Click Documents
$(".upload").click( function(){
    $(".alert").hide()
    $(".group-info").hide()
    $(".new_note").hide()
    $(".notes-wrapper").hide()
    $(".deadline_view").hide()
    $(".upload-files").show()
    $(".documenets").show()
    $(".reset").click();
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

$(document).on('click', '.phase1-upload', function(e){
        e.preventDefault();
        var title = $(".phase1-title").val();
        var description = $("#phase1-description").val();
        var file = $('#phase1-file').find("input[type=file]").prop('files')[0];
        var phase = $(".upload-selector").val();
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
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('lecturer_token')).token+':')
            },
            error:function(){
                popUp(".upload-files", ".alert-danger","Something went wrong",".upload");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    popUp(".upload-files", ".alert-success","Successfully uploaded", ".upload");
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



function displayAllReminder(){
    $(".reminder-list").find("li").remove();
    var reminderTimestamp = Object.keys(reminderList);
    reminderTimestamp.sort(function(a, b){return a - b});
    var taskListReverse = swap(taskList);
    taskListReverse["a5259728-c967-11e8-8220-4c3275989ef5"] = "Project";
    console.log(taskListReverse);
    reminderTimestamp.forEach(function(val){
        console.log(reminderList[val]);
        var message = reminderList[val]["message"];
        var ass_uuid = reminderList[val]['ass_uuid'];
        var date = reminderList[val]['post_time'];
        var task = taskListReverse[ass_uuid];
        $(".reminder-list").append(`<li >
                                <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                                <div class="content">${message}</div>
                                <div class="task">Task: <span id="task-name">${task}</span></div>
                                <div class="date"><span class="due">${date}</span></div>
                            </li>`)
    })
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
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('lecturer_token')).token+':')
            },
            error:function(){
                popUp(".new_note", ".alert-danger","Something went wrong",".reminder");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    popUp(".new_note", ".alert-success","Successfully create new message",".reminder");
                   // $(".reminder-list").append(`<li >
                   //              <div class="delete-reminder"><i class="fas fa-backspace close-reminder"></i></div>
                   //              <div class="content">${msg}</div>
                   //              <div class="task">Task: <span id="task-name">${task}</span></div>
                   //              <div class="date"><span class="due">${date}</span></div>
                   //          </li>`)
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
        var reminder_uuid;
        for(var time in reminderList){
            for(var key in reminderList[time]){
                if(reminderList[time][key]== message){
                    console.log(reminderList[time]);
                    reminder_uuid = reminderList[time]['reminder_uuid'];
                }
            }
        }
        var data={'reminder_uuid' :reminder_uuid}
        $.ajax({
            type: 'POST',
            url: '/api/delete_reminder',
            contentType: "application/json",
            data:JSON.stringify(data),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('lecturer_token')).token+':')
            },
            error:function(){
                alert("Something went wrong");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    temp.remove();
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
    var taskPhaseId;
    var task = $(".deadline-selector").val();
    var month = $(".text-info").text().split(" ")[1];
    var day = $(".text-info").text().split(" ")[2].slice(0, -1);
    var year = $(".text-info").text().split(" ")[3];
    month = getMonthFromString(month);
    if(task =="Others"){
        task = $(".others-deadline").val();
        return
    }
    var temp = task.slice(0, -1);
    if(temp == "Phase "){
        console.log(phaseList);
        console.log(task);
        taskPhaseId = phaseList[task]["phase_uuid"];
    }else{
        taskPhaseId = taskList[task];
    }

    var data = {
                deadline:`${year}-${month}-${day}`,
                name:task,
                ass_uuid:taskPhaseId
            }
    console.log(data);
    $.ajax({
            type: 'POST',
            url: '/api/change_ass',
            contentType: "application/json",
            data:JSON.stringify(data),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('lecturer_token')).token+':')
            },
            error: function() {
                popUp(".deadline-container", ".alert-danger","Something went wrong",".deadline");
            }
        }).done(function(data){
                console.log(data);
                if(data['code']==200){
                    popUp(".deadline-container", ".alert-success","Successfully set a deadline",".deadline");

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
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('lecturer_token')).token+':')
            }

        }).done(function(data){
                console.log(data);
    })
}



$(document).on("keypress", "#chatbotInput", function(e){
        if(e.which == 13){
        e.preventDefault();
        var msg = $("#chatbotInput").val();
        $(".chat-history").append(`<div class="chat-message clearfix">
          <div class="chat-message-content clearfix">
            <span class="chat-time">13:35</span>
            <h5>John Doe</h5>
            <p>${msg}</p>
          </div> 
        </div><hr>`);      
        var arr = msg.split(" ");
        arr.forEach(function(val){
            // alert(val);
            if(val=="phase1"){
                $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>2018-10-12 10:59:59</p>
                      </div> 
                    </div><hr>`);  
                  var d = $('.chat-history');
                     d.scrollTop(d.prop("scrollHeight"));
                    return  
            }else if(val=="reminder"){
                    $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>Sure, what do you want to send?</p>
                      </div> 
                    </div><hr>`); 
                      var d = $('.chat-history');
                     d.scrollTop(d.prop("scrollHeight"));
                    return 
        }else if(val=="Welcome"){
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
                    return
                }

      $(".chat-history").append(`<div class="chat-message clearfix">
                      <div class="chat-message-content clearfix">
                        <span class="chat-time">13:35</span>
                        <h5>Bot</h5>
                        <p>Emm..</p>
                      </div> 
                    </div><hr>`); 
      var d = $('.chat-history');
      d.scrollTop(d.prop("scrollHeight"));

                
        
        });
    }
});













