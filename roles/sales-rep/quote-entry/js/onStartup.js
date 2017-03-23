define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'Quotes');
        quote.runQuery(bezl, 'SalesReps');
        quote.runQuery(bezl, 'Parts');

        bezl.vars.ds = {};
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];

        var parts = http.get('https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json', '', '')
            .map(result => result.json());
    }

    return {
        onStartup: OnStartup
    }
});