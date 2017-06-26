SELECT 
	sv.ShipViaCode as ShipViaCode 
	, sv.Description as Description
FROM 
	Erp.ShipVia sv WITH (NOLOCK)
WHERE
	sv.Company = 'EPIC06';