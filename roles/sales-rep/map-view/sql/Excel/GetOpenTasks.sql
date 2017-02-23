SELECT TOP 100
	t.TaskDescription
	, t.StartDate
	, t.DueDate
	, tt.TypeDescription
	, t.PercentComplete
	, t.PriorityCode
	, t.TaskID
	, t.Complete
	, t.TaskType
FROM
	[Tasks$] t

	LEFT OUTER JOIN [TaskTypes$] tt ON
	tt.TaskType = t.TaskType
WHERE
	t.CustID = '{CustID}'
	AND (t.SalesRep IS NULL OR t.SalesRep = '{EmailAddress}')
	AND t.Complete = '0'