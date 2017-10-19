define(function () {
    function ReportListing(bezl, parm) {
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

    function Back(bezl) {
        bezl.vars.reportSelected = false;
        bezl.vars.selectedReport = { "ReportDetails": { "ParameterFields": [] } };
        bezl.vars.promptForParameters = false;
        bezl.vars.reportLoading = false;
        var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
        viewer.src = 'about:blank';
    }

    return {
        reportListing: ReportListing,
        runReport: RunReport,
        back: Back
    }
});

