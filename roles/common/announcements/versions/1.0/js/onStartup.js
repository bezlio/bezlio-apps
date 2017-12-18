define(["./announcement.js"], function (announcement) {
 
  function OnStartup (bezl) {

    // Load up the announcements listing from the data source
    bezl.dataService.add('announcements',
                         'brdb',
                         bezl.vars.config.announcementsPlugin,
                         bezl.vars.config.announcementsMethod, 
                         bezl.vars.config.announcementsArgs, 0);

    // Also pull in a group membership listing we can use to determine which users should see which announcements
    bezl.dataService.add('userGroups',
                         'brdb',
                         bezl.vars.config.announcementsPlugin,
                         bezl.vars.config.announcementsMethod, 
                         bezl.vars.config.groupMembershipArgs, 0);

    // This timer is responsible for advancing the slides        
    bezl.vars.timer = setInterval(function(){ 
      try {
        if (bezl.vars.announcements != []) {
          announcement.navigateRight(bezl);
        }
      }
      catch(err) {
          console.log(err.message);
      }
    }, bezl.vars.config.slideInterval);

  }
  
  return {
    onStartup: OnStartup
  }
});