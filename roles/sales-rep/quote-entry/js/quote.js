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
        //bezl.data.QuoteDtls = bezl.data.QuoteDtls.filter(dtl => dtl.Deleted === 0);

        var lineNum = Math.max.apply(Math, bezl.data.QuoteDtls.map(function (dtl) { return dtl.QuoteLine; }));

        bezl.data.QuoteDtls.push({ QuoteLine: lineNum + 1, PartNum: '', OrderQty: 1, SellingExpectedUM: 'EA', Deleted: 0 });

        //var partList = [{ "PartNum": "Server1" }, { "PartNum": "Server2" }, { "PartNum": "Server3" }]

        var typeAhead = function (lineNum) {
            $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
            $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
                order: "asc",
                maxItem: 8,
                display: ['PART_DESCRIPTION'],
                source: {
                    data: function () { return bezl.vars.parts; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        console.log("test");
                    }
                }
            });
        }

        // $('#example').DataTable({
        //     data: dataSet,
        //     columns: [
        //         { title: "Name" },
        //         { title: "Position" },
        //         { title: "Office" },
        //         { title: "Extn." },
        //         { title: "Start date" },
        //         { title: "Salary" }
        //     ]
        // });

        setTimeout(typeAhead, 2, lineNum + 1);
    }

    function DeleteLine(bezl, lineNum) {
        //console.log("Line: " + lineNum);

        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).Deleted = 1;
    }

    function ConfigureLine(bezl, partNum) {
        var filterArray = bezl.vars.parts.find(part => part.PART_DESCRIPTION === partNum).ATTRIBUTES;

        bezl.vars.curAttr = [];
        var curLine = bezl.data.QuoteDtls.find(dtl => dtl.PartNum === partNum);
        curLine.Attributes = [];

        filterArray.forEach(attr => {
            var attrFnd = bezl.vars.attributes.find(attribute => attribute.ATTRIBUTE_ID === attr.ATTRIBUTE_ID);

            console.log(attrFnd);
            if (!attrFnd.hasOwnProperty("SELECTION_MODE")) {
                attrFnd.SELECTED_VALUE = null;
            }
            attrFnd.Display = false;
            //bezl.vars.curAttr.push(attrFnd);
            curLine.Attributes.push(attrFnd);
        });
    }

    return {
        runQuery: RunQuery,
        returnToSummary: ReturnToSummary,
        addLine: AddLine,
        deleteLine: DeleteLine,
        configureLine: ConfigureLine
    }
});

// require(['https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/js/quote.js'], function(functions) {
// 	functions.runQuery(bezl, "Quotes");
// });