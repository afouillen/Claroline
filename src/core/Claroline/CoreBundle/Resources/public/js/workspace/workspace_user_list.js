var nbIterationUsers=0;
var nbIterationGroups=0;
  
$(function()
{     
    twigWorkspaceId = document.getElementById('twig_attributes').getAttribute('data-workspaceId');
    twigDeleteTranslation = document.getElementById('twig_attributes').getAttribute('data-translation.delete');
    
    $(".loading").hide();
    $('#user_dialog').dialog({ 
        autoOpen: false,
        height: 300
    });
    $('#group_dialog').dialog({ 
        autoOpen: false,
        height: 300
    });
    $('#show_user_dialog_button').click(function(){
        $("#user_dialog").dialog('open');
    });
    $('#show_group_dialog_button').click(function(){
        $("#group_dialog").dialog('open');
    });
    
    $('#user_checkboxes').on('click', '.checkbox_user_name', function(event){
        var userId = $(this).val();
        if ($(this).is(':checked')){
            setOnAddUserChkBox(userId);
        } else {
            setOnRemoveUserChkBox(userId);
        }
    });
    
    $('#group_checkboxes').on('click', '.checkbox_group_name', function(event){
        var groupId = $(this).val();
        if( $(this).is(':checked')){
            setOnAddGroupChkBox(groupId);
        } else {
            setOnRemoveGroupChkBox(groupId);
        }
    });

    $('#add_next_users').click(function(){
        $('#user_loading').show();
        sendRequest(
            'claro_workspace_ajax_get_add_users_workspace',
            {'id': twigWorkspaceId, 'nbIteration': nbIterationUsers},
            function(data){
                if (nbIterationUsers == 0){
                    $('.checkbox_user_name').remove();
                    $('#user_checkboxes').empty();
                }
                nbIterationUsers++;
                createUsersChkBoxes(data);
                $('#user_loading').hide();
            }
        );
    });

    $('#add_next_groups').click(function(){
        $('#group_loading').show();
        sendRequest(
            'claro_workspace_ajax_get_add_groups_workspace',
            {'id': twigWorkspaceId, 'nbIteration': nbIterationGroups},
            function(data){
                if (nbIterationGroups == 0){
                    $('.checkbox_group_name').remove();
                    $('#group_checkboxes').empty();
                }
                nbIterationGroups++;
                createGroupsChkBoxes(data);
                $('#group_loading').hide();
            }
        );
    });

    $('#search_user_button').click(function(){
        $('#user_loading').show();
        alert("click");
        var search = document.getElementById('search_user_txt').value;
        nbIterationUsers = 0;
        sendRequest(
            'claro_workspace_ajax_generic_user_search_workspace',
            {'search': search, 'id': twigWorkspaceId},
            function(data){
                $('.checkbox_user_name').remove();
                $('#user_checkboxes').empty();
                createUsersChkBoxes(data);
                $('#user_loading').hide();
            }
        );
    });

    $('#search_group_button').click(function(){
        $('#group_loading').show();
        var search = document.getElementById('search_group_txt').value;
        nbIterationGroups = 0;
        sendRequest(
            'claro_workspace_ajax_generic_group_search_workspace',
            {'search': search, 'id': twigWorkspaceId},
            function(data){
                $('.checkbox_group_name').remove();
                $('#group_checkboxes').empty();
                createGroupsChkBoxes(data);
                $('#group_loading').hide();
            }
        );
    });

    function setOnAddUserChkBox(userId)
    {
        sendRequest(
            'claro_workspace_ajax_add_user_workspace',
            {'userId': userId, 'workspaceId': twigWorkspaceId},
            function(data){
                createUserCallbackLi(data);
            }
        );
    }

    function setOnRemoveUserChkBox(userId)
    {
        sendRequest(
            'claro_workspace_ajax_delete_user_workspace',
            {'userId': userId, 'workspaceId': twigWorkspaceId},
            function(data){
                $('#user_' + userId).remove();
            }
        );
    }

    function setOnAddGroupChkBox(groupId)
    {
        sendRequest(
            'claro_workspace_ajax_add_group_workspace',
            {'groupId': groupId, 'workspaceId': twigWorkspaceId},
            function(data){
                $('#workspace_groups').append(data);
            }
        );
    }

    function setOnRemoveGroupChkBox(groupId)
    {
        sendRequest(
            'claro_workspace_ajax_delete_group_workspace',
            {'groupId': groupId, 'workspaceId': twigWorkspaceId},
            function(data){
                $('#group_' + groupId).remove();
            }
        );
    }

    function sendRequest(route, routeParams, successHandler)
    {
        $.ajax({
            type: 'POST',
            url: Routing.generate(route, routeParams),
            cache: false,
            dataType: 'html',
            success: successHandler,
            error: function(xhr){
                alert(xhr.status);
            }
        });
    }

    function createGroupsChkBoxes(JSONString)
    {
        JSONObject = eval(JSONString);
        //chkboxes creation
        var i=0;
        while (i<JSONObject.length)
        {
            var list = '<tr>'
            +'<td><input class="checkbox_group_name" id="checkbox_group_'+JSONObject[i].id+'" type="checkbox" value="'+JSONObject[i].id+'" id="checkbox_group_'+JSONObject[i].id+'">'+JSONObject[i].name+'</input></td>'
            +'</tr>';
            $('#group_checkboxes').append(list);
            i++;
        }
    }

    function createUsersChkBoxes(JSONString)
    {
        JSONObject = eval(JSONString);
        //chkboxes creation
        var i=0;
        while (i<JSONObject.length)
        {  
            var list = '<tr>'
            +'<td><input class="checkbox_user_name" id="checkbox_user_'+JSONObject[i].id+'" type="checkbox" value="'+JSONObject[i].id+'" id="checkbox_user_'+JSONObject[i].id+'">'+JSONObject[i].username+' '+JSONObject[i].lastName+' '+JSONObject[i].firstName+'</input></td>'
            +'</tr>';
            $('#user_checkboxes').append(list);
            i++; 
        }    
    }

    function createUserCallbackLi(JSONString)
    {
        JSONObject = eval(JSONString);
        console.debug(JSONObject);
        var i=0;
        while (i<JSONObject.length)
        {
            var li = '<li class="row_user" id="user_'+JSONObject[i].id+'">'+JSONObject[i].username
            +'<a href="'+Routing.generate('claro_workspace_delete_user_workspace', {'userId':JSONObject[i].id, 'workspaceId':twigWorkspaceId })+' id="link_delete_user_'+JSONObject[i].id+'">'+ twigDeleteTranslation+'</a>';
            +'</li>';
            alert(li);
            $('#workspace_users').append(li);
            i++;
        }
    } 
});