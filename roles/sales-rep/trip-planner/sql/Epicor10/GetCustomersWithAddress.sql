SELECT
	c.CustID
	, c.CustNum
	, c.Name
	, c.Address1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIP + ' ' AS Address
	, c.ServRef5 AS Geocode_Location
	, (CASE WHEN c.CustomerType = 'CUS' THEN 'Customer' ELSE (CASE WHEN c.CustomerType = 'SUS' THEN 'Suspect' ELSE (CASE WHEN c.CustomerType = 'PRO' THEN 'Prospect' ELSE c.CustomerType END) END) END) as CustomerType
	, t.TerritoryDesc AS Territory
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
	, sr.SalesRepCode AS SalesRep
FROM
	Erp.Customer c with(nolock)
	
	INNER JOIN Erp.SalesTer t with(nolock) ON
	t.Company = c.Company
	AND t.TerritoryID = c.TerritoryID
	
	INNER JOIN Erp.SalesRep sr with(nolock) ON
	sr.Company = c.Company
	AND sr.SalesRepCode = c.SalesRepCode
WHERE
	c.ZIP <> ''
	AND sr.EMailAddress = '{EmailAddress}'
	--AND c.Company = 'EPIC06'
ORDER BY
	c.Name asc