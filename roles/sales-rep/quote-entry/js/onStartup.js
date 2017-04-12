define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'Quotes');
        quote.runQuery(bezl, 'SalesReps');
        quote.runQuery(bezl, 'Parts');
        quote.runQuery(bezl, 'Customers');

        bezl.vars.ds = {};
        bezl.vars.attrs = [];
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];
        bezl.vars.ds.QuoteQty = [];

        // var parts = http.get('https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json', '', '')
        //     .map(result => result.json());

        // require(["https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json"],
        //     function (data) {
        //         //The data object will be the API response for the
        //         //JSONP data call.
        //         console.log(data);
        //     });

        $.getJSON("https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json", function (data) {
            bezl.vars.parts = data;
            console.log(data);
        });

        $.getJSON("https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Attribute.json", function (data) {
            bezl.vars.attributes = data;
            console.log(data);
        });
    }

    return {
        onStartup: OnStartup
    }
});