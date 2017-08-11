define(function () {

    // This is all of the platform specific logic for this Bezl (Epicor 10 in this case)
    function AddNote(bezl) {
        var pendingNotes = [];
        if (typeof(Storage) !== "undefined" && localStorage.getItem("pendingNotes")) {
            pendingNotes = JSON.parse(localStorage.getItem("pendingNotes"));
        }

        pendingNotes.push({
            id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                }),
            company: bezl.vars.config.Company,
            custNum: bezl.vars.selectedAccount.CustNum,
            shortSummary: bezl.vars.shortSummary,
            details: bezl.vars.details,
            type: bezl.vars.type = '',
            salesRep: ((bezl.data.SalesRep.length > 0) ? bezl.data.SalesRep[0].SalesRepCode : bezl.vars.selectedAccount.SalesRep),
            result: ''
        });

        localStorage.setItem('pendingNotes', JSON.stringify(pendingNotes));
    }

    return {
        addNote: AddNote
    }
});
