define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = false;

        bezl.dataService.add('ReportListing', 'brdb', 'SSRS', 'GetReportList', {
            "FolderName": "/reports/customreports",
            "ReportName": ""
        });
    }

    return {
        onStartup: OnStartup
    }
});