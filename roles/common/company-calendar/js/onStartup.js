define(["./calendar.js"], function (calendar) {
 
  function OnStartup (bezl) {

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