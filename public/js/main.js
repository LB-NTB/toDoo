
// #####################################################################
// #                                                                   #
// #  Sync - Notification                                              #
// #                                                                   #
// #####################################################################

function displayMessageNotification (notificationText){
	var messageNotification = document.getElementById('message');
	messageNotification.innerHTML = notificationText;
	messageNotification.className = 'showMessageNotification';

}	

// #####################################################################
// #                                                                   #
// #  Offline - Notification                                           #
// #                                                                   #
// #####################################################################

var offlineNotification = document.getElementById('offline');

function showIndicator() { 
	offlineNotification.innerHTML = 'You are currently offline.'; 
	offlineNotification.className = 'showOfflineNotification'; }

function hideIndicator() {
	offlineNotification.className = 'hideOfflineNotification';
}
window.addEventListener('online',hideIndicator);
window.addEventListener('offline', showIndicator);


// #####################################################################
// #                                                                   #
// #  Pendenzen erfassen / anzeigen / updaten                          #
// #                                                                   #
// #####################################################################


$(document).ready(function(){

    // wenn Checkbox geändert wird
    function checkboxChanged() {
        if ($(this)[0].hasAttribute('checked') == true) {
            var formData = {
            'id'      : $(this).attr('id'),
            'status' : 'unchecked' 
            }
        } else {
            var formData = {
            'id'      : $(this).attr('id'),
            'status'  : 'checked'
            }
        }; 
        $.ajax({
            type: 'POST',
            url:  'updateItem',
            data: formData  
        })
        .done(listItems)
    }

    // Liste erstellen
    function listItems(data){
        var json = JSON.parse(data);
            $('#list li').remove();         // Liste löschen
            json.forEach(function(item){    // Liste neu aufbauen
                if ($(item).prop('status') == 'checked') {
                    $("#list").append('<li><div class="checkbox"><input type="checkbox" id='+item.taskid+' checked><label>'+item.task+'</label></li></div>');
                }
                else {
                    $("#list").append('<li><div class="checkbox"><input type="checkbox" id='+item.taskid+'><label>'+item.task+'</label></li></div>');    
                }
            });
            $("input:checkbox").on('click', checkboxChanged); // EventHandler
    }

    // Neuer Task an Server senden und Liste aktualisieren d.h. neu aufbauen
    $("#form").submit(function(event){
    	/*var formData = {'pendenz' : $('input[name=pendenz]').val()};
    	$.ajax({
            type: 'POST',
            url:  'create',
            data: formData
        })
        .done(listItems)*/
    	event.preventDefault();
    });
    
    // Filter: alle Task anzeigen ( = Filter löschen)
    $("#listAll").click(function(){
        $.ajax({
            type: 'GET',
            url: 'listTasks'  
        })
        .done(listItems)
	});

    // Filter: nur geschlossene Tasks anzeigen
    $("#listClosed").click(function(){
        $.ajax({
            type: 'GET',
            url: 'listClosedTasks'
        })
        .done(listItems)   
	});

    // Filter: nur offene Tasks anzeigen
	$("#listOpen").click(function(){
        $.ajax({
            type: 'GET',
            url: 'listOpenTasks',
        })
        .done(listItems)   
    });
});