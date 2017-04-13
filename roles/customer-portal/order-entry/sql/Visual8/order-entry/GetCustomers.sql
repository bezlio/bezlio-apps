SELECT
	c.ID AS ID
	, c.ID AS CustNum
	, c.Name AS Name
	, c.ADDR_1 AS Address1
	, c.ADDR_2 AS Address2
	, c.ADDR_3 AS Address3
	, c.City
	, c.State
	, c.ZIPCODE AS ZIP 
	, c.ADDR_1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIPCODE + ' ' AS Address
FROM
	CUSTOMER c with(nolock)
ORDER BY
	c.Name asc