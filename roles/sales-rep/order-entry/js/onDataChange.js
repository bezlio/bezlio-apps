define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Accounts) {
            // If there was a previously selected account in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedAccount = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
                bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
            }

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.Accounts.length; i++) {
                // Add a Selected property to the account record
                if (bezl.data.Accounts[i].ID == bezl.vars.selectedAccount.ID) {
                    bezl.data.Accounts[i].Selected = true;
                } else {
                    bezl.data.Accounts[i].Selected = false;
                }

                // This will get filled in on the AccountContacts query
                bezl.data.Accounts[i].Contacts = [];
                bezl.data.Accounts[i].ShipTos = [];

                // Same thing with the recent CRM calls
                bezl.data.Accounts[i].CRMCalls = [];
            };

            bezl.vars.loading = false;
        }

        // If we got the account contacts back, merge those in
        if (bezl.data.Accounts && bezl.data.AccountContacts) {
            bezl.data.AccountContacts.forEach(ac => {
                bezl.data.Accounts.find(a => a.ID == ac.ID).Contacts.push(ac);
            });
            bezl.vars.loadingContacts = false;
        }

        // If we got the account ship tos back, merge those in
        if (bezl.data.Accounts && bezl.data.AccountShipTos) {
            bezl.data.AccountShipTos.forEach(st => {
                var acct = bezl.data.Accounts.find(a => a.ID == st.ID);
                if (acct != undefined) {
                    acct.ShipTos.push(st);
                }              
            })
            bezl.vars.loadingShipTos = false;
        }

        if (bezl.data.GetPartsByCustNum) {
            bezl.vars.parts = bezl.data.GetPartsByCustNum;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});