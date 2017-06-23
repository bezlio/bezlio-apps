SELECT 
	sv.ShipViaCode as ShipViaCode 
	, sv.Description as Description
FROM 
	ShipVia sv WITH (NOLOCK)
WHERE
	sv.Company = 'EPIC06';