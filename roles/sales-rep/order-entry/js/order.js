define(function () {
 
    function RunQuery (bezl, queryName) {
    }

    function AddLine (bezl) {
        bezl.vars.partList.push({
            PartNum: bezl.vars.selectedPart.PartNum,
            PartDescription: bezl.vars.selectedPart.PartDescription, 
            Qty: 0,
            UOM: bezl.vars.selectedPart.IUM, 
            QtyOnHand: bezl.vars.selectedPart.OnHandQty,
            UnitPrice: bezl.vars.selectedPart.BasePrice,
            Comment: ''
        });
    }
    
    return {
        runQuery: RunQuery,
        addLine: AddLine
    }
});