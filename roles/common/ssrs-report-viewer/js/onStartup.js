define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = false;
        bezl.vars.reportSelected = false;
        bezl.functions.reportListing();
    }

    return {
        onStartup: OnStartup
    }
});