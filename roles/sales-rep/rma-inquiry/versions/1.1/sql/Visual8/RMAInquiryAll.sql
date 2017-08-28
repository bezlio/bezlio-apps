
Select top 200
	isnull(c.NAME, c_new.NAME) As Company,
	r.ID As RMANum,
	r.CREATE_DATE As RMADate,
	isnull(c.NAME,c_new.NAME) As CustName,
	'' AS ContactName,
	--ALL LINE INFO
	l.LINE_NO As RMALine,
	isnull(r.ORG_CUST_ORDER_ID,'') As OrderNum,
	isnull(l.ORG_ORDER_LINE_NO,'') As OrderLine,
	isnull(r.PACKLIST_ID,'') As OrderRelNum,
	isnull(col.PART_ID, col_new.PART_ID) As PartNum,
	'' As RevNum,
	isnull(isnull(col.MISC_REFERENCE, col_new.MISC_REFERENCE),col.PART_ID) As LineDesc,
	l.QTY As ReturnQty,
	isnull(re.DESCRIPTION,'') As ReasonDesc
FROM RMA r with (nolock)
	INNER JOIN RMA_LINE l with(nolock) ON r.ID = l.RMA_ID
	LEFT OUTER JOIN REASON re with(nolock) ON re.CODE = r.RETURN_REASON_CODE
	-- New Order
	LEFT OUTER JOIN CUST_ORDER_LINE col_new with(nolock) on col_new.CUST_ORDER_ID = r.NEW_CUST_ORDER_ID and col_new.LINE_NO = l.NEW_ORDER_LINE_NO
	LEFT OUTER JOIN CUSTOMER_ORDER co_new with(nolock) on co_new.ID = r.NEW_CUST_ORDER_ID
	LEFT OUTER JOIN CUSTOMER c_new with(nolock) ON c_new.ID = co_new.CUSTOMER_ID
	-- Original Order
	LEFT OUTER JOIN CUST_ORDER_LINE col with(nolock) on col.CUST_ORDER_ID = r.ORG_CUST_ORDER_ID and col.LINE_NO = l.ORG_ORDER_LINE_NO
	LEFT OUTER JOIN CUSTOMER_ORDER co with(nolock) on co.ID = r.ORG_CUST_ORDER_ID
	LEFT OUTER JOIN CUSTOMER c with(nolock) ON c.ID = co.CUSTOMER_ID
	-- Sales Rep Email
	LEFT OUTER JOIN bzl_RepEmails b on b.SALESREP_ID = c.SALESREP_ID
WHERE
	r.CREATE_DATE >= '{StartDate}' AND r.CREATE_DATE <= '{EndDate}' AND
	c.NAME =  CASE WHEN 'ALL' <> 'ALL' THEN 'ALL' ELSE c.NAME END AND
	--c.ID = '{CustID}' AND
	b.EMAIL = '{EmailAddress}'
ORDER BY 
	r.CREATE_DATE Desc
