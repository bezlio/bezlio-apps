define(function () {
    /** Returns a new quote DS for the current customer
    @param {Object[]} bezl - reference to calling bezl
    @param {string} company - Company ID for the calling
    @param {Number} custNum - customer number
    */

    function NewQuote(bezl, company, custNum) {
        bezl.dataService.add('newQuote', 'brdb', 'Epicor10', 'Quote_NewQuoteByCustomer',
            {
                "Connection": "Epicor 10 RS",
                "Company": "EPIC03",
                "CustNum": custNum,
            }, 0);

        bezl.vars.newQuote = true;
    }

    function SaveQuote(bezl, company, quoteNum) {
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        var quoteNum;
        var custNum;

        bezl.data.Quotes.forEach(hed => {
            if (hed.QuoteNum === bezl.vars.quoteData.quoteNum) {
                bezl.vars.ds.QuoteHed.push({
                    QuoteNum: hed.QuoteNum,
                    CustNum: hed.CustNum,
                    CustID: hed.CustID,
                    Name: hed.Name,
                    Company: hed.Company
                });
                quoteNum = hed.QuoteNum;
                custNum = hed.CustNum;
            }
        });

        bezl.data.QuoteDtls.forEach(dtl => {
            bezl.vars.ds.QuoteDtl.push({
                QuoteNum: quoteNum,
                QuoteLine: dtl.QuoteLine,
                PartNum: dtl.PartNum,
                LineDesc: dtl.PartNum,
                OrderQty: dtl.OrderQty,
                SellingExpectedUM: dtl.SellingExpectedUM,
                Company: 'EPIC03',
                CustNum: custNum,
                RowMod: (dtl.Deleted === 1) ? 'D' : 'U'
            });
        });


        var removeLines = [];
        for (var x of bezl.data.QuoteDtls) {
            if (x.Deleted === 1) {
                removeLines.push(x.QuoteLine);
            }
        }

        removeLines.forEach(dtl => {
            var index = bezl.data.QuoteDtls.indexOf(bezl.data.QuoteDtls.find(subDtl => subDtl.QuoteLine === dtl));
            bezl.data.QuoteDtls.splice(index, 1);
        });

        bezl.dataService.add('saveQuote', 'brdb', 'Epicor10', 'Quote_SaveQuote',
            {
                "Connection": "Epicor 10 RS",
                "Company": "EPIC03",
                "QuoteNum": quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);
    }

    return {
        newQuote: NewQuote,
        saveQuote: SaveQuote
    }
});