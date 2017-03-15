SELECT 
	wp.PartNum AS PartNum, 
	wp.PartDescription AS PartDescription, 
	wp.IUM as UOM, 
	wp.UnitPrice as UnitPrice, 
	pw.OnHandQty as QOH, 
	0 AS QtyBreak1,
	0 AS QtyBreak2,
	0 AS QtyBreak3,
	0 AS QtyBreak4,
	0 AS QtyBreak5,
	0 AS DiscountPercent1,
	0 AS DiscountPercent2, 
	0 AS DiscountPercent3, 
	0 AS DiscountPercent4, 
	0 AS DiscountPercent5, 
	0 AS UnitPrice1, 
	0 AS UnitPrice2, 
	0 AS UnitPrice3, 
	0 AS UnitPrice4, 
	0 AS UnitPrice5
FROM 
	Erp.Part wp WITH (NOLOCK) 

	INNER JOIN Erp.PartPlant pp WITH (NOLOCK) ON
	pp.Company = wp.Company AND 
	pp.Plant = 'MfgSys' AND 
	pp.PartNum = wp.PartNum 

	INNER JOIN Erp.PartWhse pw WITH (NOLOCK) ON 
	pw.Company = wp.Company 
	AND pw.PartNum = wp.PartNum 
	AND pw.WarehouseCode = pp.PrimWhse 

WHERE
	wp.Company = 'EPIC06'
	AND wp.WebPart = 1 