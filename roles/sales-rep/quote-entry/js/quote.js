define(function () {

    function RunQuery(bezl, queryName) {
        switch (queryName) {
            case "Quotes":
                bezl.vars.loading = true;

                bezl.dataService.add('Quotes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuotesByRep",
                    "Parameters": [
                        { Key: "SalesRep", Value: bezl.env.currentUser },
                        { Key: "Company", Value: bezl.vars.Company }
                    ]
                }, 0);
                break;
            case "SalesReps":
                bezl.dataService.add('SalesReps', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetSalesReps"
                }, 0);
                break;
            case "Customers":
                bezl.dataService.add('Customers', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetCustomersByRep",
                    "Parameters": [
                        { Key: "SalesRep", Value: bezl.env.currentUser },
                        { Key: "Company", Value: bezl.vars.Company }
                    ]
                }, 0);
                break;
            case "Suspects":
                bezl.dataService.add('Suspects', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetSuspects",
                    "Parameters": [
                        { Key: "Company", Value: bezl.vars.Company }
                    ]
                }, 0);
                break;
            case "QuoteDtls":
                bezl.dataService.add('QuoteDtls', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuoteDetails",
                    "Parameters": [
                        { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum }
                    ]
                }, 0);
                break;
            case "QuoteQty":
                bezl.dataService.add('QuoteQty', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetQuoteQty",
                    "Parameters": [
                        { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum },
                        { Key: "QuoteLine", Value: bezl.vars.quoteAttributeLine }
                    ]
                }, 0);
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
                        { Key: "QuoteLine", Value: bezl.vars.quoteAttributeLine },
                        { Key: "PartNum", Value: bezl.vars.quotePart }
                    ]
                })
                break;
        }
    }

    function ReturnToSummary(bezl) {
        bezl.vars.editingQuote = false;
        bezl.vars.newQuote = false;

        bezl.vars.quoteData = {
            quoteDate: new Date(),
            salespersonId: bezl.env.currentUser,
            customerId: '',
            comments: '',
            status: 'Open',
            result: '',
            quoteLines: []
        };

        bezl.dataService.remove('Attributes');
        //bezl.dataService.remove('QuoteDtls');
    }

    function IncludeSuspects(bezl, parm) {
        if (parm.srcElement.checked === true) {
            //console.log(bezl.data.Customers);
            //console.log(bezl.data.Suspects);
            bezl.data.Suspects.map(sus => {
                bezl.data.Customers.push({
                    CustID: sus.CustID,
                    CustNum: sus.CustNum,
                    CustomerType: 'SUS',
                    Name: sus.Name,
                    SalesRepCode: 'NONE'
                });
            });
        } else {
            bezl.data.Customers = bezl.data.Customers.filter(cust => cust.CustomerType !== 'SUS');
        }
    }

    function AddLine(bezl) {

        var lineNum = Math.max.apply(Math, bezl.data.QuoteDtls.map(function (dtl) { return dtl.QuoteLine; }));

        lineNum = (lineNum === -Infinity) ? 0 : lineNum;

        bezl.data.QuoteDtls.push({ QuoteNum: bezl.vars.quoteData.quoteNum, QuoteLine: lineNum + 1, PartNum: '', OrderQty: 1, SellingExpectedUM: 'EA', Deleted: 0 });

        // var typeAhead = function (lineNum) {
        //     $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
        //     $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
        //         order: "asc",
        //         maxItem: 8,
        //         display: ['PART_DESCRIPTION'],
        //         source: {
        //             data: function () { return bezl.vars.parts; }
        //         },
        //         callback: {
        //             onClick: function (node, a, item, event) {
        //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = item.PART_DESCRIPTION;
        //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).ListItem = true;
        //             },
        //             onNavigateBefore: function (node, query, event) {
        //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = query;
        //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).ListItem = false;
        //             }
        //         }
        //     });
        // }

        //setTimeout(typeAhead, 2, lineNum + 1);
    }

    function DeleteLine(bezl, lineNum) {
        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).Deleted = 1;
    }

    function ConfigureLine(bezl, partNum, quoteLine, listItem) {
        if (listItem) {
            bezl.vars.attrLoading = true;
            var filterArray = JSON.parse(JSON.stringify(bezl.vars.parts.find(part => part.PART_DESCRIPTION === partNum).ATTRIBUTES));

            var curLine = bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === quoteLine);
            bezl.vars.quoteAttributeLine = quoteLine;
            bezl.vars.quotePart = curLine.PartNum;

            this.runQuery(bezl, "QuoteQty");
            this.runQuery(bezl, "Attributes");
        }
    }

    function ChangePart(bezl, lineNum, partNum) {
        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).PartNum = partNum;
        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).Attributes = undefined;
    }

    function ChangeAttribute(bezl, lineNum, attributeID, attributeValue) {
        //normal ngModelChange functionality
        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).Attributes.find(attr => attr.ATTRIBUTE_ID === attributeID).SELECTED_VALUE = attributeValue;

        //driving/dependent attribute functionality
        if (bezl.vars.attributes.find(attr => attr.ATTRIBUTE_ID === attributeID).hasOwnProperty('DRIVING_ATTRIBUTE')) {
            bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).Attributes.map(attr => {
                attr.ATTRIBUTE_VALUES.map(attrVal => {
                    attrVal.Display = true;
                    if (attrVal.hasOwnProperty('DEPENDENT_ATTRIBUTE')) {
                        if (attrVal.DEPENDENT_ATTRIBUTE.filter(depAttr => depAttr.ATTRIBUTE_ID === attributeID && depAttr.ATTRIBUTE_VALUE === attributeValue).length === 0)
                            attrVal.Display = false;
                    }
                });
            });
        }
    }

    return {
        runQuery: RunQuery,
        returnToSummary: ReturnToSummary,
        includeSuspects: IncludeSuspects,
        addLine: AddLine,
        deleteLine: DeleteLine,
        configureLine: ConfigureLine,
        changePart: ChangePart,
        changeAttribute: ChangeAttribute
    }
});