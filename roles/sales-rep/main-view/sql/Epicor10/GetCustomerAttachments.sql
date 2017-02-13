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
	--AND fa.Company = 'EPIC06'
ORDER BY
	f.XFileName