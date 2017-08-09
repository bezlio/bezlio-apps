define(["./calendar.js"], function (calendar) {
 
    function OnDataChange (bezl) {
        if (bezl.data.companyCalendar) {
            bezl.vars.events = [];

            bezl.data.companyCalendar.forEach(event => {
                if (event.Active == 'X') {
                    bezl.vars.events.push({
                        title: event.Title,
                        id: event.ID,
                        start: ((!event.Start.endsWith("T00:00:00")) ? event.Start : event.Start.split('T')[0]),
                        end: event.End,
                        url: event.URL
                    });
                }

            });

            require(['node_modules/dist/fullcalendar.min.js'], function(calendar) {
                $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultView: bezl.vars.config.defaultView,
                events: bezl.vars.events,
                eventClick: function(event) {
                    if (event.url) {
                        window.open(event.url);
                        return false;
                    }
                }
                });
            });
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
