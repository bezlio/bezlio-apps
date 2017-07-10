

SELECT
	c.ID as CustID
	, c.ID as CustNum
	, c.Name
	, c.ADDR_1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIPCODE + ' ' AS Address
	, c.USER_5 AS Geocode_Location  -- UPDATE TO AVAILABLE USER DEFINED FIELD
	, 'Customer' as CustomerType
	, t.DESCRIPTION AS Territory
	, c.OPEN_DATE as EstDate
	, Contacts = '<Contacts>' +
				(select (
					select ContactName, EMailAddress, ContactTitle, PhoneNum from (
						SELECT 
							ct.FIRST_NAME + ' ' + ct.LAST_NAME AS ContactName
							, ct.EMAIL as EMailAddress
							, ct.POSITION as ContactTitle
							, ct.PHONE as PhoneNum
						FROM CONTACT ct inner join CUST_CONTACT cc on ct.ID = cc.CONTACT_ID
						WHERE cc.CUSTOMER_ID = c.ID
				) A
				FOR XML PATH('Contact')
				)) + '</Contacts>'
	, sr.ID AS SalesRep
FROM
	CUSTOMER c with(nolock)
	INNER JOIN TERRITORY t with(nolock) ON t.CODE = c.TERRITORY
	INNER JOIN SALES_REP sr with(nolock) ON	sr.ID = c.SALESREP_ID
	INNER JOIN bzl_RepEmails b with(nolock) on b.SALESREP_ID = c.SALESREP_ID  -- XREF TABLE OR VIEW TO SALES REP EMAILS
WHERE c.ACTIVE_FLAG = 'Y'
	and	c.ZIPCODE <> ''
	and b.emailaddress1 = '{EmailAddress}'
ORDER BY
	c.Name asc


	