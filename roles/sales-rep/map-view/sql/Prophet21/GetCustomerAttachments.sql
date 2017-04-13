-- information about resource files used by the application (n/a?)
SELECT --TOP 100
	  fa.file_name AS FileName
	, fa.file_type AS Description
	, LOWER(RIGHT(fa.file_name, 4)) AS FileExt
FROM
	application_resource_file fa with(nolock)
ORDER BY
	fa.file_name