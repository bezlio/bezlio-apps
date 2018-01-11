UPDATE [Tasks$] SET 
	TaskDescription = '{TaskDescription}'
	,StartDate = '{StartDate}'
	,DueDate = '{DueDate}'
	,PercentComplete = '{PercentComplete}'
	,PriorityCode = '{PriorityCode}'
	,Complete = '{Complete}'
WHERE 
	TaskID = '{TaskID}'