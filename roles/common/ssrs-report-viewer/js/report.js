define(function () {
    function ReportListing(bezl, folderName, reportName) {
        bezl.dataService.add('ReportListing', 'brdb', 'SSRS', 'GetReportList', {
            "FolderName": folderName,
            "ReportName": reportName
        });
    }

    function RunReport(bezl, parm) {
        bezl.vars.selectedReport = parm;

        if (parm.Type === "Report") {
            bezl.vars.reportLoading = true;
            bezl.vars.reportSelected = true;

            bezl.dataService.add('Report', 'brdb', 'SSRS', 'ReturnAsPDF', {
                "FolderName": "bleh",
                "ReportName": "blehbleh"
            }, 0);
        } else {
            //this.reportListing(bezl, )
        }
    }

    return {
        reportListing: ReportListing,
        runReport: RunReport
    }
});

require([bezl.vars.config.baseJsUrl + 'report.js'], function (functions) {
    functions.back(bezl)
});

