Select 
	ERP.InvcHead.InvoiceNum As InvoiceNum,
	ERP.InvcHead.InvoiceDate As InvoiceDate,
	ERP.InvcHead.InvoiceAmt As InvoiceAmt,
	ERP.InvcHead.InvoiceBal As InvoiceBal,
	ERP.Customer.CustID As CustID,
	ERP.Customer.Name As CustName,
	ERP.OrderHed.OrderDate As OrderDate,
	ERP.OrderHed.PONum As PoNum,
	Erp.InvcDtl.InvoiceLine As InvoiceLine,
	Erp.InvcDtl.PartNum As PartNum,
	Erp.InvcDtl.UnitPrice As UnitPrice,
	Erp.InvcDtl.ExtPrice As ExtPrice,
	Erp.Part.PartDescription As PartDescription,
	Erp.InvcDtl.SellingShipQty As Qty


FROM
	Erp.InvcDtl with (nolock)
	LEFT OUTER JOIN Erp.Part with (nolock) ON Erp.InvcDtl.Company = Erp.Part.Company AND Erp.InvcDtl.PartNum = Erp.Part.PartNum
	LEFT OUTER JOIN Erp.InvcHead with (nolock) ON Erp.InvcDtl.Company = Erp.InvcHead.Company  AND Erp.InvcDtl.InvoiceNum = Erp.InvcHead.InvoiceNum
	LEFT OUTER JOIN Erp.OrderHed with (nolock) ON Erp.InvcHead.Company = Erp.OrderHed.Company AND Erp.InvcHead.OrderNum = Erp.OrderHed.OrderNum
	INNER JOIN Erp.Customer with (nolock) ON Erp.InvcHead.Company = Erp.Customer.Company AND Erp.InvcHead.CustNum = Erp.Customer.CustNum

WHERE 
	ERP.InvcHead.InvoiceDate >= '{StartDate}' AND ERP.InvcHead.InvoiceDate <= '{EndDate}' AND
	ERP.Customer.CustID = '{CustID}' 
ORDER BY 
	ERP.InvcHead.InvoiceDate Desc
