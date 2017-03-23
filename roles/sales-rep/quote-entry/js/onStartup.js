define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'Quotes');
        quote.runQuery(bezl, 'SalesReps');
        quote.runQuery(bezl, 'Parts');

        bezl.vars.ds = {};
        bezl.vars.ds.QuoteHed = [];
        bezl.vars.ds.QuoteDtl = [];

        // var parts = http.get('https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json', '', '')
        //     .map(result => result.json());

        // require(["https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json"],
        //     function (data) {
        //         //The data object will be the API response for the
        //         //JSONP data call.
        //         console.log(data);
        //     });

        $.ajaxSetup({ dataType: "jsonp" });

        console.log('test');
        $.getJSON("https://rawgit.com/bezlio/bezlio-apps/Sales-Rep---Request-For-Quote-Entry-%2332/roles/sales-rep/quote-entry/json/Part.json", function (data) {
            console.log(data);
            console.log('inner test');
        });
        console.log('test2');
    }

    return {
        onStartup: OnStartup
    }
});