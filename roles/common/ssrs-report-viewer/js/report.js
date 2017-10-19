define(function () {
    function ReportListing(bezl, parm) {
        bezl.dataService.add('ReportListing', 'brdb', 'SSRS', 'GetReportList', {
            "FolderName": parm.FolderName,
            "ReportName": parm.ReportName
        });
    }

    function RunReport(bezl, parm) {
        if (parm.Type === "Report") {
            bezl.vars.selectedReport = parm;
            bezl.vars.reportLoading = true;
            bezl.vars.reportSelected = true;

            bezl.dataService.add('Report', 'brdb', 'SSRS', 'ReturnAsPDF', {
                "FolderName": "bleh",
                "ReportName": "blehbleh"
            }, 0);
        } else {
            this.reportListing(bezl, { 'FolderName': bezl.vars.currentPath + '/' + parm.Name, 'ReportName': '' });
            bezl.vars.currentPath += '/' + parm.Name;
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

    function DirectoryUp(bezl) {
        bezl.vars.currentPath = bezl.vars.currentPath.substring(0, bezl.vars.currentPath.lastIndexOf('/'));
        this.reportListing(bezl, { 'FolderName': bezl.vars.currentPath, 'ReportName': '' });
    }

    return {
        reportListing: ReportListing,
        runReport: RunReport,
        back: Back,
        directoryUp: DirectoryUp
    }
});