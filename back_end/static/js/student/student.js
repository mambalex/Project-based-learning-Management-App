var projectList;
var projectId;
const groupInfo={};


$(document).ready(function(){
    getProjectList();
    projectId = projectList[0]['project_uuid']
    getSelfGroup(projectId);
    getGroupList(projectId);
})


$("#logout").click(function(){
     window.location.pathname = "/";
})


// phase1

// side-nav


function getProjectList(){
    $.ajax({
        async: false,
        type:'POST',
        url:'/api/get_self_project_list',
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        success(rsp_data){
            console.log(rsp_data);
            projectList = rsp_data['data'];
            // localStorage.setItem('user_id', JSON.stringify(rsp_data['user_id']));
            console.log(projectList)
        }
    })
}

function getSelfGroup(projId){
        $.ajax({
        type:'POST',
        dataType : 'json',
        url:'/api/current_group',
        contentType: "application/json",
        data:JSON.stringify({'project_uuid':projId}),
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
    }).done(function(rsp_data){
        console.log(rsp_data);
        if(rsp_data['code']==200){
            var description = rsp_data['data']['description'];
            var groupName = rsp_data['data']['group_name'];
            var members = rsp_data['data']['member'];
            $("#group-name-own").text(groupName);
            $("#group-note-own").text(description);
            members.forEach(function(val){
                 $("#members").append(`<li>${val['name']}</li>`)
            })
        }})
}


//           <div class="group-popup drop-shadow-nav-grp curved.v2">
//               <div class="group-popup-close"><i class="fas fa-backspace "></i></div>
//               <div class="group-name">Group 1</div>
//               <div class="group-popup-wrapper">
//                   <div class="memebers">
//                       <div class="title">Members:</div>
//                       <ul class="all-members">
// <!--                           <li>Zhiqin Zhang </li>
//                           <li>Han Zhang </li> -->
//                       </ul>
//                   </div>
//                   <div class="note">Project-based learning management app</div>
//               </div>
//           </div>
function getGroupList(projId){
        $.ajax({
        type:'POST',
        url:'/api/get_group_list',
        contentType: "application/json",
        data:JSON.stringify({'project_uuid':projId}),
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        }).done(function(rsp_data){
            console.log(rsp_data);
            if(rsp_data['code']==200){
                rsp_data['data'].forEach(function(val){
                    var groupId = val['group_uuid'];
                    var groupName = val['group_name'];
                    var description = val['description'];
                    var members = val['member'];
                    var group_uuid = val['group_uuid']
                    groupInfo[groupName] = val;
                    $("#all-groups").append(`<li><div class="title g-popup">${groupName}</div><div class="description">${description}</div><div class="num-members">Members: <span>${members.length}</span></div><div class="join">Join</div> </li>`)
                })

        }})  
 
}

function createNewGroup(prjId, group_name, note){
        $.ajax({
        type:'POST',
        url:'/api/create_group',
        contentType: "application/json",
        data:JSON.stringify({'project_uuid':projId, 'group_name':group_name, 'note':note}),
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        }).done(function(rsp_data){
        console.log(rsp_data);
        })
}

function uploadFiles(){
    $("#upload-file").click(function() {
        var form_data = new FormData($('#upload-file')[0]);
        $.ajax({
            type: 'POST',
            url: '/upload',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: false,
            success: function(data) {
                console.log('Success!');
            },
        });
    });
}

var projectId;
// click group
$(document).on('click', '.navgrp', function(e){
    $(".notes-wrapper").hide();
    $(".documents").hide();
    $(".group-info").show();
    $(".add-group").show();
    $(".all-groups").show();
    // var projectList = getProjectList();  
    // projectId = projectList[0]['project_uuid']
    // console.log(projectId)
    // getSelfGroup(projectId);
    // getGroupList(projectId);

});

$(document).on('click', '#group-save', function(e){
        e.preventDefault();
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
        console.log(rsp_data);
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
});

//click Documents
$(".document").click( function(){
    $(".notes-wrapper").hide();
    $(".add-group").hide();
    $(".group-info").hide();
    $(".group_container").hide();
    $(".all-groups").hide();
    $(".documents").show();
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

$("#upload-btn").click(function(e){
        e.preventDefault();
        var file = $('#upload-file').find("input[type=file]").prop('files')[0]
        console.log(file)
        var formData = new FormData();
        formData.append('upload_file', file);
        console.log(formData)
        $.ajax({
            type: 'POST',
            url: '/api/upload',
            data: formData,
            contentType: false,
            cache: false,
            // enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            async: false,
            success: function(data) {
                console.log(data);
                console.log('Success!');
            },
        });
})



//side-nav

//click Phase2
$(".phase2-nav").click( function(){
    $(".notes-wrapper-2").show();
    $(".file-input").hide();
    $(".document-2").hide();

});

//click requirement document
$(document).on('click', '.nav-design', function(e){
    e.preventDefault();
    $(".file-input").show();
    $(".notes-wrapper-2").hide();
    $(".requirement").hide();
    $(".design").show();
})

//click design document
$(document).on('click', '.nav-requirement', function(e){
    e.preventDefault();
    $(".file-input").show();
    $(".notes-wrapper-2").hide();
    $(".requirement").show();
    $(".design").hide();
})

//click resources
$(document).on('click', '.document', function(e){
    e.preventDefault();
    $(".file-input").hide();
    $(".notes-wrapper-2").hide();
    $(".requirement").hide();
    $(".design").hide();
    $(".documents-2").show();
})


//phase 3

//click phase3
$(document).on('click', '.phase3-nav', function(e){
    $(".notes-wrapper-3").show();
    $(".file-input").hide();
    $(".document-3").hide();
})

//click uploading files
$(document).on('click', '.upload-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").show();
    $(".document-3").hide();
})

//click resources
$(document).on('click', '.document-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").hide();
    $(".document-3").show();
})

//click mark
$(document).on('click', '.mark-nav-3', function(e){
    $(".notes-wrapper-3").hide();
    $(".file-input").hide();
    $(".document-3").hide();
})





