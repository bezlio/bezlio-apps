SELECT 
	wp.PartNum AS PartNum, 
	wp.PartDescription AS PartDescription, 
	wp.ProdCode AS ProdCode, 
	wp.IUM as UOM, 
	wp.UnitPrice as UnitPrice, 
	pw.OnHandQty as QOH
FROM 
	Part wp WITH (NOLOCK) 

	INNER JOIN PartPlant pp WITH (NOLOCK) ON
	pp.Company = wp.Company AND 
	pp.Plant = 'MfgSys' AND 
	pp.PartNum = wp.PartNum 

	INNER JOIN PartWhse pw WITH (NOLOCK) ON 
	pw.Company = wp.Company 
	AND pw.PartNum = wp.PartNum 
	AND pw.WarehouseCode = pp.PrimWhse 

WHERE
	wp.Company = 'EPIC06'
	AND wp.WebPart = 1 