define(function () {
    function OnDataChange(bezl) {
        if (bezl.data.Quotes) {
            bezl.vars.loading = false;
            console.log(bezl.data);
        }
    }

    return {
        onDataChange: OnDataChange
    }
});