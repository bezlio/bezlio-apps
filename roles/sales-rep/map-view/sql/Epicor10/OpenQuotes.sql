SELECT 
	qh.QuoteNum
	, qh.QuoteAmt
FROM 
	Erp.QuoteHed qh with(nolock)
WHERE
	qh.CustNum = {CustNum}
	--AND qh.Company = 'EPIC06'