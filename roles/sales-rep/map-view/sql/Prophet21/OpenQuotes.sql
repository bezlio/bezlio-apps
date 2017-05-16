SELECT 
	  qh.quote_hdr_uid As QuoteNum
	, SUM(ol.extended_price) As QuoteAmt
FROM 
	p21_view_quote_hdr qh with(nolock)
	INNER JOIN p21_view_oe_hdr oe with(nolock) ON
	qh.oe_hdr_uid = oe.oe_hdr_uid
	INNER JOIN p21_view_oe_line ol with(nolock) ON
	oe.order_no = ol.order_no
WHERE
	oe.customer_id = {CustNum}
	--AND oe.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
	AND qh.complete_flag = 'N'
Group By qh.quote_hdr_uid