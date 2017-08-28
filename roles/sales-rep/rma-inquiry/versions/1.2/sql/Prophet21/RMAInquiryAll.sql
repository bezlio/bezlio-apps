select 
rma.company_id AS Company
,rma.customer_id
,rma.order_no AS RMANum
,rma.order_date AS RMADate
,rma.customer_name AS CustName
,COALESCE(rma.order_salesrep_first_name, '')+' '+
		COALESCE(rma.order_salesrep_mi,'')+' '+
		COALESCE(rma.order_salesrep_last_name,'') AS ContactName
,rma.line_no AS RMALine
,rma.order_no AS OrderNum
,rma.line_no AS OrderLine
,rma.order_no AS OrderRelNum

,rma.item_id AS PartNum
,'' AS RevNum
,rma.item_desc AS LineDesc
,rma.unit_quantity AS ReturnQty
,' ' AS ReasonDesc

--,rma.order_salesrep_id
--,sr.email_address

 from p21_view_open_rma_report rma

 LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
 rma.order_salesrep_id = sr.id

 Where
	(rma.order_date >= '{StartDate}' And rma.order_date <= '{EndDate}' + ' 23:59:59') and
	--(rma.customer_id = '{CustID}') 
	sr.email_address = '{EmailAddress}'
