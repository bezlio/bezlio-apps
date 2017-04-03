define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;

            console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls) {
            bezl.vars.linesloading = false;

            // bezl.data.QuoteDtls.forEach(dtl => {
            //     console.log(dtl);
            // });

            // bezl.data.QuoteDtls = bezl.data.QuoteDtls.filter(dtl => dtl.Deleted === 0);

            // bezl.data.QuoteDtls.forEach(dtl => {
            //     console.log(dtl);
            // });

            //var partList = [{ "PartNum": "Server1" }, { "PartNum": "Server2" }, { "PartNum": "Server3" }]

            bezl.data.QuoteDtls.map(dtl => {
                var typeAhead = function (lineNum) {
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
                        order: "asc",
                        maxItem: 8,
                        display: ['PART_DESCRIPTION', 'PART_ID'],
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

                setTimeout(typeAhead, 2, dtl.QuoteLine);
            });
        }

        if (bezl.data.newQuote) {
            bezl.vars.newQuoteNum = bezl.data.newQuote.QuoteHed[0].QuoteNum;

            bezl.data.slice(bezl.data.indexOf("newQuote"), 1);

            bezl.dataService.add('Quotes', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                "QueryName": "GetQuotesByRep"
            }, 0);
        }

    }

    return {
        onDataChange: OnDataChange
    }
});