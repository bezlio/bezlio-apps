SELECT 
	p.PartNum,
	p.ProdCode,
	plp.BasePrice AS PartBasePrice,
	plb.UOMCode AS PartUOM,
	plb.Quantity AS PartQty, 
	plb.UnitPrice AS PartPrice,
	plb.DiscountPercent AS PartDiscount,
	plg.BasePrice AS GroupBasePrice,
	pgb.UOMCode AS GroupUOM,
	pgb.Quantity AS GroupQty,
	pgb.UnitPrice AS GroupPrice,
	pgb.DiscountPercent AS GroupDiscount
FROM 
	Erp.Part p WITH (NOLOCK)

	INNER JOIN Erp.CustomerPriceLst cpl WITH (NOLOCK)
	ON p.Company = cpl.Company 

	INNER JOIN Erp.PriceLst pl WITH (NOLOCK) ON 
	cpl.Company = pl.Company 
	AND cpl.ListCode = pl.ListCode 

	LEFT OUTER JOIN Erp.PriceLstParts plp WITH (NOLOCK) ON 
	plp.Company = pl.Company AND
	plp.ListCode = pl.ListCode AND
	plp.PartNum = p.PartNum 

	LEFT OUTER JOIN Erp.PLPartBrk plb WITH (NOLOCK) ON
	plb.Company = plp.Company AND 
	plb.ListCode = plp.ListCode AND 
	plb.PartNum = plp.PartNum 

	LEFT OUTER JOIN Erp.PriceLstGroups plg WITH (NOLOCK) ON 
	plg.Company = pl.Company AND
	plg.ListCode = pl.ListCode AND 
	plg.ProdCode = p.ProdCode 

	LEFT OUTER JOIN Erp.PLGrupBrk pgb WITH (NOLOCK) ON
	pgb.Company = plg.Company AND
	pgb.ListCode = plg.ListCode AND 
	pgb.ProdCode = plg.ProdCode
WHERE
	p.WebPart = 1 AND 
	cpl.CustNum='{CustNum}' AND
	p.Company = 'EPIC06' AND 
	pl.StartDate <= GETDATE() AND (pl.EndDate is null OR pl.EndDate >= GETDATE())
ORDER BY p.PartNum asc;