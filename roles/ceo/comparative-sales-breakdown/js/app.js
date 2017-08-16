define(function () {

    function GetData(bezl, queryName) {

        switch (queryName) {
            case "SummaryData":
                bezl.vars.loadingSummaryData = true;
                bezl.dataService.add('SummaryData',
                    'brdb',
                    bezl.vars.config.summaryDataPlugin,
                    bezl.vars.config.summaryDataMethod, 
                    bezl.vars.config.summaryDataArgs, 0);  

                break;
                case "ByProduct":
                bezl.vars.loadingByProduct = true;
                bezl.dataService.add('ByProduct',
                    'brdb',
                    bezl.vars.config.byProductDataPlugin,
                    bezl.vars.config.byProductDataMethod, 
                    bezl.vars.config.byProductDataArgs, 0);  

                break;
        }
    }

    function ShowDetails(bezl) {
        $('#ytdSalesDetails').modal('show');
        $("#ytdSalesDetails").appendTo('body');
    }

    function HideDetails(bezl) {
        $('#ytdSalesDetails').modal('hide');
    }

    return {
        getData: GetData,
        showDetails: ShowDetails,
        hideDetails: HideDetails
    }
});
    