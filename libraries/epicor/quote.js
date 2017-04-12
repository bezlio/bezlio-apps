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
        bezl.vars.ds.QuoteQty = [];
        var quoteNum;
        var custNum;

        // bezl.data.Quotes.forEach(hed => {
        //     if (hed.QuoteNum === bezl.vars.quoteData.quoteNum) {
        //         console.log(hed);
        //         console.log(bezl.vars.quoteData);
        //         bezl.vars.ds.QuoteHed.push({
        //             QuoteNum: hed.QuoteNum,
        //             CustNum: hed.CustNum,
        //             CustID: hed.CustID,
        //             Name: hed.Name,
        //             Company: hed.Company,
        //             QuoteClosed: (hed.QuoteClosed === false) ? 0 : 1
        //         });
        //         quoteNum = hed.QuoteNum;
        //         custNum = hed.CustNum;
        //     }
        // });

        bezl.vars.ds.QuoteHed.push({
            QuoteNum: bezl.vars.quoteData.quoteNum,
            CustNum: bezl.vars.quoteData.custNum,
            CustID: bezl.vars.quoteData.customerId,
            Name: bezl.vars.quoteData.customerName,
            Company: 'EPIC03',
            QuoteClosed: (bezl.vars.quoteData.status === false) ? false : true,
            RowMod: 'U'
        });

        console.log(bezl.vars.ds.QuoteHed);

        quoteNum = bezl.vars.quoteData.quoteNum;
        custNum = bezl.vars.quoteData.custNum;

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

            if (dtl.Attributes !== undefined) {
                let cnt = 2;
                if (dtl.QuoteLine === 4) {
                    console.log(dtl);
                }
                dtl.Attributes.find(att => att.ATTRIBUTE_ID === "000_QUANTITY").ATTRIBUTE_VALUES.map(quoteQty => {

                    if (!isNaN(Number(quoteQty.ATTRIBUTE_VALUE))) {
                        bezl.vars.ds.QuoteQty.push({
                            QuoteNum: quoteNum,
                            QuoteLine: dtl.QuoteLine,
                            QtyNum: cnt,
                            OurQuantity: Number(quoteQty.ATTRIBUTE_VALUE),
                            SellingQuantity: Number(quoteQty.ATTRIBUTE_VALUE),
                            PricePerCode: 'E',
                            Company: 'EPIC03',
                            RowMod: 'U'
                        });
                        cnt++;
                    }
                });

                console.log(bezl.vars.ds);

                dtl.Attributes.map(attr => {
                    if (attr.hasOwnProperty("SELECTED_VALUE")) {
                        bezl.dataService.add('QuoteAttrs', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                            "QueryName": "InsertAttributes",
                            "Parameters": [
                                { Key: "QuoteNum", Value: quoteNum },
                                { Key: "QuoteLine", Value: dtl.QuoteLine },
                                { Key: "PartID", Value: dtl.PartNum },
                                { Key: "AttributeID", Value: attr.ATTRIBUTE_ID },
                                { Key: "ParentID", Value: '' },
                                { Key: "AttributeValue", Value: (attr.SELECTED_VALUE === 'OTHER') ? attr.ATTRIBUTE_VALUES.find(val => val.ATTRIBUTE_VALUE === 'OTHER').SELECTED_VALUE : attr.SELECTED_VALUE },
                                { Key: "AttributeDesc", Value: attr.ATTRIBUTE_DESCRIPTION },
                                { Key: "PartNum", Value: dtl.PartNum }
                            ]
                        }, 0)
                    }
                    if (attr.ATTRIBUTE_VALUES.hasOwnProperty("SUB_ATTRIBUTE")) {
                        attr.ATTRIBUTE_VALUES.SUB_ATTRIBUTE.map(subAttr => {
                            subAttr.ATTRIBUTE_VALUES.map(subAttrVal => {
                                bezl.dataService.add('QuoteAttrs', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                                    "QueryName": "InsertAttributes",
                                    "Parameters": [
                                        { Key: "QuoteNum", Value: quoteNum },
                                        { Key: "QuoteLine", Value: dtl.QuoteLine },
                                        { Key: "PartID", Value: Date().now() },
                                        { Key: "AttributeID", Value: subAttr.ATTRIBUTE_ID },
                                        { Key: "ParentID", Value: attr.ATTRIBUTE_ID },
                                        { Key: "AttributeValue", Value: subAttrVal.ATTRIBUTE_VALUE },
                                        { Key: "AttributeDesc", Value: subAttr.ATTRIBUTE_DESCRIPTION },
                                        { Key: "PartNum", Value: dtl.PartNum }
                                    ]
                                }, 0)
                            });
                        });
                    }
                });
            }
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
                "ds": JSON.stringify(bezl.vars.ds),
                "attrDs": JSON.stringify(bezl.vars.attrs)
            }, 0);
    }

    return {
        newQuote: NewQuote,
        saveQuote: SaveQuote
    }
});