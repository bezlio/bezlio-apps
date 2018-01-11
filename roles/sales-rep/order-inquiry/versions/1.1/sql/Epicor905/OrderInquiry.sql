Select TOP 100
	OrderHed.OrderNum As OrderNum,
	OrderHed.OrderDate As OrderDate,
	OrderHed.PONum As PoNum,
	OrderHed.DocOrderAmt As OrderAmt,
	OrderHed.OpenOrder As OpenOrder,
	Customer.CustID As CustID,
	Customer.Name As CustName,
	OrderDtl.OrderLine As OrderLine,
	OrderDtl.PartNum As PartNum,
	Part.PartDescription As PartDesc,
	OrderDtl.DocUnitPrice As UnitPrice,
	OrderDtl.DocExtPriceDtl As ExtPrice,
	OrderDtl.SellingQuantity As OrderQty,
	(Select Sum(OrderRel.SellingJobShippedQty + OrderRel.SellingStockShippedQty) 
		FROM OrderRel with (nolock)
		Where OrderDtl.Company = OrderRel.Company AND OrderDtl.OrderNum = OrderRel.OrderNum AND OrderDtl.OrderLine= OrderRel.OrderLine
		Group By OrderRel.Company,OrderRel.OrderNum, OrderRel.OrderLine) As ShippedQty
From 
	OrderHed with (nolock)
	INNER JOIN Customer with (nolock) ON OrderHed.Company = Customer.Company AND OrderHed.CustNum = Customer.CustNum
	INNER JOIN OrderDtl with (nolock) ON OrderHed.Company = OrderDtl.Company AND OrderHed.OrderNum = OrderDtl.OrderNum
	LEFT OUTER JOIN Part with (nolock) ON OrderDtl.Company = Part.Company AND OrderDtl.PartNum = Part.PartNum
WHERE 
	Customer.CustID = '{CustID}' AND
	OrderHed.OrderDate >= '{StartDate}' AND OrderHed.OrderDate <= '{EndDate}' AND
	OrderHed.Company =  CASE WHEN '{Company}' <> 'ALL' THEN '{Company}' ELSE OrderHed.Company END
ORDER BY 
	OrderHed.OrderDate Desc