SELECT
	c.CustID
	, c.CustNum
	, c.Name
	, c.Address1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIP + ' ' AS Address
	, c.ServRef5 AS Geocode_Location
	, (CASE WHEN c.CustomerType = 'CUS' THEN 'Customer' ELSE (CASE WHEN c.CustomerType = 'SUS' THEN 'Suspect' ELSE (CASE WHEN c.CustomerType = 'PRO' THEN 'Prospect' ELSE c.CustomerType END) END) END) as CustomerType
	, t.TerritoryDesc AS Territory
	, {Col} as FilterValue
	, c.EstDate
	, Contacts = '<Contacts>' +
				(select (
					select ContactName, EMailAddress, ContactTitle, PhoneNum from (
						SELECT 
							ct.Name AS ContactName
							, ct.EMailAddress
							, ct.ContactTitle
							, ct.PhoneNum
						FROM Erp.CustCnt ct
						WHERE ct.Company = c.Company
						AND ct.CustNum = c.CustNum
				) A
				FOR XML PATH('Contact')
				)) + '</Contacts>'
	, c.SalesRepCode AS SalesRep
FROM
	Erp.Customer c with(nolock)
	
	INNER JOIN Erp.SalesTer t with(nolock) ON
	t.Company = c.Company
	AND t.TerritoryID = c.TerritoryID
	
	INNER JOIN Erp.SaleAuth sra with(nolock) ON
	sra.Company = c.Company
	AND sra.SalesRepCode = c.SalesRepCode

	INNER JOIN Erp.UserFile u with(nolock) ON
	u.DcdUserID = sra.DcdUserID
	AND u.EMailAddress = '{EmailAddress}'
WHERE
	c.ZIP <> ''
	--AND c.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	c.Name asc