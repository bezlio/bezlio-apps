define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes && !bezl.vars.newQuote) {
            bezl.vars.loading = false;
        }

        if (bezl.data.Customers && bezl.vars.editingQuote) {
            //console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls && bezl.vars.editingQuote) {
            bezl.vars.linesloading = false;

            bezl.data.QuoteDtls.map(dtl => {
                if (bezl.vars.parts.find(part => part.PART_DESCRIPTION === dtl.PartNum) !== undefined) {
                    dtl.ListItem = 1;
                } else {
                    dtl.ListItem = 0;
                }
            });

            setTimeout(() => {
                bezl.vars.saving = false;
            }, 3000);
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

            bezl.dataService.remove('newQuote');
        }

        if (bezl.data.Attributes && bezl.data.QuoteDtls) {
            bezl.vars.attrLoading = false;

            bezl.data.Attributes.map(attrs => {
                bezl.data.QuoteDtls.map(dtl => {
                    if (dtl.QuoteNum.toString() === attrs.Key1 && dtl.QuoteLine.toString() === attrs.Key2 && dtl.Attributes) {
                        dtl.Attributes.map(attr => {
                            if (attr.ATTRIBUTE_ID === attrs.Key4) {
                                attr.SELECTED_VALUE = attrs.Character01;
                                if (attrs.Character01 === 'OTHER') {
                                    attr.ATTRIBUTE_VALUES.find(othAtr => othAtr.ATTRIBUTE_VALUE === 'OTHER').SELECTED_VALUE = attrs.Character04;
                                }
                            }
                            if (attr.ATTRIBUTE_ID === "000_QUANTITY" && bezl.data.QuoteQty) {
                                var cnt = 0;
                                bezl.data.QuoteQty.map(qty => {
                                    //attr.ATTRIBUTE_VALUES[cnt].ATTRIBUTE_VALUE = qty.OurQuantity;
                                    attr.ATTRIBUTE_VALUES[cnt].SELECTED_VALUE = qty.OurQuantity;
                                    cnt++;
                                });
                            }
                            if (attr.hasOwnProperty('SELECTION_MODE')) {
                                if (attr.SELECTED_VALUE === 'True') {
                                    if (attr.ATTRIBUTE_VALUES.find(attrVal => attrVal.ATTRIBUTE_VALUE_LABEL === attrs.Key5) !== undefined) {
                                        attr.ATTRIBUTE_VALUES.find(attrVal => attrVal.ATTRIBUTE_VALUE_LABEL === attrs.Key5).SELECTED_VALUE = attrs.Character01;
                                    }
                                }
                            }
                        });
                    }
                });
            });

            bezl.dataService.remove('Attributes');
        }

        if (Object.keys(bezl.data).filter(obj => obj.includes('QuoteAttrs_')).length > 0) {
            console.log(bezl.data);
            var undefinObjs = Object.keys(bezl.data).filter(obj => obj.includes('QuoteAttrs_') && obj === undefined);
            console.log("Undef: " + undefinObjs.length);

            var definedObjs = Object.keys(bezl.data).filter(obj => obj.includes('QuoteAttrs_') && obj !== undefined);
            console.log("Def: " + definedObjs.length);

        }

        if (bezl.data.saveQuote) {
            bezl.dataService.remove('saveQuote');
        }

        if (bezl.data.changeCustomer) {
            setTimeout(() => {
                bezl.vars.saving = false;
            }, 3000);

            bezl.dataService.remove('changeCustomer');
        }

        if (bezl.data.deleteQuote) {
            var quoteNum = bezl.vars.quoteData.quoteNum;

            require(['https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/js/quote.js'], function (functions) {
                functions.returnToSummary(bezl);
            });

            bezl.vars.deleting = false;
            bezl.dataService.remove('deleteQuote');

            bezl.data.Quotes = bezl.data.Quotes.filter(hed => hed.QuoteNum !== quoteNum);
        }
    }

    return {
        onDataChange: OnDataChange
    }
});