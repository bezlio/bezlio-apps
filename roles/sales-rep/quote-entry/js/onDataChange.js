define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
        }

        if (bezl.data.Customers && bezl.vars.editingQuote) {
            var typeAhead = function () {
                $(bezl.container.nativeElement).find(".js-typeahead-customers").typeahead('destroy');
                $(bezl.container.nativeElement).find(".js-typeahead-customers").typeahead({
                    order: 'asc',
                    maxItem: 8,
                    display: ['Name'],
                    source: {
                        data: function () { return bezl.data.Customers; }
                    },
                    callback: {
                        onClick: function (node, a, item, event) {
                            bezl.vars.quoteData.custNum = item.CustNum;
                            bezl.vars.quoteData.customerId = item.CustID;
                            bezl.vars.quoteData.customerName = item.Name;

                            bezl.vars.ds.QuoteHed = [];

                            bezl.vars.ds.QuoteHed.push({
                                QuoteNum: bezl.vars.quoteData.quoteNum,
                                CustNum: bezl.vars.quoteData.custNum,
                                CustID: bezl.vars.quoteData.customerId,
                                BTCustNum: bezl.vars.quoteData.custNum,
                                Name: bezl.vars.quoteData.customerName,
                                CustomerCustID: bezl.vars.quoteData.customerId,
                                MktgCampaignID: 'Customer',
                                MktgEvntSeq: 1,
                                Company: 'KCC',
                                RowMod: 'U'
                            });

                            bezl.dataService.add('changeCustomer', 'brdb', 'Epicor10', 'Quote_ChangeCustomer',
                                {
                                    "Connection": "Epicor Production",
                                    "Company": "KCC",
                                    "QuoteNum": bezl.vars.quoteData.quoteNum,
                                    "ds": JSON.stringify(bezl.vars.ds)
                                }, 0);
                        }
                    }
                });
            }

            setTimeout(typeAhead, 2);
        }

        if (bezl.data.QuoteDtls && bezl.vars.editingQuote) {
            bezl.vars.linesloading = false;

            bezl.data.QuoteDtls.map(dtl => {
                if (bezl.vars.parts.find(part => part.PART_DESCRIPTION === dtl.PartNum) !== undefined) {
                    dtl.ListItem = 1;
                } else {
                    dtl.ListItem = 0;
                }

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
                                bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = item.PART_DESCRIPTION;
                                bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).ListItem = true;
                            },
                            onNavigateBefore: function (node, query, event) {
                                bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = query;
                                bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).ListItem = false;
                            }
                        }
                    });
                }

                setTimeout(typeAhead, 2, dtl.QuoteLine);
            });
        }

        if (bezl.data.newQuote && bezl.data.Quotes && !bezl.vars.editingQuote) {
            let newQuote = {
                QuoteNum: bezl.data.newQuote.QuoteHed[0].QuoteNum,
                Name: bezl.data.newQuote.QuoteHed[0].CustomerName,
                EntryDate: bezl.data.newQuote.QuoteHed[0].EntryDate,
                SalesRepCode: bezl.data.newQuote.QSalesRP[0].SalesRepCode,
                CustID: bezl.data.newQuote.QuoteHed[0].CustomerCustID,
                QuoteComment: bezl.data.newQuote.QuoteHed[0].QuoteComment,
                QuoteClosed: bezl.data.newQuote.QuoteHed[0].QuoteClosed,
                Company: bezl.data.newQuote.QuoteHed[0].Company,
                CustNum: bezl.data.newQuote.QuoteHed[0].CustNum
            }

            var quoteExists = bezl.data.Quotes.find(qte => qte.QuoteNum === newQuote.QuoteNum);

            if (quoteExists === undefined) {
                bezl.data.Quotes.push(newQuote);
                bezl.functions.loadExistingQuote(newQuote);
                bezl.vars.loading = false;
            }
        }

        if (bezl.data.Attributes) {
            bezl.vars.attrLoading = false;

            bezl.data.Attributes.map(attrs => {
                bezl.data.QuoteDtls.map(dtl => {
                    if (dtl.QuoteNum.toString() === attrs.Key1 && dtl.QuoteLine.toString() === attrs.Key2 && dtl.Attributes) {

                        dtl.Attributes.map(attr => {
                            if (attr.ATTRIBUTE_ID === attrs.Key4) {
                                attr.SELECTED_VALUE = attrs.Character01;
                            }
                            if (attr.ATTRIBUTE_ID === "000_QUANTITY" && bezl.data.QuoteQty) {
                                var cnt = 0;
                                bezl.data.QuoteQty.map(qty => {
                                    attr.ATTRIBUTE_VALUES[cnt].ATTRIBUTE_VALUE = qty.OurQuantity;
                                    cnt++;
                                });
                            }

                            //console.log(attr);
                        });
                    }
                });
            });
        }

        if (bezl.data.deleteQuote) {
            var quoteNum = bezl.vars.quoteData.quoteNum;

            require(['https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/js/quote.js'], function (functions) {
                functions.returnToSummary(bezl);
            });

            bezl.data.Quotes = bezl.data.Quotes.filter(hed => hed.QuoteNum !== quoteNum);

            console.log("Quote:" + quoteNum);
        }
    }

    return {
        onDataChange: OnDataChange
    }
});