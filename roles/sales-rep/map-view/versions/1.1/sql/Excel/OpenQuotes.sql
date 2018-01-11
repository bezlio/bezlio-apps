SELECT 
	qh.QuoteNum
	, qh.QuoteAmt
FROM 
	[QuoteHistory$] qh
WHERE
	qh.CustID = '{CustID}'