define(["./calendar.js"], function (calendar) {
 
  function OnStartup (bezl) {

    require(['node_modules/dist/fullcalendar.min.js'], function(calendar) {
        $('#calendar').fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          defaultDate: '2014-06-12',
          defaultView: 'agendaWeek',
          editable: true,
          events: [
            {
              title: 'All Day Event',
              start: '2014-06-01'
            },
            {
              title: 'Long Event',
              start: '2014-06-07',
              end: '2014-06-10'
            },
            {
              id: 999,
              title: 'Repeating Event',
              start: '2014-06-09T16:00:00'
            },
            {
              id: 999,
              title: 'Repeating Event',
              start: '2014-06-16T16:00:00'
            },
            {
              title: 'Meeting',
              start: '2014-06-12T10:30:00',
              end: '2014-06-12T12:30:00'
            },
            {
              title: 'Lunch',
              start: '2014-06-12T12:00:00'
            },
            {
              title: 'Birthday Party',
              start: '2014-06-13T07:00:00'
            },
            {
              title: 'Click for Google',
              url: 'http://google.com/',
              start: '2014-06-28'
            }
          ]
        });
        
      
    });

    // Load up the calendar details from the data source
    bezl.dataService.add('companyCalendar',
                         'brdb',
                         bezl.vars.config.companyCalendarPlugin,
                         bezl.vars.config.companyCalendarMethod, 
                         bezl.vars.config.companyCalendarArgs, 0);

  }
  
  return {
    onStartup: OnStartup
  }
});