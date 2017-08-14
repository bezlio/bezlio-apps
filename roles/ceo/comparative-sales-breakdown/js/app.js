define(function () {

    function GetData(bezl, queryName) {

        switch (queryName) {
            case "SummaryData":
                bezl.vars.loadingSummaryData = true;
                bezl.dataService.add('SalesData',
                    'brdb',
                    bezl.vars.config.salesDataPlugin,
                    bezl.vars.config.salesDataMethod, 
                    bezl.vars.config.salesDataArgs, 0);  

                break;
        }
    }

    return {
        getData: GetData
    }
});
    