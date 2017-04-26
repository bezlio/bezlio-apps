
select c.ID
	, c.ID as CustNum
	, isnull(ct.FIRST_NAME,'') + ' ' + isnull(ct.LAST_NAME,'') as ContactName
	, ct.EMAIL as EMailAddress
	, c.CONTACT_POSITION as ContactTitle
	, c.CONTACT_PHONE as PhoneNum
from CUSTOMER c
	inner join CUST_CONTACT cc on c.ID = cc.CUSTOMER_ID
	inner join CONTACT ct on ct.ID = cc.CONTACT_ID
