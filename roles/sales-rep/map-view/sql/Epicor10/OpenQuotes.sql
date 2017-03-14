SELECT 
	qh.QuoteNum
	, qh.QuoteAmt
FROM 
	Erp.QuoteHed qh with(nolock)
WHERE
	qh.CustNum = {CustNum}
	--AND qh.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one