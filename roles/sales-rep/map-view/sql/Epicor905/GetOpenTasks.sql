SELECT TOP 100
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
FROM
	Task t with(nolock)

	LEFT OUTER JOIN SalesRep sr with(nolock) ON
	sr.Company = t.Company
	AND sr.SalesRepCode = t.SalesRepCode

	LEFT OUTER JOIN TaskType tt with(nolock) ON
	tt.Company = t.Company
	AND tt.TypeCode = t.TypeCode

	LEFT OUTER JOIN SaleAuth sra with(nolock) ON
	sra.Company = sr.Company
	AND sra.SalesRepCode = sr.SalesRepCode

	LEFT OUTER JOIN UserFile u with(nolock) ON
	u.DcdUserID = sra.DcdUserID
	AND u.EMailAddress = '{EmailAddress}'
WHERE
	t.RelatedToFile = 'Customer'
	AND t.Key1 = {CustNum}
	AND (sr.EMailAddress IS NULL OR u.EMailAddress = '{EmailAddress}')
	AND t.Complete = 0
	--AND t.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one