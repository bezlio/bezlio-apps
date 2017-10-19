define(function () {
    function ReportListing(bezl, parm) {
        bezl.dataService.add('ReportListing', 'brdb', 'SSRS', 'GetReportList', {
            "FolderName": "/reports/customreports",
            "ReportName": ""
        });
    }

    function RunReport(bezl, parm) {
        bezl.vars.reportLoading = true;
        bezl.vars.reportSelected = true;
        bezl.vars.selectedReport = parm;

        // bezl.dataService.add('ReportListing', 'brdb', 'SSRS', 'GetReportList', {
        //     "FolderName": "bleh",
        //     "ReportName": "blehbleh"
        // }, 0);

        bezl.dataService.add('Report', 'brdb', 'SSRS', 'ReturnAsPDF', {
            "FolderName": "bleh",
            "ReportName": "blehbleh"
        }, 0);
    }

    return {
        reportListing: ReportListing,
        runReport: RunReport
    }
});