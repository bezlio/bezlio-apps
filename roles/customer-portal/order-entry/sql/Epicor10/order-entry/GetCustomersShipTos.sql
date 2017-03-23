SELECT
	c.CustID AS ID
	, st.CustNum
	, st.ShipToNum AS ShipToNum
	, st.Name AS Name
	, st.Address1 AS Address1
	, st.Address2 AS Address2
	, st.Address3 AS Address3
	, st.City AS City
	, st.State AS State
	, st.Zip AS Zip
	, st.PhoneNum AS PhoneNum
FROM 
	Erp.ShipTo st with(nolock)
	
	INNER JOIN Erp.Customer c with(nolock) ON
	c.Company = st.Company
	AND c.CustNum = st.CustNum
	
	INNER JOIN Erp.CustCnt cnt with(nolock) ON
	cnt.Company = c.Company
	AND cnt.CustNum = c.CustNum
WHERE
	c.Company = 'EPIC06'
	AND cnt.EMailAddress = 'administrator@wfo.epicor.com'
	--AND sr.EMailAddress = '{EmailAddress}'