SELECT 
	sv.CODE AS ShipViaCode 
	, sv.CODE as Description
FROM 
	SHIP_VIA sv WITH (NOLOCK)