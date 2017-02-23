SELECT TOP 100 
	cl.ShortSummary
	, cl.Details 
	, cl.CallDate
	, sr.SalesRepName
	, ct.CallTypeDesc
FROM 
	[CallHistory$] cl, [SalesReps$] sr, [CallTypes$] ct
WHERE 
	cl.CustID = '{CustID}'
	AND sr.SalesRep = cl.SalesRep
	AND ct.CallType = cl.CallType
ORDER BY
	cl.CallDate desc