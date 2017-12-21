
// #####################################################################
// #                                                                   #
// #  Register Service Worker                                          #
// #                                                                   #
// #####################################################################
    
//Register the service worker with Background Sync
if ('serviceWorker' in navigator && 'SyncManager' in window) { 
    navigator.serviceWorker.register('./sw.js')
    .then(registration => navigator.serviceWorker.ready) // geht nur mit Chrome!
    .then(function(registration){
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ',registration.scope);

        // SYNC
        document.getElementById('submit').addEventListener('click', () => {
            // muss ausserhalb von sync sein; sonst undefined
            var payload = {pendenz: document.getElementById('pendenz').value};  
            idbKeyval.set('createItem', payload)
            .then(() => registration.sync.register('task'))
            .catch(err => console.log('It failed!', err));
            //.then(displayMessageNotification('Message queued')) -> kann nicht mehr ausgeblendet werden...
        }); // ende SYNC
    }); 
} 
else {
    document.getElementById('submit').addEventListener('click', () => {
        var payload = {pendenz: document.getElementById('pendenz').value}; 
        fetch('/sendMessage/',{
            method: ‘POST’,
            headers: new Headers({
            'content-type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });
    });
}

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
            console.log("checked");
        } else {
            var formData = {
            'id'      : $(this).attr('id'),
            'status'  : 'checked'
            }
            console.log("unchecked");
        }; 
        $.ajax({
            type: 'POST',
            url:  'task',
            data: formData  
        })
    }

    // eventListener zu allen Checkboxen hinzufügen
    window.addEventListener("load", function(){
        var i;
        elems = document.getElementsByClassName("checkbox");
        for(i = 0; i < elems.length; i++) {
        elems[i].addEventListener("click", checkboxChanged )
        }
    });

    // Neuer Task an Server senden und Liste aktualisieren d.h. neu aufbauen
    $("#form").submit(function(event){
/*    	var formData = {'pendenz' : $('input[name=pendenz]').val()}; -> wird neu mit ServiceWorker ausgeführt
    	$.ajax({
            type: 'POST',
            url:  'tasks',
            data: formData
        })*/
    	event.preventDefault();
    });
    
    // Filter: alle Task anzeigen ( = Filter löschen)
    $("#listAll").click(function(){
        $.ajax({
            type: 'GET',
            url: 'tasks'  
        })
	});

    // Filter: nur geschlossene Tasks anzeigen
    $("#listClosed").click(function(){
        $.ajax({
            type: 'GET',
            url: 'tasks?filter=CLOSED'
        })  
	});

    // Filter: nur offene Tasks anzeigen
	$("#listOpen").click(function(){
        $.ajax({
            type: 'GET',
            url: 'tasks?filter=OPEN',
        })
        //.done(listItems)   
    });
});