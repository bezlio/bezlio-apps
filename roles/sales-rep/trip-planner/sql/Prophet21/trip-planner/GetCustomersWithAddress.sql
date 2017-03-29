SELECT
	  c.CustID
	, c.customer_id As CustNum
	, c.customer_name As Name
	, c.phys_address1 + ' ' + c.phys_city + ', ' + c.phys_state + ' ' + c.phys_postal_code + ' ' AS Address
	, gl.Geocode_Location AS Geocode_Location
	, ct.customer_type AS CustomerType
	, t.territory_id AS Territory
	, c.date_acct_opened AS EstDate
	, Contacts = '<Contacts>' +
				(select (
					select ContactName, EMailAddress, ContactTitle, PhoneNum from (
						SELECT 
							  cn.descending_combined_nameName AS ContactName
							, cn.email_address AS EMailAddress
							, cn.title AS ContactTitle
							, cn.direct_phone AS PhoneNum
						FROM p21_view_contacts cn with(nolock)
						WHERE cn.address_id = a.id
				) A
				FOR XML PATH('Contact')
				)) + '</Contacts>'
	, sr.id AS SalesRep --(or sr.descending_combined_name)
FROM
	p21_view_customer c with(nolock)
	
	LEFT OUTER JOIN p21_view_address a with(nolock) ON
	c.customer_id = a.id

	INNER JOIN p21_view_customer_type ct with(nolock) ON
	c.customer_type_cd = ct.customer_type_uid

	LEFT OUTER JOIN p21_view_territory_x_customer tc with(nolock) ON
	c.customer_id = tc.customer_id
	LEFT OUTER JOIN p21_view_territory t with(nolock) ON
	tc.territory_uid = t.territory_uid

	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	c.salesrep_id = sr.id

	LEFT OUTER JOIN Bezlio_Customer_Geocode_Location gl with(nolock) ON
	c.customer_id = gl.customer_id
	And c.company_id = gl.company_id
WHERE
	c.phys_postal_code <> ''
	AND sr.email_address = '{EmailAddress}'
	--AND c.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	c.customer_name ASC