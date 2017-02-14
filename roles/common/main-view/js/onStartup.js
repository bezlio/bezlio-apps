define(function(){

    function OnStartup(bezl) {

        require(['https://rawgit.com/bezlio/bezlio-apps/master/roles/common/main-view/js/calendar.js'], function(functions) {
                    functions.createCalendar(bezl)
                });

            require.config({
                paths: {
                    'fullCalendar': 'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar'
                }
            });
        }

    return {
        onStartup: OnStartup
    }
});