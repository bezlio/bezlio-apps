SELECT TOP 100 
	CallDesc AS ShortSummary
	, CallText AS Details
	, cl.LastDate AS CallDate
	, sr.Name AS SalesRepName
	, cl.RelatedToFile
	, ct.CallTypeDesc
FROM 
	Erp.CRMCall cl with(nolock)

	LEFT OUTER JOIN Erp.SalesRep sr with(nolock) ON
	sr.Company = cl.Company
	AND sr.SalesRepCode = cl.SalesRepCode
	
	LEFT OUTER JOIN Erp.CallType ct with(nolock) ON
	ct.Company = cl.Company
	AND ct.CallTypeCode = cl.CallTypeCode
WHERE 
	cl.CallCustNum = {CustNum}
	--and cl.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	cl.LastDate desc
	, cl.LastTime desc