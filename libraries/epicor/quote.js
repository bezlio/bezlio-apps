define(function () {
    /** Returns a new quote DS for the current customer
    @param {Object[]} bezl - reference to calling bezl
    @param {string} company - Company ID for the calling
    @param {Number} custNum - customer number
    */

    function NewQuote(bezl, connection, company, custID) {
        bezl.dataService.add('newQuote', 'brdb', 'Epicor10', 'Quote_NewQuoteByCustomer',
            {
                "Connection": connection,
                "Company": company,
                "CustID": custID,
            }, 0);

        bezl.vars.newQuote = true;
    }

    function UpdateCustomer(bezl, custID) {
        console.log("CustID: " + custID);
        console.log(bezl.data.Customers);

        var curCust = bezl.data.Customers.find(cust => cust.CustID === custID);

        console.log(curCust);

        //reference 
        // bezl.vars.quoteData = {
        //     newQuote: false,
        //     quoteNum: parm.QuoteNum,
        //     quoteDate: new Date(parm.EntryDate),
        //     salespersonId: parm.SalesRepCode,
        //     customerId: parm.CustID,
        //     custNum: parm.CustNum,
        //     customerName: parm.Name,
        //     comments: parm.QuoteComment,
        //     status: parm.QuoteClosed,
        //     result: parm.Result,
        //     quoteLines: []
        // };
    }

    function SaveQuote(bezl, connection, company, quoteData) {
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        bezl.vars.ds.QuoteQty = [];
        var quoteNum;
        var custNum;

        bezl.vars.ds.QuoteHed.push({
            QuoteNum: quoteData.quoteNum,
            CustNum: quoteData.custNum,
            CustID: quoteData.customerId,
            BTCustNum: quoteData.custNum,
            Name: quoteData.customerName,
            CustomerCustID: quoteData.customerId,
            MktgCampaignID: 'Customer',
            MktgEvntSeq: 1,
            Company: company,
            RowMod: 'U'
        });

        quoteNum = quoteData.quoteNum;
        custNum = quoteData.custNum;

        bezl.data.QuoteDtls.forEach(dtl => {
            console.log(dtl);
            bezl.vars.ds.QuoteDtl.push({
                QuoteNum: quoteNum,
                QuoteLine: dtl.QuoteLine,
                PartNum: dtl.PartNum,
                LineDesc: dtl.LineComment,
                OrderQty: dtl.OrderQty,
                SellingExpectedUM: dtl.SellingExpectedUM,
                Company: company,
                CustNum: custNum,
                RowMod: (dtl.Deleted === 1) ? 'D' : 'U'
            });

            if (dtl.Attributes !== undefined) {
                let cnt = 2;

                dtl.Attributes.find(att => att.ATTRIBUTE_ID === "000_QUANTITY").ATTRIBUTE_VALUES.map(quoteQty => {

                    if (!isNaN(Number(quoteQty.ATTRIBUTE_VALUE))) {
                        bezl.vars.ds.QuoteQty.push({
                            QuoteNum: quoteNum,
                            QuoteLine: dtl.QuoteLine,
                            QtyNum: cnt,
                            OurQuantity: Number(quoteQty.ATTRIBUTE_VALUE),
                            SellingQuantity: Number(quoteQty.ATTRIBUTE_VALUE),
                            PricePerCode: 'E',
                            Company: company,
                            RowMod: 'U'
                        });
                        cnt++;
                    }
                });

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
                "Connection": connection,
                "Company": company,
                "QuoteNum": quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);
    }

    function DeleteQuote(bezl, connection, company, quoteData) {
        bezl.vars.ds.QuoteHed = [];

        bezl.vars.ds.QuoteHed.push({
            QuoteNum: quoteData.quoteNum,
            CustNum: quoteData.custNum,
            CustID: quoteData.customerId,
            BTCustNum: quoteData.custNum,
            Name: quoteData.customerName,
            CustomerCustID: quoteData.customerId,
            MktgCampaignID: 'Customer',
            MktgEvntSeq: 1,
            Company: company,
            RowMod: 'D'
        });

        bezl.dataService.add('deleteQuote', 'brdb', 'Epicor10', 'Quote_DeleteQuote',
            {
                "Connection": connection,
                "Company": company,
                "QuoteNum": quoteData.quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);
    }

    return {
        newQuote: NewQuote,
        saveQuote: SaveQuote,
        deleteQuote: DeleteQuote,
        updateCustomer: UpdateCustomer
    }
});