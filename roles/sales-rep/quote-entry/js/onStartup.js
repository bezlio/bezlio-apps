define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'Quotes');
        quote.runQuery(bezl, 'SalesReps');
    }

    return {
        onStartup: OnStartup
    }
});