Select 
	InvcHead.InvoiceNum As InvoiceNum,
	InvcHead.InvoiceDate As InvoiceDate,
	InvcHead.InvoiceAmt As InvoiceAmt,
	InvcHead.InvoiceBal As InvoiceBal,
	Customer.CustID As CustID,
	Customer.Name As CustName,
	OrderHed.OrderDate As OrderDate,
	OrderHed.PONum As PoNum,
	InvcDtl.InvoiceLine As InvoiceLine,
	InvcDtl.PartNum As PartNum,
	InvcDtl.UnitPrice As UnitPrice,
	InvcDtl.ExtPrice As ExtPrice,
	Part.PartDescription As PartDescription,
	InvcDtl.SellingShipQty As Qty


FROM
	InvcDtl with (nolock)
	LEFT OUTER JOIN Part with (nolock) ON InvcDtl.Company = Part.Company AND InvcDtl.PartNum = Part.PartNum
	LEFT OUTER JOIN InvcHead with (nolock) ON InvcDtl.Company = InvcHead.Company  AND InvcDtl.InvoiceNum = InvcHead.InvoiceNum
	LEFT OUTER JOIN OrderHed with (nolock) ON InvcHead.Company = OrderHed.Company AND InvcHead.OrderNum = OrderHed.OrderNum
	INNER JOIN Customer with (nolock) ON InvcHead.Company = Customer.Company AND InvcHead.CustNum = Customer.CustNum

WHERE 
	InvcHead.InvoiceDate >= '{StartDate}' AND InvcHead.InvoiceDate <= '{EndDate}' AND
	Customer.CustID = '{CustID}' 
ORDER BY 
	InvcHead.InvoiceDate Desc
