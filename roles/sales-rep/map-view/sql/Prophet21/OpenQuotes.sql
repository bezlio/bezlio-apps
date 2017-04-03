SELECT 
	  qh.quote_hdr_uid As QuoteNum
	, ot.sales_total As QuoteAmt
FROM 
	p21_view_quote_hdr qh with(nolock)
	INNER JOIN p21_view_oe_hdr oe with(nolock) ON
	qh.oe_hdr_uid = oe.oe_hdr_uid
	INNER JOIN p21_view_order_totals ot with(nolock) ON
	eo.oe_hdr_uid = ot.oe_hdr_uid
WHERE
	oe.customer_id = {CustNum}
	--AND oe.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one