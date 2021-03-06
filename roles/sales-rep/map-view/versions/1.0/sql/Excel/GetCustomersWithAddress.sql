SELECT
	c.CustID
	, c.CustNum
	, c.Name
	, c.Address1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIP + ' ' AS Address
	, c.Geocode_Location
	, c.CustomerType
	, c.Territory
	, c.EstDate
	, c.Contacts
	, c.LastContact
	, c.YTDSales
	, c.LYTDSales
	, c.TotalSales
	, c.SalesRep
	, c.TermsDescription
	, c.NextTaskDue
FROM
	[Customers$] c
WHERE
	c.ZIP <> ''
ORDER BY
	c.Name asc