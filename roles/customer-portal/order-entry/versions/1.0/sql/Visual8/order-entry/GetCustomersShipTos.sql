SELECT 
	c.ID AS ID,
	c.ID AS CustNum,
	'' AS ShipToNum,
	c.NAME AS Name,
	c.ADDR_1 AS Address1,
	c.ADDR_2 AS Address2,
	c.ADDR_3 AS Address3,
	c.CITY AS City,
	c.STATE AS State,
	c.ZIPCODE AS Zip,
	'' AS PhoneNum
FROM
	CUSTOMER c WITH (NOLOCK)
UNION ALL
SELECT
	st.CUSTOMER_ID AS ID
	, st.CUSTOMER_ID AS CustNum
	, st.SHIPTO_ID AS ShipToNum
	, st.NAME AS Name
	, st.ADDR_1 AS Address1
	, st.ADDR_2 AS Address2
	, st.ADDR_3 AS Address3
	, st.CITY AS City
	, st.STATE AS State
	, st.ZIPCODE AS Zip
	, '' AS PhoneNum
FROM 
	CUST_ADDRESS st with(nolock)