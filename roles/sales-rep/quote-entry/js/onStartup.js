define(["./quote.js"], function (quote) {
    function OnStartup(bezl) {
        quote.runQuery(bezl, 'Quotes');
    }

    return {
        onStartup: OnStartup
    }
});