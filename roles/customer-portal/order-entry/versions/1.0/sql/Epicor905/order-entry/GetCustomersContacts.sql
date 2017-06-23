SELECT
	c.CustID AS ID
	, c.CustNum
	, ct.Name AS ContactName
	, ct.EMailAddress
	, ct.ContactTitle
	, ct.PhoneNum
FROM 
	CustCnt ct with(nolock)
	
	INNER JOIN Customer c with(nolock) ON
	c.Company = ct.Company
	AND c.CustNum = ct.CustNum
WHERE
	--ct.EMailAddress = 'administrator@wfo.epicor.com'
	ct.EMailAddress = '{EmailAddress}'
	AND c.Company = 'EPIC06'