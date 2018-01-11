SELECT TOP 100
	f.XFileName AS FileName
	, f.XFileDesc AS Description
	, LOWER(RIGHT(XFileName, 4)) AS FileExt
FROM
	Ice.XFileAttch fa with(nolock)
	
	INNER JOIN Ice.XFileRef f with(nolock) ON
	f.Company = fa.Company
	AND f.XFileRefNum = fa.XFileRefNum
WHERE
	fa.RelatedToSchemaName = 'Erp'
	AND fa.RelatedToFile = 'Customer'
	AND fa.Key1 = {CustNum}
	--AND fa.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	f.XFileName