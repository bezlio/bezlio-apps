Select 
	RECEIVABLE.INVOICE_ID As InvoiceNum,
	RECEIVABLE.INVOICE_DATE As InvoiceDate,
	RECEIVABLE.TOTAL_AMOUNT As InvoiceAmt,
	RECEIVABLE.TOTAL_AMOUNT - RECEIVABLE.PAID_AMOUNT As InvoiceBal,
	RECEIVABLE.CUSTOMER_ID As CustID,
	CUSTOMER.NAME As CustName,
	CUSTOMER_ORDER.ORDER_DATE As OrderDate,
	CUSTOMER_ORDER.CUSTOMER_PO_REF As PoNum,
	RECEIVABLE_LINE.LINE_NO As InvoiceLine,
	CUST_ORDER_LINE.PART_ID As PartNum,
	CUST_ORDER_LINE.UNIT_PRICE As UnitPrice,
	CUST_ORDER_LINE.USER_ORDER_QTY * CUST_ORDER_LINE.UNIT_PRICE As ExtPrice,
	Part.DESCRIPTION As PartDescription,
	CUST_ORDER_LINE.TOTAL_USR_SHIP_QTY As Qty
FROM
	RECEIVABLE_LINE with (nolock)
	LEFT OUTER JOIN CUST_ORDER_LINE with (nolock) ON RECEIVABLE_LINE.CUST_ORDER_ID = CUST_ORDER_LINE.CUST_ORDER_ID AND RECEIVABLE_LINE.CUST_ORDER_LINE_NO = CUST_ORDER_LINE.LINE_NO
	LEFT OUTER JOIN PART with (nolock) ON CUST_ORDER_LINE.PART_ID = PART.ID
	LEFT OUTER JOIN RECEIVABLE with (nolock) ON RECEIVABLE_LINE.INVOICE_ID = RECEIVABLE.INVOICE_ID
	LEFT OUTER JOIN CUSTOMER_ORDER with (nolock) ON RECEIVABLE_LINE.CUST_ORDER_ID = CUSTOMER_ORDER.ID
	INNER JOIN CUSTOMER with (nolock) ON RECEIVABLE.CUSTOMER_ID = CUSTOMER.ID
WHERE 
	RECEIVABLE.INVOICE_DATE >= '{StartDate}' AND RECEIVABLE.INVOICE_DATE <= '{EndDate}' 
ORDER BY 
	RECEIVABLE.INVOICE_DATE Desc