SELECT TOP 100
	ih.InvoiceNum
	, ih.InvoiceDate
	, ih.InvoiceAmt
FROM
	[InvoiceHistory$] ih
WHERE
	ih.CustID = '{CustID}'
ORDER BY
	ih.InvoiceDate DESC