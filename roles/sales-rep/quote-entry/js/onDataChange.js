define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
            //console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls) {
            console.log('data changed!');
            bezl.vars.linesloading = false;

            bezl.vars.quoteData.quoteLines = bezl.data.QuoteDtls;

            //bezl.vars.ds.QuoteHed = bezl.data.Quotes.find(hed => hed.QuoteNum === bezl.vars.quoteData.quoteNum);
            bezl.vars.ds.QuoteHed = [];
            bezl.vars.ds.QuoteDtl = [];

            bezl.data.Quotes.forEach(hed => {
                if (hed.QuoteNum === bezl.vars.quoteData.quoteNum) {
                    bezl.vars.ds.QuoteHed.push({
                        QuoteNum: hed.QuoteNum,
                        CustNum: hed.CustNum,
                        CustID: hed.CustID,
                        Name: hed.Name,
                        Company: hed.Company
                    });
                }
            });

            bezl.data.QuoteDtls.forEach(dtl => {
                bezl.vars.ds.QuoteDtl.push({
                    QuoteNum: dtl.QuoteNum,
                    QuoteLine: dtl.QuoteLine,
                    PartNum: dtl.PartNum,
                    OrderQty: dtl.OrderQty,
                    SellingExpectedUM: dtl.SellingExpectedUM,
                    Company: 'EPIC03',
                    CustNum: dtl.CustNum
                });
            });
            //bezl.vars.ds.QuoteDtl = bezl.data.QuoteDtls;

            //console.log(bezl.vars.ds);

            var partList = [{ "PartNum": "Server1" }, { "PartNum": "Server2" }, { "PartNum": "Server3" }]

            bezl.vars.quoteData.quoteLines.map(dtl => {
                var typeAhead = function (lineNum) {
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
                        order: "asc",
                        maxItem: 8,
                        display: ['PartNum', 'PartDesc'],
                        source: {
                            data: function () { return bezl.data.Parts; }
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
    }

    return {
        onDataChange: OnDataChange
    }
});