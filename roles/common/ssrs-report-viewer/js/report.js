define(function () {
    function RunReport(bezl, parm) {
        bezl.vars.reportLoading = true;
        bezl.vars.reportSelected = true;
        bezl.vars.selectedReport = parm;

        bezl.dataService.add('Report', 'brdb', 'SSRS', 'ReturnAsPDF', {

        }, 0);
    }

    return {
        runReport: RunReport
    }
});