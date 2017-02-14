define(function(){

    function OnDataChange(bezl) {
            bezl.data = dataResp;

            if (bezl.data.Events && !bezl.data.AddCalendarEvent) {
            bezl.vars['refreshing'] = true;
            
            bezl.vars['events'] = [];
            
            
            for (var i = 0; i < bezl.data.Events.length; i++) {
                if (bezl.data.Events[i]['Start'] != null && bezl.data.Events[i]['End'] != null && bezl.data.Events[i]['Deleted'] != 'X') {
                bezl.vars['events'].push({ title: bezl.data.Events[i]['Title'], start: bezl.data.Events[i]['Start'], end: bezl.data.Events[i]['End'], details: bezl.data.Events[i]['Details'], color: bezl.data.Events[i]['Color'], id: bezl.data.Events[i]['ID']});
                } else if (bezl.data.Events[i]['Start'] != null && bezl.data.Events[i]['Deleted'] != 'X') {
                    bezl.vars['events'].push({ title: bezl.data.Events[i]['Title'], start: bezl.data.Events[i]['Start'], details: bezl.data.Events[i]['Details'], color: bezl.data.Events[i]['Color'], id: bezl.data.Events[i]['ID'] });
                }
            }
            bezl.vars['refreshing'] = false;
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar( 'addEventSource', bezl.vars['events'] );
            $('#calendar').fullCalendar( 'today' );
            
            }
            
            if (bezl.data.AddCalendarEvent) {
                //refresh events
                //bezl.dataService.process('Events');
            
                //addes event to calendar directly, for seemless add
            //$('#calendar').fullCalendar( 'addEvent', bezl.vars['selectedEvent'] );
            
                // Clear out this data subscription so this logic will not continue 
                // to fire again
                bezl.dataService.remove('AddCalendarEvent');
                bezl.data.AddCalendarEvent = null;
                
                bezl.vars['dialogVisible'] = false;
                bezl.notificationService.showSuccess('Event has been saved');
                bezl.vars['saving'] = false;
            }

            if (bezl.data.DeleteCalendarEvent) {
                //refresh events
                bezl.dataService.process('Events');

                // Clear out this data subscription so this logic will not continue 
                // to fire again
                bezl.dataService.remove('DeleteCalendarEvent');
                bezl.data.DeleteCalendarEvent = null;

                bezl.functions['updateCalendar']();
                    
                bezl.vars['dialogVisible'] = false;
                bezl.notificationService.showSuccess('Event has been deleted');
                bezl.vars['deleting'] = false;
            }

            if (bezl.data.UpdateCalendarEvent) {
                //refresh events
                bezl.dataService.process('Events');

                // Clear out this data subscription so this logic will not continue 
                // to fire again
                bezl.dataService.remove('UpdateCalendarEvent');
                bezl.data.UpdateCalendarEvent = null;
                
                require(['https://rawgit.com/bezlio/bezlio-apps/master/roles/common/main-view/js/calendar.js'], function(functions) {
                    functions.updateCalendar(bezl)
                });

                bezl.vars['dialogVisible'] = false;
                bezl.notificationService.showSuccess('Event has been Updated');
                bezl.vars['saving'] = false;
            }

        }

    return {
        OnDataChange: OnDataChange
    }
});