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
            case "QuoteQty":
                bezl.dataService.add('QuoteQty', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuoteQty",
                    "Parameters": [
                        { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum },
                        { Key: "QuoteLine", Value: bezl.vars.quoteAttributeLine }
                    ]
                })
                break;
            case "Parts":
                bezl.dataService.add('Parts', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetParts"
                }, 0);
                break;
            case "Attributes":
                bezl.dataService.add('Attributes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuoteAttributes",
                    "Parameters": [
                        { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum },
                        { Key: "QuoteLine", Value: bezl.vars.quoteAttributeLine }
                    ]
                })
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

        lineNum = (lineNum === -Infinity) ? 0 : lineNum;

        bezl.data.QuoteDtls.push({ QuoteNum: bezl.vars.quoteData.quoteNum, QuoteLine: lineNum + 1, PartNum: '', OrderQty: 1, SellingExpectedUM: 'EA', Deleted: 0 });

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
                        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = item.PART_DESCRIPTION;
                    }
                }
            });
        }

        setTimeout(typeAhead, 2, lineNum + 1);
    }

    function DeleteLine(bezl, lineNum) {
        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).Deleted = 1;
    }

    function ConfigureLine(bezl, partNum, quoteLine) {
        bezl.vars.attrLoading = true;
        var filterArray = JSON.parse(JSON.stringify(bezl.vars.parts.find(part => part.PART_DESCRIPTION === partNum).ATTRIBUTES));

        var curLine = bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === quoteLine);
        bezl.vars.quoteAttributeLine = quoteLine;

        this.runQuery(bezl, "QuoteQty");
        this.runQuery(bezl, "Attributes");

        if (curLine.Attributes === undefined) {
            curLine.Attributes = [];

            filterArray.forEach(attr => {
                var attrFnd = JSON.parse(JSON.stringify(bezl.vars.attributes.find(attribute => attribute.ATTRIBUTE_ID === attr.ATTRIBUTE_ID)));
                //var attrFnd = jQuery.extend(true, {}, bezl.vars.attributes.find(attribute => attribute.ATTRIBUTE_ID === attr.ATTRIBUTE_ID));

                attrFnd.Display = false;
                attrFnd.QuoteNum = curLine.QuoteNum;
                attrFnd.QuoteLine = curLine.QuoteLine;
                curLine.Attributes.push(attrFnd);
            });
        }
    }

    return {
        runQuery: RunQuery,
        returnToSummary: ReturnToSummary,
        addLine: AddLine,
        deleteLine: DeleteLine,
        configureLine: ConfigureLine
    }
});