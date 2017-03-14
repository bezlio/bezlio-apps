SELECT
	CallDesc AS ShortSummary
	, CallText AS Details
	, cl.LastDate AS CallDate
	, sr.Name AS SalesRepName
	, cl.RelatedToFile
	, ct.CallTypeDesc
	, cust.CustID AS ID
FROM 
	Erp.CRMCall cl with(nolock)

	LEFT OUTER JOIN Erp.SalesRep sr with(nolock) ON
	sr.Company = cl.Company
	AND sr.SalesRepCode = cl.SalesRepCode
	
	LEFT OUTER JOIN Erp.CallType ct with(nolock) ON
	ct.Company = cl.Company
	AND ct.CallTypeCode = cl.CallTypeCode
	
	INNER JOIN Erp.Customer cust with(nolock) ON
	cust.Company = cl.Company
	AND cust.CustNum = cl.CallCustNum
	
	INNER JOIN Erp.SalesRep csr with(nolock) ON
	csr.Company = cust.Company
	AND csr.SalesRepCode = cust.SalesRepCode
WHERE 
	DATEDIFF (day, cl.LastDate , GetDate()) < 90  
	--and cl.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
	AND csr.EMailAddress = '{EmailAddress}'
ORDER BY
	cl.LastDate desc
	, cl.LastTime desc