define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'FirstCustomer');
        quote.runQuery(bezl, 'Quotes');
        quote.runQuery(bezl, 'SalesReps');
        quote.runQuery(bezl, 'Parts');
        quote.runQuery(bezl, 'Customers');
        quote.runQuery(bezl, 'Suspects');
        quote.runQuery(bezl, 'Territories');
        quote.runQuery(bezl, 'Terms');
        quote.runQuery(bezl, 'EpicorParts');
        quote.runQuery(bezl, 'MktgCamp');

        bezl.vars.ds = {};
        bezl.vars.attrs = [];
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        bezl.vars.ds.QuoteQty = [];

        $.getJSON("https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json", function (data) {
            bezl.vars.parts = data;
           // console.log(data);
        });

        $.getJSON("https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Attribute.json", function (data) {
            bezl.vars.attributes = data;
           // console.log(data);
        });
    }

    return {
        onStartup: OnStartup
    }
});