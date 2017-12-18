SELECT
	c.CustID AS ID
	, c.CustNum
	, c.Name
	, c.Address1
	, c.Address2
	, c.Address3
	, c.City
	, c.State
	, c.ZIP
	, c.Address1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIP + ' ' AS Address
	, c.TermsCode
FROM
	Customer c with(nolock)
INNER JOIN 
	CustCnt ct with(nolock) ON ct.Company = c.Company AND
	ct.CustNum = c.CustNum
WHERE	
	--ct.EMailAddress = 'administrator@wfo.epicor.com'
	ct.EMailAddress = '{EmailAddress}'
	AND c.Company = 'EPIC06'
ORDER BY
	c.Name asc