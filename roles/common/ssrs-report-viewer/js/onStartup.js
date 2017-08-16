define(function () {
    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = false;
    }

    return {
        onStartup: OnStartup
    }
});