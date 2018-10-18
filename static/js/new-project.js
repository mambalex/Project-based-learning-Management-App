

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
    var mySet = new Set(taskName[phase]);
    if(mySet.has(task)){
        alert('Already set this task');
        return
    }
    // console.log(phase);
    // console.log(taskName);
    // console.log(taskName[phase]);
    var numTask = taskName[phase].length;
    taskName[phase].push(task);
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
    var index = taskName[phase].indexOf(task);
    if (index > -1) {
        taskName[phase].splice(index, 1);
    }
    console.log(taskName);
    $(this).parent().remove();
})

$(document).on('click', '.button', function(e){
    var projectName = $('#projectName').val();
    var data ={
           'projectName': projectName,
           'phaseName' : phaseName,
           'taskName': taskName
       }
       console.log(data)
})

