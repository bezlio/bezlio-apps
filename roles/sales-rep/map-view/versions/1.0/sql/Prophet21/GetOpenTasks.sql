SELECT
	  t.activity_desc As TaskDescription
	, Cast(td.start_date As Date) As StartDate
	, Cast(td.target_complete_date As Date) As DueDate
	, '' As TypeDescription --tt.category_desc
	, '' As PercentComplete
	, '' As PriorityCode
	, t.activity_id As TaskID
	, '' As TaskSeqNum
	, Case td.completed_flag When 'Y' Then 1 Else 0 End As Complete
	, '' As TaskType --tt.category_id
	, '' As RowMod
FROM
	p21_view_activity t with(nolock)
	INNER JOIN p21_view_activity_trans td with(nolock) ON
	t.activity_id = t.activity_id

	--LEFT OUTER JOIN p21_view_category_x_activity cxa with(nolock) ON
	--t.activity_id = cxa.activity_id
	--INNER JOIN p21_view_category tt with(nolock) ON
	--cxa.category_uid = tt.category_uid

	LEFT OUTER JOIN p21_view_contacts cn with(nolock) ON
	td.contact_id = cn.id
	LEFT OUTER JOIN p21_view_address a with(nolock) ON
	cn.address_id = a.id
	LEFT OUTER JOIN p21_view_customer c with(nolock) ON
	a.id = c.customer_id
WHERE
	c.customer_id = {CustNum}
	--AND (sr.email_address IS NULL OR sr.email_address = '{EmailAddress}') -- Disabled for TESTING
	AND td.completed_flag = 'N'
	--AND td.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one