define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.Customers) {
            // Perform additional processing on the returned data
            bezl.vars.Customers = bezl.data.Customers;
            bezl.vars.Customers.forEach(c => {
                c.Selected = false;
                c.Contacts = [];
                c.ShipTos = [];
            });
            bezl.dataService.remove('Customers');
            bezl.vars.loading = false;
        }

        // If we got the account contacts back, merge those in
        if (bezl.vars.Customers && bezl.data.CustomersContacts) {
            bezl.data.CustomersContacts.forEach(ac => {
                bezl.vars.Customers.find(a => a.ID == ac.ID).Contacts.push(ac);
            });
            bezl.dataService.remove('CustomersContacts');
            bezl.vars.loadingContacts = false;
        }

        // If we got the account ship tos back, merge those in
        if (bezl.vars.Customers && bezl.data.CustomersShipTos) {
           bezl.data.CustomersShipTos.forEach(st => {
               var acct = bezl.vars.Customers.find(a => a.ID == st.ID);
               if (acct != undefined) {
                   acct.ShipTos.push(st);
               }              
           })
           bezl.dataService.remove('CustomersShipTos');
           bezl.vars.loadingShipTos = false;
        }

        if (bezl.data.GetGlobalParts) {
            // Load our local part cache
            bezl.vars.parts = bezl.data.GetGlobalParts;
            // Remove the data service
            bezl.dataService.remove('GetGlobalParts');
            // Mark that we are done loading
            bezl.vars.loadingGlobalParts = false;
        }

        if (bezl.data.GetPartDiscounts) {
            // We need to replace parts with customer parts if they are present because price list trumps web parts
            bezl.vars.partDiscounts = bezl.data.GetPartDiscounts;
            
            $(bezl.container.nativeElement).find(".partList").typeahead('destroy');
            $(bezl.container.nativeElement).find(".partList").typeahead({
                order: "asc",
                maxItem: 8,
                hint: true,
                display: ['PartNum', 'PartDescription'],
                source: {
                    data: function() { return bezl.vars.parts.sort(function(a, b) {
                                    return a.PartNum - b.PartNum;
                                });; }
                },
                callback: {
                    onSearch: function(node, query) {
                        // First remove any selected parts
                        bezl.vars.selectedPart = null;
                        
                        // Select a part if its matching
                        if (bezl.vars.parts.findIndex(p => p.PartNum == query) != -1) {
                            bezl.vars.selectedPart = bezl.vars.parts.find(p => p.PartNum == query);
                        }

                    }
                }
            });
            bezl.dataService.remove('GetPartDiscounts');
            bezl.vars.loadingParts = false;
        }

        if (bezl.data.newOrder) {
            bezl.vars.ds = bezl.data.newOrder;
            bezl.dataService.remove('newOrder');
            bezl.vars.newOrder = false;
        }

        if (bezl.data.submitOrder) {
            bezl.vars.submitOrder = bezl.data.submitOrder;
            bezl.dataService.remove('submitOrder');

            if (bezl.vars.submitOrder.BOUpdError != null) {
                if (bezl.vars.submitOrder.BOUpdError.length > 0) {
                    bezl.vars.submitOrder.BOUpdError.forEach(err => {
                        bezl.notificationService.showCriticalError(err.TableName + ': ' + err.ErrorText);
                    });          
                } else {
                    bezl.vars.submittedOrder = true;
                    bezl.notificationService.showSuccess('Order Submitted!');
                }
            }
            bezl.vars.submitOrder = false;
        }

        if (bezl.data.GetShipVias) {
            bezl.vars.shipVias = bezl.data.GetShipVias;
            bezl.dataService.remove('GetShipVias');
            bezl.vars.loadingShipVias = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});