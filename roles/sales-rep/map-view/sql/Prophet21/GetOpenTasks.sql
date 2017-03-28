SELECT TOP 100
	  t.activity_desc As TaskDescription
	, Cast(td.start_date As Date) As StartDate
	, Cast(td.target_complete_date As Date) As DueDate
	, tt.category_desc As TypeDescription
	, '' As PercentComplete -- (originally Epicor10 Erp.Task.PercentComplete)
	, '' As PriorityCode -- (originally Epicor10 Erp.Task.PriorityCode)
	, t.activity_id As TaskID
	--, t.TaskSeqNum -- (originally Epicor10 Erp.Task.TaskSeqNum) (n/a?)
	, td.completed_flag
	, tt.category_id AS TaskType
	, '' AS RowMod
FROM
	p21_view_activity t with(nolock)
	INNER JOIN p21_view_activity_trans td with(nolock) ON
	t.activity_id = t.activity_id

	LEFT OUTER JOIN p21_view_category_x_activity cxa with(nolock) ON
	t.activity_id = cxa.activity_id
	INNER JOIN p21_view_category tt with(nolock) ON
	cxa.category_uid = tt.category_uid

	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	td.contact_id = sr.id
WHERE
	--?.customer_id = {CustNum} (n/a?)
	(sr.email_address IS NULL OR sr.email_address = '{EmailAddress}')
	-- (tsk.completed_flag = '?')
	AND td.completed_flag = 'N' -- 'N' was assumed
	--AND td.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one