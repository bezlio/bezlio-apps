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
            ProjectName_c: bezl.vars.quoteData.quoteDesc,
            ForToPMDate_c: null,
            RowMod: 'U'
        });

        bezl.dataService.add('changeCustomer', 'brdb', 'Epicor10', 'Quote_ChangeCustomer',
            {
                "Connection": connection,
                "Company": company,
                "QuoteNum": quoteData.quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);

        bezl.data.Quotes.forEach(quote => {
            if (quote.QuoteNum === bezl.vars.quoteData.quoteNum) {
                console.log(quote);
            }
        });
    }

    // left in for older versions
    function UpdateSales(bezl, quoteNum, salesVal) {
        bezl.vars.saving = true;

        bezl.dataService.add('updateSales', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
            "QueryName": "UpdateSales",
            "Parameters": [
                { Key: "Company", Value: bezl.vars.Company },
                { Key: "QuoteNum", Value: quoteNum },
                { Key: "Sales_c", Value: salesVal }
            ]
        }, 0);
    }

    function TestQuote() {
        console.log('test successful!');
    }

    function UpdateCustomField(bezl, quoteNum, val, columnName) {
        bezl.vars.saving = true;
        var dataSubName = "";

        //Check for nulls
        if (!val) {
            val = "";
        }

        if (columnName == 'Sales_c') {
            dataSubName = "updateSales";
        } else if (columnName == 'ProjectName_c') {
            dataSubName = "updateDesc";
        } else {
            dataSubName = "updateCustomField";
        }

        bezl.dataService.add(dataSubName, 'brdb', 'SQLServer', 'ExecuteStoredProcedure', {
            "Context": "sales-rep", "Connection": "Epicor Production", "QueryName": "erp.updateCustomField",
            "Parameters": [
                { Key: "Company", Value: bezl.vars.Company },
                { Key: "QuoteNum", Value: quoteNum },
                { Key: "ColumnValue", Value: val },
                { Key: "ColumnName", Value: columnName }
            ]
        }, 0);
    }

    function SaveQuote(bezl, connection, company, mktgEvnt, quoteData) {
        bezl.vars.saving = true;

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
            MktgCampaignID: quoteData.mktgCamp,
            MktgEvntSeq: quoteData.mktgEvnt,
            ProjectName_c: quoteData.quoteDesc,
            Company: company,
            RowMod: 'U'
        });

        //UpdateCustomField(bezl, quoteData.quoteNum, quoteData.quoteDesc, 'ProjectName_c');

        quoteNum = quoteData.quoteNum;
        custNum = quoteData.custNum;

        bezl.data.QuoteDtls.forEach(dtl => {
            bezl.vars.ds.QuoteDtl.push({
                QuoteNum: quoteNum,
                QuoteLine: dtl.QuoteLine,
                PartNum: dtl.PartNum,
                LineDesc: (dtl.LineComment === '' || dtl.LineComment === undefined) ? dtl.PartNum : dtl.LineComment,
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
            }
        });

        bezl.dataService.add('saveQuote', 'brdb', 'Epicor10', 'Quote_SaveQuote',
            {
                "Connection": connection,
                "Company": company,
                "QuoteNum": quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);
    }

    function DeleteLine(bezl, quoteLine) {
        bezl.dataService.add('DeleteAttributes', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
            "QueryName": "DeleteAttributes",
            "Parameters": [
                { Key: "Company", Value: bezl.vars.Company },
                { Key: "QuoteNum", Value: bezl.vars.quoteData.quoteNum },
                { Key: "QuoteLine", Value: quoteLine }
            ]
        }, 0);

        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        bezl.vars.ds.QuoteHed.push({
            QuoteNum: bezl.vars.quoteData.quoteNum,
            CustNum: bezl.vars.quoteData.custNum,
            CustID: bezl.vars.quoteData.customerId,
            BTCustNum: bezl.vars.quoteData.custNum,
            Name: bezl.vars.quoteData.customerName,
            CustomerCustID: bezl.vars.quoteData.customerId,
            MktgCampaignID: bezl.vars.quoteData.mktgCamp,
            MktgEvntSeq: bezl.vars.quoteData.mktgEvnt,
            Company: bezl.vars.Company,
            RowMod: 'U'
        });
        var deletingQuote = bezl.data.QuoteDtls.find(quoteDtl => quoteDtl.QuoteLine == quoteLine);
        bezl.vars.ds.QuoteDtl.push({
            QuoteNum: bezl.vars.quoteData.quoteNum,
            QuoteLine: deletingQuote.QuoteLine,
            PartNum: deletingQuote.PartNum,
            Company: bezl.vars.Company,
            CustNum: bezl.vars.quoteData.custNum,
            RowMod: 'D'
        });

        var index = bezl.data.QuoteDtls.indexOf(bezl.data.QuoteDtls.find(subDtl => subDtl.QuoteLine === quoteLine));
        bezl.data.QuoteDtls.splice(index, 1);
        bezl.dataService.add('saveQuote', 'brdb', 'Epicor10', 'Quote_SaveQuote',
            {
                "Connection": bezl.vars.Connection,
                "Company": bezl.vars.Company,
                "QuoteNum": bezl.vars.quoteData.quoteNum,
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);
    }

    function SaveAttributes(connection, company, quoteNum, dtl) {
        var attributeConcat = dtl.PartNum + ": "; //line description for configured lines

        dtl.Attributes.map(attr => {
            var otherValue = (attr.ATTRIBUTE_VALUES.find(val => val.ATTRIBUTE_VALUE === 'OTHER') !== undefined) ? attr.ATTRIBUTE_VALUES.find(val => val.ATTRIBUTE_VALUE === 'OTHER').SELECTED_VALUE : '';

            //set measurement value
            if (attr.ATTRIBUTE_ID.indexOf('MEASURE') > -1) {
                measureAttr = attr.ATTRIBUTE_VALUES.find(measureValue => measureValue.ATTRIBUTE_VALUE === attr.SELECTED_VALUE);
                if (measureAttr != undefined) {
                    otherValue = measureAttr.SELECTED_VALUE;
                }
            }

            //standard one select property
            if (attr.hasOwnProperty("SELECTED_VALUE") && !attr.hasOwnProperty('SELECTION_MODE')) {
                bezl.dataService.add('QuoteAttrs', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                    "QueryName": "InsertAttributes",
                    "Parameters": [
                        { Key: "Company", Value: company },
                        { Key: "QuoteNum", Value: quoteNum },
                        { Key: "QuoteLine", Value: dtl.QuoteLine },
                        { Key: "PartID", Value: dtl.PartNum },
                        { Key: "AttributeID", Value: attr.ATTRIBUTE_ID },
                        { Key: "ParentID", Value: '' },
                        { Key: "AttributeValue", Value: (attr.SELECTED_VALUE === 'OTHER') ? 'OTHER' : attr.SELECTED_VALUE },
                        { Key: "OtherAttributeValue", Value: (otherValue !== undefined && (attr.SELECTED_VALUE === 'OTHER' || attr.ATTRIBUTE_ID.indexOf('MEASURE') > 0)) ? otherValue : '' },
                        { Key: "AttributeDesc", Value: attr.ATTRIBUTE_DESCRIPTION },
                        { Key: "PartNum", Value: dtl.PartNum }
                    ]
                }, 0);

                var labelValue = attr.ATTRIBUTE_VALUES.find(labelVal => labelVal.ATTRIBUTE_VALUE === attr.SELECTED_VALUE).ATTRIBUTE_VALUE_LABEL;
                switch (attr.ATTRIBUTE_ID) {
                    case "110_CATEGORY":
                        attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? labelValue + ' ' : otherValue + ' ';
                        break;
                    case "110_STYLE":
                        attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? labelValue + ' ' : otherValue + ' ';
                        break;
                    case "000_FURTHERDESC":
                        attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? labelValue + ' ' : otherValue + ' ';
                        break;
                    case "110_COLOR":
                        attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? labelValue + ' ' : otherValue + ' ';
                        break;
                    case "110_MATERIAL":
                        attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? labelValue + ' ' : otherValue + ' ';
                        break;
                    case "110_PACK_OUT":
                        attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? labelValue + ' ' : otherValue + ' ';
                        break;
                    case "110_MEASURE":
                        attributeConcat += otherValue + ' ';
                        break;
                    default:
                        break;
                }

                //console.log((attr.SELECTED_VALUE != 'OTHER') ? attr.ATTRIBUTE_ID + ' ' + attr.SELECTED_VALUE + ' ' : attr.ATTRIBUTE_ID + ' ' + otherValue + ' ');

                //attributeConcat += (attr.SELECTED_VALUE != 'OTHER') ? attr.SELECTED_VALUE + ' ' : otherValue + ' ';
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
                            { Key: "Company", Value: company },
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
                            { Key: "Company", Value: company },
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

                    switch (attr.ATTRIBUTE_ID) {
                        default:
                            break;
                    }

                    //attributeConcat += (val.hasOwnProperty('SELECTED_VALUE')) ? val.SELECTED_VALUE + ' ' : '';
                    //console.log((val.hasOwnProperty('SELECTED_VALUE')) ? attr.ATTRIBUTE_ID + ' ' + val.SELECTED_VALUE + ' ' : '');
                });
            }

            //sub attributes
            var selSubAttr = attr.ATTRIBUTE_VALUES.find(attrVal_subAttr => attrVal_subAttr.ATTRIBUTE_VALUE === attr.SELECTED_VALUE);
            if (selSubAttr !== undefined) {
                if (selSubAttr.hasOwnProperty('SUB_ATTRIBUTE')) {
                    var selSubAttrVal = selSubAttr.SUB_ATTRIBUTE[0];
                    bezl.dataService.add('QuoteSub_', 'brdb', 'sales-rep-queries', 'ExecuteNonQuery', {
                        "QueryName": "InsertAttributes",
                        "Parameters": [
                            { Key: "Company", Value: company },
                            { Key: "QuoteNum", Value: quoteNum },
                            { Key: "QuoteLine", Value: dtl.QuoteLine },
                            { Key: "PartID", Value: dtl.PartNum },
                            { Key: "AttributeID", Value: selSubAttrVal.ATTRIBUTE_ID },
                            { Key: "ParentID", Value: attr.ATTRIBUTE_ID },
                            { Key: "AttributeValue", Value: selSubAttrVal.SELECTED_VALUE },
                            { Key: "OtherAttributeValue", Value: '' },
                            { Key: "AttributeDesc", Value: selSubAttrVal.ATTRIBUTE_DESCRIPTION },
                            { Key: "PartNum", Value: dtl.PartNum }
                        ]
                    }, 0);

                    attributeConcat += selSubAttr.SELECTED_VALUE + ' ';
                }
            }
        });

        if (dtl.ListItem === 1) { //set concatenated attribute values as description
            //console.log('Attr: ' + attributeConcat);
            bezl.vars.ds.QuoteDtl.find(quoteDtl => quoteDtl.QuoteLine === dtl.QuoteLine).LineDesc = attributeConcat;
        }
    }

    function DeleteQuote(bezl, connection, company, quoteData) {
        //bezl.vars.ds = {};
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        bezl.vars.ds.QuoteQty = [];

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
        saveAttributes: SaveAttributes,
        deleteQuote: DeleteQuote,
        updateCustomer: UpdateCustomer,
        updateSales: UpdateSales,
        deleteLine: DeleteLine
    }
});