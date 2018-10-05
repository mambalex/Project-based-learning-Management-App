$(document).on('click', ".update", function(e){
    e.preventDefault();
    if($(this).text()=='update'){
    var data_to_update = $(this).siblings();
    // alert($(this).parent().contents().get(0).nodeValue);
    $(this).text('comform');
    data_to_update.attr('contenteditable', 'true');
    data_to_update.focus();
    }else{
        // alert($(this).siblings().text());
        var data_to_update = $(this).siblings();
        data_to_update.attr('contenteditable', 'false');
        $(this).text('update');
    }
});


$(document).ready(function(){
    $.ajax({
        type:'POST',
        url:'/api/login',
         headers:{
            'Authorization': 'Basic ' + btoa(JSON.parse(localStorage.getItem('token')).token+':')
        },
    }).done(function(rsp_data){

    }

})