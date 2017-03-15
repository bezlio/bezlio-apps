define(function () {

    function RunQuery(bezl, queryName) {
        switch (queryName) {
            case "Quotes":
                bezl.dataService.add('Quotes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuotesByRep"
                }, 0);
                break;
        }
    }

    return {
        runQuery: RunQuery
    }
});