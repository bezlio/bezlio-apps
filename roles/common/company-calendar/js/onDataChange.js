define(["./calendar.js"], function (calendar) {
 
    function OnDataChange (bezl) {
        if (bezl.data.companyCalendar) {
            bezl.vars.config.calendarOptions.events = [];

            bezl.data.companyCalendar.forEach(event => {
                if (event.Active == 'X') {
                    bezl.vars.config.calendarOptions.events.push({
                        title: event.Title,
                        id: event.ID,
                        start: ((!event.Start.endsWith("T00:00:00")) ? event.Start : event.Start.split('T')[0]),
                        end: event.End,
                        url: event.URL
                    });
                }

            });

            require(['node_modules/fullcalendar/dist/fullcalendar.min.js'], function(calendar) {
                setTimeout(function(){
                    $('#calendar').fullCalendar(bezl.vars.config.calendarOptions);
                }, 100);
                
            });
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
