SELECT
	  ih.invoice_no As InvoiceNum
	, ih.invoice_date As InvoiceDate
	, ih.total_amount As InvoiceAmt
FROM
	p21_view_invoice_hdr ih with(nolock)
WHERE
	ih.customer_id_number = {CustNum}
	--AND ih.company_no = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	ih.nvoice_date DESC