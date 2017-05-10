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

    function UpdateCustomer(bezl, connection, company, quoteData, mktgEvnt, custID) {
        bezl.vars.saving = true;

        var curCust = bezl.data.Customers.find(cust => cust.CustID === custID);

        quoteData.customerId = curCust.CustID;
        quoteData.custNum = curCust.CustNum;
        quoteData.customerName = curCust.Name;

        bezl.vars.ds.QuoteHed = [];

        bezl.vars.ds.QuoteHed.push({
            QuoteNum: bezl.vars.quoteData.quoteNum,
            CustNum: bezl.vars.quoteData.custNum,
            CustID: bezl.vars.quoteData.customerId,
            BTCustNum: bezl.vars.quoteData.custNum,
            Name: bezl.vars.quoteData.customerName,
            CustomerCustID: bezl.vars.quoteData.customerId,
            MktgCampaignID: mktgEvnt,
            MktgEvntSeq: 1,
            Company: bezl.vars.Company,
            RowMod: 'U'
        });

        bezl.dataService.add('changeCustomer', 'brdb', 'Epicor10', 'Quote_ChangeCustomer',
            {
                "Connection": connection,
                "Company": company,
                "QuoteNum": quoteData.quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);
    }

    function SaveQuote(bezl, connection, company, mktgEvnt, quoteData) {
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        bezl.vars.ds.QuoteQty = [];
        bezl.vars.savingQuote = true;
        var quoteNum;
        var custNum;

        bezl.vars.ds.QuoteHed.push({
            QuoteNum: quoteData.quoteNum,
            CustNum: quoteData.custNum,
            CustID: quoteData.customerId,
            BTCustNum: quoteData.custNum,
            Name: quoteData.customerName,
            CustomerCustID: quoteData.customerId,
            MktgCampaignID: mktgEvnt,
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
                LineDesc: (dtl.LineComment === '') ? dtl.PartNum : dtl.LineComment,
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
                            OurQuantity: Number(quoteQty.SELECTED_VALUE),
                            SellingQuantity: Number(quoteQty.SELECTED_VALUE),
                            PricePerCode: 'E',
                            Company: company,
                            RowMod: 'U'
                        });
                        cnt++;
                    }
                });

                dtl.Attributes.map(attr => {
                    var otherValue = (attr.ATTRIBUTE_VALUES.find(val => val.ATTRIBUTE_VALUE === 'OTHER') !== undefined) ? attr.ATTRIBUTE_VALUES.find(val => val.ATTRIBUTE_VALUE === 'OTHER').SELECTED_VALUE : '';
                    //standard one select property
                    if (attr.hasOwnProperty("SELECTED_VALUE") && !attr.hasOwnProperty('SELECTION_MODE')) {
                        bezl.dataService.add('QuoteAttrs', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                            "QueryName": "InsertAttributes",
                            "Parameters": [
                                { Key: "QuoteNum", Value: quoteNum },
                                { Key: "QuoteLine", Value: dtl.QuoteLine },
                                { Key: "PartID", Value: dtl.PartNum },
                                { Key: "AttributeID", Value: attr.ATTRIBUTE_ID },
                                { Key: "ParentID", Value: '' },
                                { Key: "AttributeValue", Value: (attr.SELECTED_VALUE === 'OTHER') ? 'OTHER' : attr.SELECTED_VALUE },
                                { Key: "OtherAttributeValue", Value: (otherValue !== undefined && attr.SELECTED_VALUE === 'OTHER') ? otherValue : '' },
                                { Key: "AttributeDesc", Value: attr.ATTRIBUTE_DESCRIPTION },
                                { Key: "PartNum", Value: dtl.PartNum }
                            ]
                        }, 0)
                    }

                    // fix these by declaring an object that is equal to the filter, vs. filtering then if-fing
                    //multi select properties
                    if (attr.hasOwnProperty('SELECTION_MODE')) { //|| val.SELECTED_VALUE.length > 0
                        //true or false attr values
                        var attrValsE = JSON.parse(JSON.stringify(attr.ATTRIBUTE_VALUES.filter(val => val.hasOwnProperty('EDITABLE') === false)));
                        attrValsE.map(val => {
                            let name = val.ATTRIBUTE_VALUE_LABEL.substring(0, 5).replace(" ", "");
                            bezl.dataService.add('QuoteAttrs_' + name, 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                                "QueryName": "InsertAttributes",
                                "Parameters": [
                                    { Key: "QuoteNum", Value: quoteNum },
                                    { Key: "QuoteLine", Value: dtl.QuoteLine },
                                    { Key: "PartID", Value: dtl.PartNum },
                                    { Key: "AttributeID", Value: attr.ATTRIBUTE_ID },
                                    { Key: "ParentID", Value: val.ATTRIBUTE_VALUE_LABEL },
                                    { Key: "AttributeValue", Value: val.hasOwnProperty('SELECTED_VALUE') ? val.SELECTED_VALUE : false },
                                    { Key: "OtherAttributeValue", Value: '' },
                                    { Key: "AttributeDesc", Value: attr.ATTRIBUTE_DESCRIPTION },
                                    { Key: "PartNum", Value: dtl.PartNum }
                                ]
                            }, 0);
                        });

                        var attrValsNE = JSON.parse(JSON.stringify(attr.ATTRIBUTE_VALUES.filter(val => val.hasOwnProperty('EDITABLE') === true)));
                        attrValsNE.map(val => {
                            bezl.dataService.add('QuoteMulti_', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                                "QueryName": "InsertAttributes",
                                "Parameters": [
                                    { Key: "QuoteNum", Value: quoteNum },
                                    { Key: "QuoteLine", Value: dtl.QuoteLine },
                                    { Key: "PartID", Value: dtl.PartNum },
                                    { Key: "AttributeID", Value: attr.ATTRIBUTE_ID },
                                    { Key: "ParentID", Value: val.ATTRIBUTE_VALUE_LABEL },
                                    { Key: "AttributeValue", Value: val.hasOwnProperty('SELECTED_VALUE') ? val.SELECTED_VALUE : '' },
                                    { Key: "OtherAttributeValue", Value: '' },
                                    { Key: "AttributeDesc", Value: attr.ATTRIBUTE_DESCRIPTION },
                                    { Key: "PartNum", Value: dtl.PartNum }
                                ]
                            }, 0);
                        });
                    }

                    //sub attributes
                    var selSubAttr = attr.ATTRIBUTE_VALUES.find(attrVal_subAttr => attrVal_subAttr.ATTRIBUTE_VALUE === attr.SELECTED_VALUE);
                    if (selSubAttr != undefined) {
                        if (selSubAttr.hasOwnProperty('SUB_ATTRIBUTE')) {
                            bezl.dataService.add('QuoteAttrs_Sub', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                                "QueryName": "InsertAttributes",
                                "Parameters": [
                                    { Key: "QuoteNum", Value: quoteNum },
                                    { Key: "QuoteLine", Value: dtl.QuoteLine },
                                    { Key: "PartID", Value: dtl.PartNum },
                                    { Key: "AttributeID", Value: selSubAttr.ATTRIBUTE_ID },
                                    { Key: "ParentID", Value: attr.ATTRIBUTE_ID },
                                    { Key: "AttributeValue", Value: selSubAttr.ATTRIBUTE_VALUE },
                                    { Key: "OtherAttributeValue", Value: '' },
                                    { Key: "AttributeDesc", Value: selSubAttr.ATTRIBUTE_DESCRIPTION },
                                    { Key: "PartNum", Value: dtl.PartNum }
                                ]
                            }, 0);
                        }
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