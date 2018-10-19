var array = document.location.href.toString().split("/");
var username = array[array.length - 1];

// var name = $(this).siblings('input').val();
var phaseName = {};
var taskName ={
    'Phase 1':[],
    'Phase 2':[],
    'Phase 3':[],
    'Phase 4':[]
};



$(document).on('click', '.add-phase', function(e){
    e.preventDefault();
    var phase = $('.select-phase').val();
    var name = $(this).siblings('input').val();
    if(!phase || !name){
        alert('Incorrect input!');
        return
    }
    if(phase in phaseName){
        alert(`${phase} already got a name`)
    }else{
        phaseName[phase] = name;
        console.log(phaseName);
        $(".display-phase").append(`
        <li class="display">
            <div class="show-phase">- ${phase}:</div>
            <div class="phase-name">${name}</div>
            <i class="fas fa-minus-circle delete-phase"></i>
        </li>
    `);
        $('.select-phase').val('');
        $(this).siblings('input').val('');
    }
})

$(document).on('click', '.delete-phase', function(e){
    e.preventDefault();
    let num = $(this).siblings('.show-phase').text().split(" ")[2].slice(0,-1);
    let phase = `Phase ${num}`;
    console.log(phase);
    delete phaseName[phase];
    console.log(phaseName);
    $(this).parent().remove();
})

$(document).on('click', '.add-task', function(e){
    e.preventDefault();
    var task = $(this).siblings('input').val();
    var phase = $('.select-task').val();
    var submit = $('.submit-files').val();
    if(!phase | !task |!submit){
        alert("Incorrect input");
        return
    }
    console.log(taskName)
    var mySet = new Set(taskName[phase]);
    if(mySet.has(task)){
        alert('Already set this task');
        return
    }
    // console.log(phase);
    // console.log(taskName);
    // console.log(taskName[phase]);
    var numTask = taskName[phase].length;
    taskName[phase].push(
        {
            'taskName': task,
            'submitRequire': submit
        });
    phase2 = phase.split(" ")[1];
    $(".display-task").append(`
                <li class="display display2">
                    <div class="id">${phase}</div>
                    <span class="show-task">p${phase2}-Task${numTask+1}:</span>
                    <div class="task-name">${task}</div>
                    <span class="submit-f">${submit}</span>
                    <i class="fas fa-minus-circle delete-task"></i>
                </li>
    `);
    console.log(taskName);
    $(this).siblings('input').val("");
    $('.select-task').val("");
})

$(document).on('click', '.delete-task', function(e){
    e.preventDefault();
    let phase = $(this).siblings('.id').text();
    let task = $(this).siblings('.task-name').text();
    var submit = $(this).siblings('.submit-f').text();
    var index;
    taskName[phase].forEach(function (t,idx) {
        console.log(idx,t)
        if(t['taskName']==task && t['submitRequire']==submit){
            index = idx;
        }
    })
    // var index = taskName[phase].indexOf(`{'taskName':${task},'submitRequire': ${submit}}`);
    if (index > -1) {
        taskName[phase].splice(index, 1);
    }
    console.log(taskName);
    $(this).parent().remove();
})


//create new project
$(document).on('click', '.button', function(e){
    e.preventDefault();
    var projectName = $('#projectName').val();
    var project_data ={
           'projectName': projectName,
           'phaseName' : phaseName,
           'taskArray': taskName
       };
    console.log(project_data)
       $.ajax({
            type: 'POST',
            url: '/api/create_whole_project',
            contentType: "application/json",
            data:JSON.stringify({'project_data':project_data}),
            headers:{
                'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem(username)).token+':')
            },
            error:function(rsp_data){
                  console.log(rsp_data);
                  alert("Oops! something went wrong");
            },
            success:function (rsp_data) {
                console.log(rsp_data);
                alert("Successfully create a project");
            }
        })
})

// project_data