(function() {
  'use strict';
  var db;

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

}());