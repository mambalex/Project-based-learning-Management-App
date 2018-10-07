var projectList;
var projectId;
const groupInfo={};
const userInfo={};
var inGroupOrnot;
var currentGroupName;



$(document).ready(function(){
    $(".loaders").hide();
    getProjectList();
    $.when(getUserInfo(),getSelfGroup(), getGroupList()).done(function(){
            $(".loaders").hide();
            $(".phase1-nav").click();
        })
})


$("#logout").click(function(){
     window.location.pathname = "/";
})




// phase1

// side-nav

function getUserInfo(){
    return $.ajax({
                    type:'POST',
                    url:'/api/get_user_profile',
                    headers:{
                        'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
                    },
                    success(rsp_data){
                        console.log(rsp_data);
                        userInfo["userId"] = rsp_data['user_id'];
                        userInfo["email"] = rsp_data['data']['email'];
                        userInfo["dob"] = rsp_data['data']['dob'];
                        userInfo["gender"] = rsp_data['data']['gender'];
                        userInfo["name"] = rsp_data['data']['name'];
                        $(".welcome-user").text(`Welcome, ${userInfo['name']}`);
                        $(".welcome-user").show();
                    }
                })
}


function getProjectList(){
    return $.ajax({
        async: false,
        type:'POST',
        url:'/api/get_self_project_list',
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        success(rsp_data){
            console.log(rsp_data);
            projectList = rsp_data['data'];
            projectId = projectList[0]['project_uuid'];
            // localStorage.setItem('user_id', JSON.stringify(rsp_data['user_id']));
            // console.log(projectList)
        }
        })
}

function getSelfGroup(){
    return $.ajax({
        type:'POST',
        dataType : 'json',
        url:'/api/current_group',
        contentType: "application/json",
        data:JSON.stringify({'project_uuid':projectId}),
        headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
        }).done(function(rsp_data){
        console.log(rsp_data);
        if(rsp_data['code']==200){
            inGroupOrnot = 'yes';
            $(".leave").show();
            var description = rsp_data['data']['description'];
            currentGroupName = rsp_data['data']['group_name'];
            var members = rsp_data['data']['member'];
            $("#group-name-own").text(currentGroupName);
            $("#group-note-own").text(description);
            members.forEach(function(val){
                 $("#members").append(`<li>${val['name']}</li>`)
            })
        }else if(rsp_data['code']==400){
                inGroupOrnot = 'no';
                $(".leave").hide();
                $("#group-name-own").text("You have not group");
        }

    })
}

function getGroupList(){
    return $.ajax({
        type:'POST',
        url:'/api/get_group_list',
        contentType: "application/json",
        data:JSON.stringify({'project_uuid':projectId}),
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
                    if(members.length !==0){
                         $("#all-groups").append(`<li><div class="title g-popup">${groupName}</div><div class="description">${description}</div><div class="num-members">Members: <span>${members.length}</span></div><div class="join">Join</div> </li>`)
                    }
                })
        }})  
    }




// click group
$(document).on('click', '.navgrp', function(e){
    $(".notes-wrapper").hide();
    $(".documents").hide();
    $(".group-info").show();
    $(".add-group").show();
    $(".all-groups").show();
});

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
                            currentGroupName = group_name;
                            console.log(rsp_data)
                            if(rsp_data['code']==200){
                                groupInfo[group_name] = {group_uuid: `${rsp_data['group_uuid']}`, group_name: `${group_name}`,member:[{name:`${userInfo['name']}`}]};
                                console.log(groupInfo);
                                //display in all group
                                $("#all-groups").append(`<li><div class="title g-popup">${group_name}</div><div class="description">${note}</div><div class="num-members">Members: <span>1</span></div><div class="join">Join</div> </li>`);
                                // display in current group
                                $("#group-name-own").text(group_name);
                                $("#group-note-own").text(note);
                                $("#members").append(`<li>${userInfo['name']}</li>`);
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
            currentGroupName = groupName;
            if(rsp_data['code']==400){
                alert("You already have a group")
            }else{
                alert("Congrats! you successfully join a group");
                inGroupOrnot = 'yes';
                $(".leave").show();
                let num = groupInfo[groupName]["member"].length;
                // let num = $('.g-popup:contains("'+groupName+'")').siblings(".num-members").find('span').text();
                $('.g-popup:contains("'+groupName+'")').siblings(".num-members").find('span').text(++num);
                // console.log(groupInfo[groupName]);
                // console.log(userInfo);
                groupInfo[groupName]['member'].push({name:`${userInfo['name']}`})
                var description = groupInfo[groupName]['description'];
                var members = groupInfo[groupName]['member'];
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
                        groupInfo[groupName]['member'].forEach(function(item, index, object) {
                                  if (item['name'] === userInfo['name']) {
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


//upload files
$("#upload-btn").click(function(e){
        e.preventDefault();
        var file = $('#upload-file').find("input[type=file]").prop('files')[0];
        console.log(file);
        var formData = new FormData();
        formData.append('upload_file', file);
        formData.append('group_uuid', groupInfo[currentGroupName]['group_uuid']);
        formData.append('assessment_uuid', "04AFE482-C968-11E8-8423-4C3275989EF5");
        console.log(formData);
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
            },
            success: function(data) {
                if(data['code']==200){

                }
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
});





