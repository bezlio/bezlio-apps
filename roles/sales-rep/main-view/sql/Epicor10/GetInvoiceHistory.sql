SELECT TOP 100
	ih.InvoiceNum
	, ih.InvoiceDate
	, ih.InvoiceAmt
FROM
	Erp.InvcHead ih with(nolock)
WHERE
	ih.CustNum = {CustNum}
	--AND ih.Company = 'EPIC06'
ORDER BY
	ih.InvoiceDate DESC