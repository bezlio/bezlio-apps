


Select 
	r.INVOICE_ID As InvoiceNum,
	r.INVOICE_DATE As InvoiceDate,
	r.TOTAL_AMOUNT As InvoiceAmt,
	r.TOTAL_AMOUNT - r.PAID_AMOUNT As InvoiceBal,
	o.ORDER_DATE As OrderDate,
	o.CUSTOMER_PO_REF As PoNum,
	rl.LINE_NO As InvoiceLine,
	isnull(cl.PART_ID,rl.REFERENCE) As PartNum,
	cl.UNIT_PRICE As UnitPrice,
	rl.AMOUNT/nullif(rl.QTY,0) As ExtPrice,
	p.DESCRIPTION As PartDescription,
	rl.QTY As Qty
FROM
	RECEIVABLE_LINE rl with (nolock)
	left outer join CUST_ORDER_LINE cl with (nolock) on cl.CUST_ORDER_ID = rl.CUST_ORDER_ID and cl.LINE_NO = rl.CUST_ORDER_LINE_NO
	LEFT OUTER JOIN PART p with (nolock) ON p.ID = cl.PART_ID
	LEFT OUTER JOIN RECEIVABLE r with (nolock) ON r.INVOICE_ID = rl.INVOICE_ID
	LEFT OUTER JOIN CUSTOMER_ORDER o with (nolock) ON o.ID = rl.CUST_ORDER_ID
WHERE 
	r.INVOICE_DATE >= '{StartDate}' AND r.INVOICE_DATE <= '{EndDate}'
ORDER BY 
	INVOICE_DATE Desc



