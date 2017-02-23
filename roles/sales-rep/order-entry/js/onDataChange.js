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

                // Same thing with the recent CRM calls
                bezl.data.Accounts[i].CRMCalls = [];
            };

            bezl.vars.loading = false;
        }

        // If we got the account contacts back, merge those in
        if (bezl.data.Accounts && bezl.data.AccountContacts) {
            for (var i = 0; i < bezl.data.AccountContacts.length; i++) {
                for (var x = 0; x < bezl.data.Accounts.length; x++) {
                    if (bezl.data.AccountContacts[i].ID == bezl.data.Accounts[x].ID) {
                        bezl.data.Accounts[x].Contacts.push(bezl.data.AccountContacts[i]);
                    }
                }
            }

            bezl.vars.loadingContacts = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});