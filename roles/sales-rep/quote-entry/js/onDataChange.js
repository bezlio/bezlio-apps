define(function () {
    function OnDataChange(bezl) {
        var partList = [{ value: "string1" }, { value: "string2" }, { value: "string3" }]

        $(bezl.container.nativeElement).find(".js-typeahead-parts").typeahead('destroy');
        $(bezl.container.nativeElement).find(".js-typeahead-parts").typeahead({
            order: "asc",
            maxItem: 8,
            display: ['PartNum'],
            source: {
                data: function () { return partList; }
            }
        });


        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
            console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls) {
            bezl.vars.linesloading = false;

            bezl.vars.quoteData.quoteLines = bezl.data.QuoteDtls;

            // bezl.data.QuoteDtls.map(dtl => {
            //     bezl.vars.quoteData.quoteLines.push({ lineNum: dtl.QuoteLine, partNum: dtl.PartNum, quoteQty: dtl.Qty, quoteUom: '', deleted: 0 });
            // });
        }
    }

    return {
        onDataChange: OnDataChange
    }
});