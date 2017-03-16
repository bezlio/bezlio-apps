define(function () {

    function RunQuery(bezl, queryName) {
        switch (queryName) {
            case "Quotes":
                bezl.vars.loading = true;

                bezl.dataService.add('Quotes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuotesByRep"
                }, 0);
                break;
            case "SalesReps":
                bezl.dataService.add('SalesReps', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetSalesReps"
                }, 0);
                break;
            case "QuoteDtls":
                bezl.dataService.add('QuoteDtls', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuoteDetails",
                    "Parameters": [
                        { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum }
                    ]
                }, 0)
                break;
            case "Parts":
                bezl.dataService.add('Parts', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetParts"
                }, 0);
                break;
        }
    }

    function ReturnToSummary(bezl) {
        bezl.vars.editingQuote = false;

        bezl.vars.quoteData = {
            quoteDate: new Date(),
            salespersonId: bezl.env.currentUser,
            customerId: '',
            comments: '',
            status: 'Open',
            result: '',
            quoteLines: []
        };
    }

    function AddLine(bezl) {
        var lineNum = Math.max.apply(Math, bezl.vars.quoteData.quoteLines.map(function (dtl) { return dtl.QuoteLine; }));

        bezl.vars.quoteData.quoteLines.push({ QuoteLine: lineNum + 1, PartNum: '', Qty: 1, UOM: 'EA' });
    }

    return {
        runQuery: RunQuery,
        returnToSummary: ReturnToSummary,
        addLine: AddLine
    }
});

// require(['https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/js/quote.js'], function(functions) {
// 	functions.runQuery(bezl, "Quotes");
// });