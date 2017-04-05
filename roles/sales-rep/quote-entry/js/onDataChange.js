define(function () {
    function OnDataChange(bezl) {
        //console.log(bezl.data);

        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
        }

        if (bezl.data.QuoteDtls && bezl.vars.editingQuote) {
            bezl.vars.linesloading = false;

            bezl.data.QuoteDtls.map(dtl => {
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
                                console.log("test");
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
            }
        }

        if (bezl.data.Attributes) {
            console.log(bezl.vars.quoteAttributeLine);

            bezl.data.Attributes.map(attrs => {
                bezl.data.QuoteDtls.map(dtl => {
                    if (dtl.QuoteNum.toString() === attrs.Key1 && dtl.QuoteLine.toString() === attrs.Key2) {
                        dtl.Attributes.map(attr => {
                            if (attr.ATTRIBUTE_ID === attrs.Key4) {
                                attr.SELECTED_VALUE = attrs.Character01;
                            }
                        });
                    }
                });
            });
            bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === bezl.vars.quoteAttributeLine).Display = !bezl.data.QuoteDtls.find(dtl => dtl.QuoteLine === bezl.vars.quoteAttributeLine).Display;
        }
    }

    return {
        onDataChange: OnDataChange
    }
});