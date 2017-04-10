-- (n/a?)
-- SELECT TOP 100
-- 	f.XFileName AS FileName
-- 	, f.XFileDesc AS Description
-- 	, LOWER(RIGHT(XFileName, 4)) AS FileExt
-- 	, cust.CustID AS ID
-- FROM
-- 	Ice.XFileAttch fa with(nolock)
	
-- 	INNER JOIN Ice.XFileRef f with(nolock) ON
-- 	f.Company = fa.Company
-- 	AND f.XFileRefNum = fa.XFileRefNum
	
-- 	INNER JOIN Erp.Customer cust with(nolock) ON
-- 	cust.Company = fa.Company
-- 	AND cust.CustNum = fa.Key1
	
-- 	LEFT OUTER JOIN Erp.SalesRep sr with(nolock) ON
-- 	sr.Company = cust.Company
-- 	AND sr.SalesRepCode = cust.SalesRepCode
-- WHERE
-- 	fa.RelatedToSchemaName = 'Erp'
-- 	AND fa.RelatedToFile = 'Customer'
-- 	--AND fa.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
-- 	AND sr.EmailAddress = '{EmailAddress}'
-- ORDER BY
-- 	f.XFileName