define(function(){

    function AddEvent(bezl) {
        
        $('#calendar').fullCalendar('renderEvent', bezl.vars['selectedEvent']);

        bezl.dataService.add('AddCalendarEvent','brdb','ODBC','ExecuteNonQuery',
        { "Context": "CompanyCalendarTesting","DSN":"CompanyCalendarTesting","QueryName":"AddCalendarEvent",
        "Parameters": [
            { Key: "Title", Value: bezl.vars['selectedEvent'].title },
            { Key: "Start", Value: bezl.vars['selectedEvent'].start },
            { Key: "End", Value: bezl.vars['selectedEvent'].end},
            { Key: "AllDay", Value: bezl.vars['selectedEvent'].allDay },
            { Key: "Details", Value: bezl.vars['selectedEvent'].details },
            { Key: "Color", Value: bezl.vars['selectedEvent'].color },
            { Key: "ID", Value: bezl.vars['selectedEvent'].id }
        ] },0);
    }

    function UpdateEvent(bezl) {
            bezl.vars['saving'] = true;

        if(bezl.vars['selectedEvent'].new != true) {

        bezl.dataService.add('UpdateCalendarEvent','brdb','ODBC','ExecuteNonQuery',
            { "Context": "CompanyCalendarTesting","DSN":"CompanyCalendarTesting","QueryName":"UpdateCalendarEvent",
            "Parameters": [
            { Key: "Title", Value: bezl.vars['selectedEvent'].title || '' },
            { Key: "Start", Value: bezl.vars['selectedEvent'].start || '' },
            { Key: "End", Value: bezl.vars['selectedEvent'].end || '' },
            { Key: "AllDay", Value: bezl.vars['selectedEvent'].allDay || false },
            { Key: "Details", Value: bezl.vars['selectedEvent'].details || '' },
            { Key: "Color", Value: bezl.vars['selectedEvent'].color || '' },
            { Key: "ID", Value: bezl.vars['selectedEvent'].id || '' }
            ] },0);
        
        } else {
            AddEvent(bezl);
        }
    }

    function DeleteEvent(bezl) {

        bezl.dataService.add('DeleteCalendarEvent','brdb','ODBC','ExecuteNonQuery',
        { "Context": "CompanyCalendarTesting","DSN":"CompanyCalendarTesting","QueryName":"DeleteCalendarEvent",
        "Parameters": [
            { Key: "ID", Value: bezl.vars['selectedEvent'].id }
        ] },0);

        bezl.vars['deleting'] = true;
    }

    function Refresh(bezl) {

        bezl.vars['refreshing'] = true;
        bezl.vars['events'] = null;
        bezl.dataService.process('Events');
        bezl.vars['dialogVisible'] = false;
    }

    function CreateCalendar(bezl) {

        console.log('making calendar');
  $('#calendar').fullCalendar({
        // put your options and callbacks here
       header: {
            left: "prev,next today",
            center: "title",
            right: "month,agendaWeek,agendaDay"
        },
        eventSources:[bezl.vars['events']],
  		nowIndicator: true,
    	eventClick: function(calEvent) {
          			//clear old selected Event
					bezl.functions['clearSelectedEvent']();
          
  					if (calEvent.title)
                        bezl.vars['selectedEvent'].title = calEvent.title;
                    if (calEvent.start)
                        bezl.vars['selectedEvent'].start = calEvent.start.format();
                    if (calEvent.end)
                        bezl.vars['selectedEvent'].end = calEvent.end.format();
                    if (calEvent.allDay)
                        bezl.vars['selectedEvent'].allDay = calEvent.allDay;

                    bezl.functions['colorPicker'](calEvent.color);

                    bezl.vars['selectedEvent'].id = calEvent.id;
                    bezl.vars['selectedEvent'].details = calEvent.details;

                    bezl.vars['dialogVisible'] = true;
  					},
  		dayClick: function(date) {
  					//clear old selected Event
                    clearSelectedEvent(bezl);
          
                    //generate UUID for event ID
                    require(['https://rawgit.com/bezlio/bezlio-apps/master/roles/common/main-view/js/extras.js'], function(functions) {
                    functions.generateUUID(bezl)
                });

                    if (date)
                        bezl.vars['selectedEvent'].start = date.format();

                        //sets flag to note that event is new
                        bezl.vars['selectedEvent'].new = true;

                        bezl.vars['selectedEvent'].title = "";
                        bezl.vars['selectedEvent'].end = "";
                        bezl.vars['selectedEvent'].allDay = false;
                        bezl.vars['selectedEvent'].id = bezl.vars['UUID'];

                    bezl.vars['dialogVisible'] = true;
  					},
    });
  //end of calendar options
    }

    function ClearSelectedEvent(bezl) {
                //Clear event data
        bezl.vars['selectedEvent'].title = "";
        bezl.vars['selectedEvent'].start = "";
        bezl.vars['selectedEvent'].end = "";
        bezl.vars['selectedEvent'].allDay = false;
        bezl.vars['selectedEvent'].details = "";
        bezl.vars['selectedEvent'].id = "";
        bezl.vars['selectedEvent'].color = "";
        bezl.vars['selectedEvent'].new = false;

        //clear the current color pick
        $("#redCP").css("border-color", "white");
        $("#blueCP").css("border-color", "white");
        $("#greenCP").css("border-color", "white");
        $("#orangeCP").css("border-color", "white");
        $("#purpleCP").css("border-color", "white");

    }

    return {
        addEvent: AddEvent,
        updateEvent: UpdateEvent,
        deleteEvent: DeleteEvent,
        refresh: Refresh,
        createCalendar: CreateCalendar,
        clearSelectedEvent: ClearSelectedEvent
    }
});