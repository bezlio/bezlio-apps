SELECT
	t.TaskDescription
	, t.StartDate
	, t.DueDate
	, tt.TypeDescription
	, t.PercentComplete
	, t.PriorityCode
	, t.TaskID
	, t.TaskSeqNum
	, t.Complete
	, t.TypeCode AS TaskType
	, '' AS RowMod
	, cust.CustID AS ID
	, cust.CustNum
	, t.Company
	, sr.SalesRepCode
FROM
	Erp.Task t with(nolock)

	LEFT OUTER JOIN Erp.SalesRep sr with(nolock) ON
	sr.Company = t.Company
	AND sr.SalesRepCode = t.SalesRepCode

	LEFT OUTER JOIN Erp.TaskType tt with(nolock) ON
	tt.Company = t.Company
	AND tt.TypeCode = t.TypeCode
	
	INNER JOIN Erp.Customer cust with(nolock) ON
	cust.Company = t.Company
	AND cust.CustNum = t.Key1
WHERE
	t.RelatedToFile = 'Customer'
	--AND (sr.EMailAddress IS NULL OR sr.EMailAddress = '{EmailAddress}')
	AND t.Complete = 0
	--AND t.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
