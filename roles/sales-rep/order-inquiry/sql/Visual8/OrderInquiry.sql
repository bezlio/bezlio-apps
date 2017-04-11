


Select TOP 100
	o.ID As OrderNum,
	convert(varchar,o.ORDER_DATE,101) As OrderDate,
	o.CUSTOMER_PO_REF As PoNum,
	o.TOTAL_AMT_ORDERED As OrderAmt,
	NULL As OpenOrder,
	l.LINE_NO As OrderLine,
	l.PART_ID As PartNum,
	p.DESCRIPTION As PartDesc,
	l.UNIT_PRICE As UnitPrice,
	l.TOTAL_AMT_ORDERED/l.ORDER_QTY As ExtPrice,
	l.ORDER_QTY As OrderQty,
	l.TOTAL_SHIPPED_QTY as ShippedQty
From 
	CUSTOMER_ORDER o with (nolock)
	INNER JOIN CUST_ORDER_LINE l with (nolock) ON o.ID = l.CUST_ORDER_ID
	inner join CUSTOMER c with(nolock) on c.ID = o.CUSTOMER_ID
	LEFT OUTER JOIN PART p with (nolock) On p.ID = l.PART_ID
WHERE 
	o.ORDER_DATE >= '{StartDate}' AND o.ORDER_DATE <= '{EndDate}' 
	AND	c.NAME =  CASE WHEN '{Company}' <> 'ALL' THEN '{Company}' ELSE c.NAME END
ORDER BY 
	o.ORDER_DATE Desc
