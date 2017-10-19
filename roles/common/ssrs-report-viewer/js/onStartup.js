define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = false;
        bezl.functions.reportListing();
    }

    return {
        onStartup: OnStartup
    }
});