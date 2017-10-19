define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = true;
        bezl.vars.reportSelected = false;
        bezl.functions.reportListing({ 'FolderName': '/reports/customreports', 'ReportName': '' });
    }

    return {
        onStartup: OnStartup
    }
});