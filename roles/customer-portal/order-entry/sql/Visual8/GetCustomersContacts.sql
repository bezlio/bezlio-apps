SELECT
	ct.CUSTOMER_ID AS ID
	, ct.CUSTOMER_ID AS CustNum
	, ct.CONTACT_FIRST_NAME + ' ' + ct.CONTACT_LAST_NAME AS ContactName
	, ct.CONTACT_EMAIL AS EMailAddress
	, ct.CONTACT_POSITION AS ContactTitle
	, ct.CONTACT_PHONE AS PhoneNum
FROM 
	Erp.CustCnt ct with(nolock)