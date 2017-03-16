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

        console.log(bezl.data.Parts);

        var partTypeAhead = function (lineNum) {
            $('.js-typeahead-parts' + lineNum).typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function () { return bezl.data.Parts; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        // Add the line number into the item object so we can utilize it on partSelect
                        item.lineNum = lineNum;
                        // Now register the function that is called when you pick a part
                        bezl.functions.partSelect(item);
                    }
                    // onCancel: function (node, event) {
                    //     for (var i = 0; i < bezl.vars['quoteData'].quoteLines.length; i++) {
                    //         if (bezl.vars['quoteData'].quoteLines[i].lineNum == lineNum) {
                    //             bezl.vars['quoteData'].quoteLines[i].partNum = "";
                    //             bezl.vars['quoteData'].quoteLines[i].partDesc = "";
                    //         }
                    //     };
                    // }
                }
            });
        };

        setTimeout(partTypeAhead, 1, bezl.vars['lineNum']);
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