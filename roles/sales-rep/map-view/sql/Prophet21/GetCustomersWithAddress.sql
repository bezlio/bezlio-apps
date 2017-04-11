SELECT Top 100 -- TESTING
	  c.customer_id_string As CustID
	, c.customer_id As CustNum
	, c.customer_name As Name
	, a.phys_address1 + ' ' + a.phys_city + ', ' + a.phys_state + ' ' + a.phys_postal_code + ' ' AS Address
	, gl.Geocode_Location AS Geocode_Location
	, ct.customer_type AS CustomerType
	, t.territory_id AS Territory
	, c.date_acct_opened AS EstDate
	, Contacts = '<Contacts>' +
				(select (
					select ContactName, EMailAddress, ContactTitle, PhoneNum from (
						SELECT 
							  cn.descending_combined_name AS ContactName
							, cn.email_address AS EMailAddress
							, cn.title AS ContactTitle
							, cn.direct_phone AS PhoneNum
						FROM p21_view_contacts cn with(nolock)
						WHERE cn.address_id = a.id
				) A
				FOR XML PATH('Contact')
				)) + '</Contacts>'
	, LastContact = (SELECT TOP 1 Cast(cl.end_date As Date) FROM p21_view_call_log cl with(nolock) WHERE cl.customer_id = c.customer_id ORDER BY cl.end_date DESC)
	  -- (Epicor offers a FiscalYear for an Invoice. Prophet 21 appears to require some additional qualifying for Fiscal - pending based on demand.)
	, YTDSales = (SELECT SUM(ih.total_amount) FROM p21_view_invoice_hdr ih with(nolock) WHERE ih.company_no = c.company_id and ih.customer_id_number = c.customer_id and ih.year_for_period = YEAR(GETDATE()))
	, LYTDSales = (SELECT SUM(ih.total_amount) FROM p21_view_invoice_hdr ih with(nolock) WHERE ih.company_no = c.company_id and ih.customer_id_number = c.customer_id and ih.year_for_period = YEAR(GETDATE())-1)
	, TotalSales = (SELECT SUM(ih.total_amount) FROM p21_view_invoice_hdr ih with(nolock) WHERE ih.company_no = c.company_id and ih.customer_id_number = c.customer_id)
	, sr.id AS SalesRep --(or sr.descending_combined_name)
	, tm.terms_desc AS TermsDescription
	, NextTaskDue = (SELECT TOP 1 Cast(tsk.target_complete_date As Date) FROM p21_view_activity_trans tsk with(nolock) 
					 WHERE tsk.company_id = c.company_id 
						And tsk.contact_id In (Select id FROM p21_view_contacts with(nolock) WHERE address_id = a.id ) 
						-- (tsk.completed_flag = '?')
						And tsk.completed_flag = 'N' 
					 ORDER BY tsk.target_complete_date ASC)
FROM
	p21_view_customer c with(nolock)
	
	LEFT OUTER JOIN p21_view_address a with(nolock) ON
	c.customer_id = a.id

	LEFT OUTER JOIN Bezlio_Customer_Geocode_Location gl with(nolock) ON
	c.customer_id = gl.customer_id
	And c.company_id = gl.company_id

	INNER JOIN p21_view_customer_type ct with(nolock) ON
	c.customer_type_cd = ct.customer_type_uid

	LEFT OUTER JOIN p21_view_territory_x_customer tc with(nolock) ON
	c.customer_id = tc.customer_id
	LEFT OUTER JOIN p21_view_territory t with(nolock) ON
	tc.territory_uid = t.territory_uid

	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	c.salesrep_id = sr.id

	LEFT OUTER JOIN p21_view_terms tm with(nolock) ON
	c.service_terms_id = tm.terms_id	
WHERE
	a.phys_postal_code <> ''
	--AND sr.email_address = '{EmailAddress}' -- Disabled for TESTING
	--AND c.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
	AND c.customer_name NOT LIKE '%DO NOT USE%'
ORDER BY
	c.customer_name ASC