define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
            console.log(bezl.data);
        }

        if (bezl.data.QuoteDtls) {
            bezl.vars.linesloading = false;

            bezl.data.QuoteDtls.map(dtl => {
                bezl.vars.quoteData.quoteLines.push({ lineNum: dtl.QuoteLine, partNum: dtl.PartNum, quoteQty: 1, quoteUom: '', deleted: 0 });
            });
        }
    }

    return {
        onDataChange: OnDataChange
    }
});