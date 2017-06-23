SELECT TOP 100
	ih.InvoiceNum
	, ih.InvoiceDate
	, ih.InvoiceAmt
FROM
	Erp.InvcHead ih with(nolock)
WHERE
	ih.CustNum = {CustNum}
	--AND ih.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	ih.InvoiceDate DESC