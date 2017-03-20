define(function () {
    /**
     * Returns a ds of a new order for the selected customer
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} company - Company ID for the call
     * @param {Number} custNum - The customer number to add this call for
     */
    function NewOrder(bezl,
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
        bezl.dataService.add('newOrder', 'brdb', 'Epicor10', 'SalesOrder_NewOrderByCustomer',
            {
                "Connection": "Epicor 10 AE",
                "Company": "EPIC06",
                "CustNum": custNum,
            }, 0);

        bezl.vars.newOrder = true;

    }

    function SubmitOrder(bezl, company) {

        // This will take the structure from our bezl vars and stuff it into the ds specific to Epicor
        bezl.vars.partList.forEach(p => {
            bezl.vars.ds.OrderDtl.push({
                OpenLine: true,
                VoidLine: false,
                Company: 'EPIC06',
                OrderNum: 0,
                OrderLine: 0,
                LineType: 'PART',
                PartNum: p.PartNum,
                LineDesc: p.PartDescription,
                IUM: p.IUM,
                RevisionNum: '',
                SellingQuantity: p.Qty,
                UnitPrice: p.UnitPrice,
                DocUnitPrice: p.UnitPrice,
                MktgCampaignID: 'Customer',
                MktgEvntSeq: 1,
                CustNum: bezl.vars.selectedAccount.CustNum,
                LockQty: false,
                RowMod: 'U'
            })
        });
        // Now we will submit the order for processing
        bezl.dataService.add('submitOrder', 'brdb', 'Epicor10', 'SalesOrder_SubmitNewOrder',
            {
                "Connection": "Epicor 10 AE",
                "Company": "EPIC06",
                "ds": JSON.stringify(bezl.vars.ds)
            }, 0);

        bezl.vars.submitOrder = true;

    }

    return {
        newOrder: NewOrder,
        submitOrder: SubmitOrder
    }
});