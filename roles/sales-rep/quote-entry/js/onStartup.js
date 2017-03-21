define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'Quotes');
        quote.runQuery(bezl, 'SalesReps');
        quote.runQuery(bezl, 'Parts');

        bezl.vars.ds = {};
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
    }

    return {
        onStartup: OnStartup
    }
});