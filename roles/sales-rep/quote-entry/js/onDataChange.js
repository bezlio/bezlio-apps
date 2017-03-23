define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
            //console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls) {
            console.log('data changed!');
            bezl.vars.linesloading = false;

            bezl.data.QuoteDtls.forEach(dtl => {
                console.log(dtl);
            });

            bezl.data.QuoteDtls = bezl.data.QuoteDtls.filter(dtl => dtl.Deleted === 0);

            bezl.data.QuoteDtls.forEach(dtl => {
                console.log(dtl);
            });

            var partList = [{ "PartNum": "Server1" }, { "PartNum": "Server2" }, { "PartNum": "Server3" }]

            bezl.vars.quoteData.quoteLines.map(dtl => {
                var typeAhead = function (lineNum) {
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
                        order: "asc",
                        maxItem: 8,
                        display: ['PartNum', 'PartDesc'],
                        source: {
                            data: function () { return bezl.data.Parts; }
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
    }

    return {
        onDataChange: OnDataChange
    }
});