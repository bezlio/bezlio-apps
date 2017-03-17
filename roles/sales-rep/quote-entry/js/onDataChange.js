define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
            console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls) {
            bezl.vars.linesloading = false;

            bezl.vars.quoteData.quoteLines = bezl.data.QuoteDtls;

            var partList = [{ "PartNum": "Server1" }, { "PartNum": "Server2" }, { "PartNum": "Server3" }]

            bezl.vars.quoteData.quoteLines.map(dtl => {
                var typeAhead = function (lineNum) {
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead('destroy');
                    $(bezl.container.nativeElement).find(".js-typeahead-parts" + lineNum).typeahead({
                        order: "asc",
                        maxItem: 8,
                        display: ['PartNum'],
                        source: {
                            data: function () { return partList; }
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