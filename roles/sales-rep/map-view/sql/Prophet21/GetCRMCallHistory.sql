SELECT
	  cl.category_id AS ShortSummary
	, cl.notes AS Details
	, Cast(cl.start_date As Date) AS CallDate
	, sr.name AS SalesRepName
	, '' AS RelatedToFile
	, ct.category_desc AS CallTypeDesc
FROM 
	p21_view_call_log cl with(nolock)

	LEFT OUTER JOIN p21_view_users sr with(nolock) ON
	sr.id = cl.user_id
	
	LEFT OUTER JOIN p21_view_call_category ct with(nolock) ON
	ct.category_id = cl.category_id -- (non Primary Key)
WHERE 
	cl.customer_id = {CustNum}
ORDER BY
	  cl.start_date desc