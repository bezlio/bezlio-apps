define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.FirstCustomer) {
            bezl.vars.CustomerCustID = bezl.data.FirstCustomer[0].CustID;
            bezl.vars.SalesRepCode = bezl.data.FirstCustomer[0].SalesRepCode;
        }

        if (bezl.data.Quotes && !bezl.vars.newQuote && bezl.data.FirstCustomer) {
            bezl.vars.loading = false;
        }

        if (bezl.data.QuoteDtls && bezl.vars.editingQuote) {
            bezl.vars.linesloading = false;

            bezl.data.QuoteDtls.map(dtl => {
                if (bezl.vars.parts.find(part => part.PART_DESCRIPTION === dtl.PartNum) !== undefined) {
                    dtl.ListItem = 1;
                } else {
                    dtl.ListItem = 0;
                    setTimeout(() => {
                        typeAheadPart(dtl.QuoteLine);
                    }, 1500);
                }
            });
        }

        var typeAheadPart = function (lineNum) {
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

        if (bezl.data.NewCustomer) {
            bezl.vars.newCustomerLoading = false;
            bezl.dataService.remove('NewCustomer');

            bezl.notificationService.showSuccess('Customer created successfully!');
        }

        if (bezl.data.newQuote && bezl.data.Quotes && !bezl.vars.editingQuote) {
            let newQuote = {
                QuoteNum: bezl.data.newQuote.QuoteHed[0].QuoteNum,
                Name: bezl.data.newQuote.QuoteHed[0].CustomerName,
                EntryDate: bezl.data.newQuote.QuoteHed[0].EntryDate,
                SalesRepCode: bezl.data.FirstCustomer[0].SalesRepCode,
                CustID: bezl.data.newQuote.QuoteHed[0].CustomerCustID,
                QuoteComment: bezl.data.newQuote.QuoteHed[0].QuoteComment,
                QuoteClosed: bezl.data.newQuote.QuoteHed[0].QuoteClosed,
                Company: bezl.data.newQuote.QuoteHed[0].Company,
                CustNum: bezl.data.newQuote.QuoteHed[0].CustNum,
                MktgCampaignID: bezl.data.newQuote.QuoteHed[0].MktgCampaignID,
                MktgEvntSeq: bezl.data.newQuote.QuoteHed[0].MktgEvntSeq,
                QuoteDesc: bezl.data.newQuote.QuoteHed[0].ProjectName_c
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
                            //child attribute value setting
                            attrFnd.SELECTED_VALUE = attrVal.Character01;
                            if (attrVal.Character01 === 'OTHER') {
                                attrFnd.ATTRIBUTE_VALUES.find(othAtr => othAtr.ATTRIBUTE_VALUE === 'OTHER').SELECTED_VALUE = attrVal.Character04;
                            } else if (attrVal.Key4.indexOf('MEASURE') > 0) {
                                attrFnd.ATTRIBUTE_VALUES.find(othAtr => othAtr.ATTRIBUTE_VALUE === attrVal.Character01).SELECTED_VALUE = attrVal.Character04;
                            } else if (attrVal.Character04 !== "") {
                                attrFnd.ATTRIBUTE_VALUES.find(othAtr => othAtr.ATTRIBUTE_VALUE === attrVal.Character01).SELECTED_VALUE = attrVal.Character04;
                            }
                            //dependent attribute display setting
                            attrFnd.ATTRIBUTE_VALUES.map(attrFndVal => {
                                if (attrFndVal.hasOwnProperty('DEPENDENT_ATTRIBUTE')) {
                                    attrFndVal.Display = false; // set to false as default for dependendent attributes
                                    attrFndVal.DEPENDENT_ATTRIBUTE.map(depAttrVal => {
                                        var joinedAttribute = bezl.data.Attributes.find(joinKey => joinKey.Key4 === depAttrVal.ATTRIBUTE_ID);
                                        if (joinedAttribute !== undefined) {
                                            if (joinedAttribute.Character01 === depAttrVal.ATTRIBUTE_VALUE)
                                                attrFndVal.Display = true;
                                        }
                                    });
                                }
                            });
                            //sub attributes
                            var subAttrValList = bezl.data.Attributes.filter(subAttrVal => subAttrVal.Key5 === attrFnd.ATTRIBUTE_ID);
                            if (subAttrValList.length > 0) {
                                subAttrValList.forEach(subAttrVal => {
                                    attrFnd.ATTRIBUTE_VALUES.find(attrFndVal => attrFndVal.ATTRIBUTE_VALUE_LABEL.toUpperCase() === subAttrVal.Character03.toUpperCase())
                                        .SUB_ATTRIBUTE.find(subAttrID => subAttrID.ATTRIBUTE_ID === subAttrVal.Key4.substring(0, subAttrVal.Key4.indexOf('-')))
                                        .SELECTED_VALUE = subAttrVal.Character01;

                                    var subAttrSelVal = attrFnd.ATTRIBUTE_VALUES.find(attrFndVal => attrFndVal.ATTRIBUTE_VALUE_LABEL.toUpperCase() === subAttrVal.Character03.toUpperCase())
                                        .SUB_ATTRIBUTE.find(subAttrID => subAttrID.ATTRIBUTE_ID === subAttrVal.Key4.substring(0, subAttrVal.Key4.indexOf('-')))
                                        .ATTRIBUTE_VALUES.find(attrFndVal_subAttr => attrFndVal_subAttr.ATTRIBUTE_VALUE_LABEL.toUpperCase() === subAttrVal.Character01.toUpperCase());
                                    if (subAttrSelVal !== undefined) {
                                        subAttrSelVal.SELECTED_VALUE = subAttrVal.Character04;
                                    }
                                });
                            }

                            var subAttrFnd = attrFnd.ATTRIBUTE_VALUES.find(attrFnd_subAttr => attrFnd_subAttr.ATTRIBUTE_VALUE === attrFnd.SELECTED_VALUE);
                            if (subAttrFnd !== undefined) {
                                if (subAttrFnd.hasOwnProperty('SUB_ATTRIBUTE')) {
                                    var subAttrVal = bezl.data.Attributes.find(subAttrFndVal => subAttrFndVal.Key5 === attrFnd.ATTRIBUTE_ID);
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
            bezl.dataService.remove('Attributes');
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
            }, 500);
        }

        if (bezl.data.changeCustomer) {
            setTimeout(() => {
                bezl.vars.saving = false;
            }, 3000);

            bezl.dataService.remove('changeCustomer');
        }

        if (bezl.data.deleteQuote) {
            bezl.vars.deleting = false;
            bezl.vars.quoteData = {
                quoteDate: new Date(),
                salespersonId: bezl.env.currentUser,
                customerId: '',
                comments: '',
                status: 'Open',
                result: '',
                quoteLines: []
            };

            require(['https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/js/quote.js'], function (functions) {
                functions.returnToSummary(bezl);
                functions.runQuery(bezl, 'Quotes');
            });
            bezl.dataService.remove('deleteQuote');
        }

        if (bezl.data.EpicorParts) {
            bezl.vars.epicorParts = bezl.data.EpicorParts;
            bezl.dataService.remove('EpicorParts');

            //console.log(JSON.parse(JSON.stringify(bezl.vars.epicorParts)));

            // var typeAhead = function (lineNum) {
            //     $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
            //     $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
            //         order: "asc",
            //         maxItem: 8,
            //         display: ['PART_DESCRIPTION'],
            //         source: {
            //             data: function () { return bezl.vars.parts; }
            //         },
            //         callback: {
            //             onClick: function (node, a, item, event) {
            //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = item.PART_DESCRIPTION;
            //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).ListItem = true;
            //             },
            //             onNavigateBefore: function (node, query, event) {
            //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).PartNum = query;
            //                 bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === (lineNum)).ListItem = false;
            //             }
            //         }
            //     });
            // }
        }

        if (bezl.data.updateSales) {
            bezl.dataService.remove('updateSales');
        }

        if (bezl.data.updateQuoteDesc) {
            bezl.dataService.remove('updateQuoteDesc');
        }
    }

    return {
        onDataChange: OnDataChange
    }
});