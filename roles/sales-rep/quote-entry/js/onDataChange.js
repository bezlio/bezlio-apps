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

        if (bezl.data.Attributes && bezl.data.QuoteDtls && !bezl.vars.savingQuote) {
            console.log(bezl.data.Attributes);
            var openLine = bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === bezl.vars.quoteAttributeLine);

            if (openLine.Attributes === undefined) {
                openLine.Attributes = [];

                //add attributes that do not exist yet, or were not set
                var filterArray = JSON.parse(JSON.stringify(bezl.vars.parts.find(part => part.PART_DESCRIPTION === openLine.PartNum).ATTRIBUTES));
                filterArray.map(attr => {
                    var attrFnd = JSON.parse(JSON.stringify(bezl.vars.attributes.find(attribute => attribute.ATTRIBUTE_ID === attr.ATTRIBUTE_ID)));

                    attrFnd.Display = false;
                    attrFnd.QuoteNum = openLine.QuoteNum;
                    attrFnd.QuoteLine = openLine.QuoteLine;
                    attrFnd.ATTRIBUTE_VALUES.map(val => { val.Display = true });
                    openLine.Attributes.push(attrFnd);

                    var attrValList = bezl.data.Attributes.filter(attrVal => attrVal.Key4 === attrFnd.ATTRIBUTE_ID);
                    if (attrValList !== undefined) {
                        var attrVal = attrValList.find(attrValue => attrValue.Key4 === attrFnd.ATTRIBUTE_ID);
                        if (attrVal !== undefined) {
                            attrFnd.SELECTED_VALUE = attrVal.Character01;
                            if (attrVal.Character01 === 'OTHER') {
                                attrFnd.ATTRIBUTE_VALUES.find(othAtr => othAtr.ATTRIBUTE_VALUE === 'OTHER').SELECTED_VALUE = attrVal.Character04;
                            }
                            //quantity logic
                            if(attrFnd.ATTRIBUTE_ID === '000_QUANTITY'){
                                
                            }
                            //dependent attribute display setting
                            attrFnd.ATTRIBUTE_VALUES.map(attrFndVal => {
                                if (attrFndVal.hasOwnProperty('DEPENDENT_ATTRIBUTE')) {
                                    attrFndVal.DEPENDENT_ATTRIBUTE.map(depAttrVal => {
                                        var depAttrFndVal = bezl.data.Attributes.find(depAttrMapVal => depAttrMapVal.Key4 === depAttrVal.ATTRIBUTE_ID);
                                        if (depAttrFndVal.Character01 !== depAttrVal.ATTRIBUTE_VALUE)
                                            attrFndVal.Display = false;
                                    });
                                }
                            });
                            //sub attributes
                            var subAttrFnd = attrFnd.ATTRIBUTE_VALUES.find(attrFnd_subAttr => attrFnd_subAttr.ATTRIBUTE_VALUE === attrFnd.SELECTED_VALUE);
                            if (subAttrFnd !== undefined) {
                                if (subAttrFnd.hasOwnProperty('SUB_ATTRIBUTE')) {
                                    var subAttrVal = bezl.data.Attributes.find(subAttrFndVal => subAttrFndVal.Key5 === attrFnd.ATTRIBUTE_ID);
                                    console.log(subAttrFnd);
                                    console.log(subAttrVal);
                                    subAttrFnd.SUB_ATTRIBUTE[0].SELECTED_VALUE = subAttrVal.Character01;
                                }
                            }
                        }
                        if (attrFnd.hasOwnProperty('SELECTION_MODE')) {
                            attrFnd.ATTRIBUTE_VALUES.map(attrFndVal => {
                                var attrVal_Char01 = (attrValList.find(attrValListItm => attrValListItm.Key5 === attrFndVal.ATTRIBUTE_VALUE_LABEL) !== undefined) ? attrValList.find(attrValListItm => attrValListItm.Key5 === attrFndVal.ATTRIBUTE_VALUE_LABEL).Character01 : '';
                                attrFndVal.SELECTED_VALUE = (attrVal_Char01 !== 'False') ? attrVal_Char01 : '';
                            });

                        }
                    }
                });
            }

            bezl.vars.attrLoading = false;
            //bezl.dataService.remove('Attributes');
        }

        if (bezl.data.QuoteAttrs) {
            //bezl.dataService.remove('QuoteAttrs');
        }

        if (Object.keys(bezl.data).filter(obj => obj.includes('QuoteAttrs_')).length > 0) {
            Object.keys(bezl.data).filter(obj => obj.includes('QuoteAttrs_')).forEach(obj => {
                if (bezl.data[obj] === 1) {
                    bezl.dataService.remove(obj);
                }
            });
        } else {
            bezl.vars.saving = false;
            bezl.vars.savingQuote = false;
        }

        if (bezl.data.saveQuote) {
            bezl.dataService.remove('saveQuote');
            setTimeout(() => {
                bezl.vars.saving = false;
                bezl.vars.savingQuote = false;
            }, 5000);
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