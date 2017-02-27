define(function () {
    /**
     * Returns a ds of a new order for the selected customer
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} company - Company ID for the call
     * @param {Number} custNum - The customer number to add this call for
     */
    function NewOrder (bezl,
                      company,
                      custNum) {
        
        // bezl.dataService.add(
        //     'NewOrder'
        //     , 'brdb'
        //     , 'sales-rep-newOrder'
        //     , 'SalesOrder_NewOrderByCustomer'
        //     , {
        //         'CustNum': custNum
        //     }
        //     , 0);
        bezl.dataService.add('newOrder','brdb','Epicor10','SalesOrder_NewOrderByCustomer',
        { "Connection":"Epicor 10 AE", 
            "Company":"EPIC06", 
            "CustNum": custNum,
        },0);

        bezl.vars.newOrder = true;

    }

    return {
        newOrder: NewOrder
    }
});