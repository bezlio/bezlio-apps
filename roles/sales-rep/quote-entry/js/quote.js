define(['../../../../libraries/epicor/quote.js'], function (quote_lib) {

    function RunQuery(bezl, queryName) {
        switch (queryName) {
            case "FirstCustomer":
                bezl.dataService.add('FirstCustomer', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetFirstCustomerByRep",
                    "Parameters": [
                        { "Key": "SalesRep", "Value": bezl.env.currentUser },
                        { "Key": "Company", "Value": bezl.vars.Company }
                    ]
                }, 0);
                break;
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
                }, 0);
                break;
            case "Territories":
                bezl.dataService.add('Territories', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetSalesTer",
                    "Parameters": [
                        { Key: "Company", Value: bezl.vars.Company }
                    ]
                }, 0);
                break;
            case "Terms":
                bezl.dataService.add('Terms', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetTerms",
                    "Parameters": [
                        { Key: "Company", Value: bezl.vars.Company }
                    ]
                }, 0);
                break;
            case "EpicorParts":
                bezl.dataService.add('EpicorParts', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetEpicorParts"
                }, 0);
                break;
            case "MktgCamp":
                bezl.dataService.add('MktgCamp', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetMktgCamp",
                    "Parameters": [
                        { Key: "Company", Value: bezl.vars.Company }
                    ]
                }, 0);

                break;
            case "MktgEvnt":
                bezl.dataService.add('MktgEvnt', 'brdb', 'sales-rep-queries', 'ExecuteQuery', {
                    "QueryName": "GetMktgEvnt",
                    "Parameters": [
                        { Key: "Company", Value: bezl.vars.Company },
                        { Key: "CampID", Value: bezl.vars.quoteData.mktgCamp }
                    ]
                }, 0);
                break;
        }
    }

    function LoadQuote(bezl, quote) {
        bezl.vars.editingQuote = true;
        bezl.vars.linesloading = true;

        // Push the current quote header info into the quoteData object
        bezl.vars.quoteData = {
            newQuote: false,
            quoteNum: quote.QuoteNum,
            quoteDate: new Date(quote.EntryDate),
            salespersonId: quote.SalesRepCode,
            customerId: quote.CustID,
            custNum: quote.CustNum,
            customerName: quote.Name,
            comments: quote.QuoteComment,
            status: quote.QuoteClosed,
            result: quote.Result,
            sales: quote.Sales,
            mktgCamp: quote.MktgCampaignID,
            mktgEvnt: quote.MktgEvntSeq,
            quoteDesc: quote.ProjectName_c,
            quoteLines: []
        };

        if (bezl.vars.quoteData.mktgCamp !== undefined) {
            this.runQuery(bezl, 'MktgEvnt');
        }
    }

    function ReturnToSummary(bezl) {
        if (bezl.vars.quoteData.quoteNum) {
            quote_lib.saveQuote(bezl, bezl.vars.Connection, bezl.vars.Company, bezl.vars.MktgEvent, bezl.vars.quoteData);
        }

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
    }

    function ChangeMktgCamp(bezl, campID) {
        bezl.vars.quoteData.mktgCamp = campID;
        this.runQuery(bezl, 'MktgEvnt');
    }

    function IncludeSuspects(bezl, parm) {
        if (parm.srcElement.checked === true) {
            bezl.data.Suspects.map(sus => {
                bezl.data.Customers.push({
                    CustID: sus.CustID,
                    CustNum: sus.CustNum,
                    CustomerType: 'SUS',
                    Name: sus.Name,
                    SalesRepCode: 'NONE'
                });
            });

            bezl.data.Customers.sort(function (a, b) {
                var nameA = a.Name.toLowerCase(), nameB = b.Name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        } else {
            bezl.data.Customers = bezl.data.Customers.filter(cust => cust.CustomerType !== 'SUS');
        }
    }

    function NewCustomerForm(bezl) {
        bezl.vars.newCustomerID = '';
        bezl.vars.newCustomerName = '';
        bezl.vars.newCustomerAddress = '';
        bezl.vars.newCustomerCity = '';
        bezl.vars.newCustomerState = '';
        bezl.vars.newCustomerZip = '';
        bezl.vars.newCustomerCountry = '';
        bezl.vars.newCustomerTer = '';
        bezl.vars.newCustomerTerms = '';

        bezl.vars.dialogVisible = !bezl.vars.dialogVisible;
    }

    function NewCustomer(bezl) {
        bezl.vars.newCustomerLoading = true;

        bezl.vars.ds = {};
        bezl.vars.ds.Customer = [];

        bezl.vars.ds.Customer.push({
            Company: bezl.vars.company,
            Name: bezl.vars.newCustomerName,
            Address1: bezl.vars.newCustomerAddress,
            City: bezl.vars.newCustomerCity,
            State: bezl.vars.newCustomerState,
            ZIP: bezl.vars.newCustomerZip,
            Country: bezl.vars.newCustomerCountry,
            SalesRepCode: bezl.vars.SalesRepCode,
            TerritoryID: bezl.vars.newCustomerTer,
            TermsCode: 'TBD',
            CustomerType: 'PRO',
            RowMod: 'A'
        });

        bezl.dataService.add(
            'NewCustomer',
            'brdb',
            'Epicor10',
            'ExecuteBOMethod',
            {
                'Connection': bezl.vars.Connection,
                'Company': bezl.vars.Company,
                'BOName': 'Customer',
                'BOMethodName': 'UpdateExt',
                'Parameters': [
                    { 'Key': 'ds', 'Value': JSON.stringify(bezl.vars.ds) }
                ]
            }
            , 0);

        bezl.vars.dialogVisible = false;
    }

    function AddLine(bezl) {
        if (bezl.data.QuoteDtls === undefined) {
            bezl.data.QuoteDtls = [];
        }

        var lineNum = Math.max.apply(Math, bezl.data.QuoteDtls.map(function (dtl) { return dtl.QuoteLine; }));

        lineNum = (lineNum === -Infinity) ? 0 : lineNum;

        bezl.data.QuoteDtls.push({ QuoteNum: bezl.vars.quoteData.quoteNum, QuoteLine: lineNum + 1, PartNum: 'Glass', OrderQty: 1, SellingExpectedUM: 'EA', ListItem: true, Deleted: 0, Attributes: undefined });

        quote_lib.saveQuote(bezl, bezl.vars.Connection, bezl.vars.Company, bezl.vars.MktgEvent, bezl.vars.quoteData);
    }

    function ChangeStdPart(bezl, lineNum) {
        bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).ListItem = !bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).ListItem;

        if (bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === lineNum).ListItem == false) {
            setTimeout(() => {
                typeAheadPart(bezl, lineNum);
            }, 1500);
        }
    }

    var typeAheadPart = function (bezl, lineNum) {
        $(bezl.container.nativeElement).find(".partNum" + lineNum).typeahead('destroy');
        $(bezl.container.nativeElement).find(".partNum" + lineNum).typeahead({
            order: "asc",
            maxItem: 8,
            display: ['PartNum'],
            source: {
                data: function () { return JSON.parse(JSON.stringify(bezl.vars.epicorParts)); }
            },
            callback: {
                onClick: function (node, a, item, event) {
                    bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = item.PartNum;
                }
            }
        });
    }

    function DeleteLine(bezl, lineNum) {
        quote_lib.deleteLine(bezl, lineNum);
    }

    function ConfigureLine(bezl, partNum, quoteLine) {
        var line = bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === quoteLine);
        line.Display = !line.Display;
        if (line.Display === true) {
            bezl.vars.updatingAttributes = false;

            if (line.ListItem) {
                bezl.vars.attrLoading = true;

                var curLine = bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === quoteLine);
                bezl.vars.quoteAttributeLine = quoteLine;
                bezl.vars.quotePart = curLine.PartNum;

                this.runQuery(bezl, "QuoteQty");
                this.runQuery(bezl, "Attributes");
            }
        } else {
            quote_lib.saveAttributes(bezl, bezl.vars.Connection, bezl.vars.Company, line.QuoteNum, line);
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

    function ChangeTypedAttribute(bezl, lineNum, attributeID, selectedAttribute, attributeValue) {
        // console.log("LineNum: " + lineNum);
        // console.log("AttrID: " + attributeID);
        // console.log("SelectedAttribute: " + selectedAttribute);
        // console.log("Attr Value: " + attributeValue);
        var x = bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine == lineNum)
            .Attributes.find(attr => attr.ATTRIBUTE_ID === attributeID)
            .ATTRIBUTE_VALUES.find(attrVal => attrVal.ATTRIBUTE_VALUE_LABEL === selectedAttribute);

        console.log(x);
    }

    return {
        runQuery: RunQuery,
        loadQuote: LoadQuote,
        returnToSummary: ReturnToSummary,
        changeMktgCamp: ChangeMktgCamp,
        newCustomerForm: NewCustomerForm,
        newCustomer: NewCustomer,
        includeSuspects: IncludeSuspects,
        addLine: AddLine,
        changeStdPart: ChangeStdPart,
        deleteLine: DeleteLine,
        configureLine: ConfigureLine,
        changePart: ChangePart,
        changeAttribute: ChangeAttribute,
        changeTypedAttribute: ChangeTypedAttribute
    }
});