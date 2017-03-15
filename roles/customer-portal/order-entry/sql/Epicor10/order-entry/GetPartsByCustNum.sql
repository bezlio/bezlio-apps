SELECT 
	plp.PartNum AS PartNum, 
	p.PartDescription AS PartDescription, 
	p.IUM AS UOM, 
	plp.BasePrice AS UnitPrice, 
	pw.OnHandQty AS QOH, 
	plp.QtyBreak1 AS QtyBreak1,
	plp.QtyBreak2 AS QtyBreak2,
	plp.QtyBreak3 AS QtyBreak3,
	plp.QtyBreak4 AS QtyBreak4,
	plp.QtyBreak5 AS QtyBreak5,
	plp.DiscountPercent1 AS DiscountPercent1,
	plp.DiscountPercent2 AS DiscountPercent2, 
	plp.DiscountPercent3 AS DiscountPercent3, 
	plp.DiscountPercent4 AS DiscountPercent4, 
	plp.DiscountPercent5 AS DiscountPercent5, 
	plp.UnitPrice1 AS UnitPrice1, 
	plp.UnitPrice2 AS UnitPrice2, 
	plp.UnitPrice3 AS UnitPrice3, 
	plp.UnitPrice4 AS UnitPrice4, 
	plp.UnitPrice5 AS UnitPrice5
FROM 
	Erp.CustomerPriceLst cpl WITH (NOLOCK) 

	INNER JOIN Erp.PriceLst pl WITH (NOLOCK) ON 
	cpl.Company = pl.Company 
	AND cpl.ListCode = pl.ListCode 

	INNER JOIN Erp.PriceLstParts plp WITH (NOLOCK) ON 
	pl.Company = plp.Company 
	AND pl.ListCode = plp.ListCode 

	INNER JOIN Erp.Part p WITH (NOLOCK) ON 
	p.Company = plp.Company 
	AND p.PartNum = plp.PartNum 

	INNER JOIN Erp.PartPlant pp WITH (NOLOCK) ON
	pp.Company = p.Company AND 
	pp.Plant = 'MfgSys' AND 
	pp.PartNum = p.PartNum 

	INNER JOIN Erp.PartWhse pw WITH (NOLOCK) ON 
	pw.Company = p.Company 
	AND pw.PartNum = p.PartNum 
	AND pw.WarehouseCode = pp.PrimWhse 
WHERE 
	cpl.Company='EPIC06' AND 
	cpl.CustNum='{CustNum}' AND 
	pl.StartDate <= GETDATE() AND (pl.EndDate is null OR pl.EndDate >= GETDATE());