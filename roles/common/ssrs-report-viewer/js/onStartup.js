define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = true;
        bezl.vars.reportSelected = false;
        bezl.functions.reportListing(bezl, '/reports/customreports');
    }

    return {
        onStartup: OnStartup
    }
});