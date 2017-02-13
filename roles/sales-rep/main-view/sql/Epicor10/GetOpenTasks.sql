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
	Erp.Task t with(nolock)

	LEFT OUTER JOIN Erp.SalesRep sr with(nolock) ON
	sr.Company = t.Company
	AND sr.SalesRepCode = t.SalesRepCode

	LEFT OUTER JOIN Erp.TaskType tt with(nolock) ON
	tt.Company = t.Company
	AND tt.TypeCode = t.TypeCode
WHERE
	t.RelatedToFile = 'Customer'
	AND t.Key1 = {CustNum}
	AND (sr.EMailAddress IS NULL OR sr.EMailAddress = '{EmailAddress}')
	AND t.Complete = 0
	--AND t.Company = 'EPIC06'