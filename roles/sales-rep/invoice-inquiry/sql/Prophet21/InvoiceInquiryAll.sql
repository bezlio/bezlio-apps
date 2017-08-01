Select 
	p21_view_invoice_hdr.invoice_no As InvoiceNum,
	p21_view_invoice_hdr.invoice_date As InvoiceDate,
	p21_view_invoice_hdr.total_amount As InvoiceAmt,
	p21_view_invoice_hdr.total_amount - p21_view_invoice_hdr.amount_paid As InvoiceBal,
	p21_view_invoice_hdr.order_date As OrderDate,
	p21_view_invoice_hdr.po_no As PoNum,
	p21_view_invoice_line.line_no As InvoiceLine,
	p21_view_invoice_line.customer_part_number As PartNum,
	p21_view_invoice_line.unit_price As UnitPrice,
	p21_view_invoice_line.extended_price As ExtPrice,
	p21_view_invoice_line.item_desc As PartDescription,
	p21_view_invoice_line.qty_shipped As Qty
FROM
	p21_view_invoice_line with (nolock)
	INNER JOIN p21_view_invoice_hdr with (nolock) ON p21_view_invoice_line.company_id = p21_view_invoice_hdr.company_no  AND p21_view_invoice_line.invoice_no = p21_view_invoice_hdr.invoice_no

	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	p21_view_invoice_hdr.salesrep_id = sr.id

WHERE 
	(p21_view_invoice_hdr.invoice_date >= '{StartDate}' AND p21_view_invoice_hdr.invoice_date <= '{EndDate}' + ' 23:59:59') 
	AND sr.email_address = '{EmailAddress}'
	--AND (p21_view_invoice_hdr.customer_id = '{CustID}')
ORDER BY 
	p21_view_invoice_hdr.invoice_date Desc