define(function () {
    /**
     * Returns a ds of a new order for the selected customer
     * @param {Object[]} bezl - A reference to the calling Bezl
     */
    function NewOrder (bezl) {
        // I dont think we're going to do anything with this
    }

    function SubmitOrder (bezl) {
        // Set up our structure for creating the order
        bezl.vars.mergeDs = {CUSTOMER_ORDER: [
            {
                CUSTOMER_ID: bezl.vars.selectedCustomer.ID,
                SITE_ID: bezl.vars.company
            }
        ]}

        bezl.vars.mergeDs.CUSTOMER_ORDER.forEach( oh => {
            if (bezl.vars.PONumber) {
                oh.CUSTOMER_PO_REF = bezl.vars.PONumber;
            }
            if (bezl.vars.OrderDate) {
                oh.ORDER_DATE = bezl.vars.OrderDate;
            }
            if (bezl.vars.NeedBy) {
                oh.PROMISE_DATE = bezl.vars.NeedBy;
            }
            if (bezl.vars.ShipBy) {
                oh.DESIRED_SHIP_DATE = bezl.vars.ShipBy; 
            }

            if (bezl.vars.ShipVia) {
                oh.SHIP_VIA = bezl.vars.ShipVia;
            }

        })

        // // This will take the structure from our bezl vars and stuff it into the ds specific to Epicor
        // bezl.vars.partList.forEach(p => {
        //     bezl.vars.ds.OrderDtl.push({
        //         OpenLine: true,
        //         VoidLine: false,
        //         Company: bezl.vars.company,
        //         OrderNum: 0,
        //         OrderLine: 0,
        //         LineType: 'PART',
        //         PartNum: p.PartNum,
        //         LineDesc: p.PartDescription,
        //         OrderComment: p.Comment,
        //         IUM: p.UOM,
        //         RevisionNum: '',
        //         SellingQuantity: p.Qty,
        //         UnitPrice: p.UnitPrice,
        //         DocUnitPrice: p.UnitPrice,
        //         MktgCampaignID: 'CURR',
        //         MktgEvntSeq: 1,
        //         CustNum: bezl.vars.selectedCustomer.CustNum,
        //         LockQty: false,
        //         RowMod: 'U',
        //         ShortChar10: ''
        //     })
        // });
        // Now we will submit the order for processing
        bezl.dataService.add('submitOrder','brdb','Visual8','ExecuteBOMethod',
        { "Connection": bezl.vars.connection, "BOName": "Lsa.Vmfg.Sales.CustomerOrder",
        "Parameters": 
            [
            { "Key": "Load", "Value": JSON.stringify({customerID: ""}) },
            { "Key": "NewOrderRow", "Value": JSON.stringify({orderID: "<1>"}) },
            { "Key": "MergeDataSet", "Value": JSON.stringify(bezl.vars.mergeDs) },
            { "Key": "Save", "Value": JSON.stringify({}) }
            ] },0);

        bezl.vars.submitOrder = true;

    }

    return {
        newOrder: NewOrder,
        submitOrder: SubmitOrder
    }
});