SELECT
	  t.activity_desc As TaskDescription
	, Cast(td.start_date As Date) As StartDate
	, Cast(td.target_complete_date As Date) As DueDate
	, tt.category_desc As TypeDescription
	, '' As PercentComplete -- (originally Epicor10 Erp.Task.PercentComplete)
	, '' As PriorityCode -- (originally Epicor10 Erp.Task.PriorityCode)
	, t.activity_id As TaskID
	--, t.TaskSeqNum -- (originally Epicor10 Erp.Task.TaskSeqNum) (n/a?)
	, td.completed_flag AS Complete
	, tt.category_id AS TaskType
	, '' AS RowMod
	, c.customer_id_string AS ID
	, c.customer_id AS CustNum
	, td.company_id AS Company
	, sr.id AS SalesRepCode
FROM
	p21_view_activity t with(nolock)
	INNER JOIN p21_view_activity_trans td with(nolock) ON
	t.activity_id = td.activity_id

	LEFT OUTER JOIN p21_view_contacts cn with(nolock) ON
	td.contact_id = cn.id
	LEFT JOIN p21_view_customer c with(nolock) ON
	cn.address_id = c.id

	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	c.salesrep_id = sr.id

	LEFT OUTER JOIN p21_view_category_x_activity cxa with(nolock) ON
	t.activity_id = cxa.activity_id
	LEFT JOIN p21_view_category tt with(nolock) ON
	cxa.category_uid = tt.category_uid
WHERE
	--(sr.email_address IS NULL OR sr.email_address = '{EmailAddress}') -- Disabled for TESTING
	--AND td.completed_flag = 'N' -- 'N' was assumed -- Disabled for TESTING
	--AND td.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one