SELECT
	Erp.Customer.CustID AS CustID,
	Erp.Customer.Name AS CustName,
	Erp.CustomerPriceLst.Company AS Company,
	Erp.PriceLstParts.PartNum AS PartNum,
	Erp.Part.PartDescription As PartDescription,
	Erp.PriceLst.StartDate AS StartDate,
	Erp.PriceLst.EndDate As EndDate,
	Erp.PriceLstParts.BasePrice AS BasePrice,
	Erp.PLPartBrk.Quantity As Quantity,
	Erp.PLPartBrk.UnitPrice As PriceBreakUnitPrice
FROM Erp.CustomerPriceLst with (nolock)
	INNER JOIN Erp.PriceLst with (nolock) ON Erp.CustomerPriceLst.Company = Erp.PriceLst.Company AND Erp.CustomerPriceLst.ListCode = Erp.PriceLst.ListCode 
	INNER JOIN Erp.PriceLstParts with (nolock) ON Erp.PriceLst.Company = Erp.PriceLstParts.Company AND Erp.PriceLst.ListCode = Erp.PriceLstParts.ListCode
	INNER JOIN Erp.Customer with (nolock) ON CustomerPriceLst.Company = Customer.Company AND CustomerPriceLst.CustNum = Customer.CustNum
	INNER JOIN Erp.Part with (nolock) ON Erp.PriceLstParts.Company = Erp.Part.Company AND Erp.PriceLstParts.PartNum = Erp.Part.PartNum
	INNER JOIN Erp.PLPartBrk with (nolock) ON Erp.PriceLstParts.Company = Erp.PLPartBrk.Company AND Erp.PriceLstParts.ListCode = Erp.PLPartBrk.ListCode AND Erp.PriceLstParts.PartNum = Erp.PLPartBrk.PartNum AND Erp.PriceLstParts.UOMCode= Erp.PLPartBrk.UOMCode
WHERE
	Erp.CustomerPriceLst.Company =  CASE WHEN 'ALL' <> 'ALL' THEN 'ALL' ELSE Erp.CustomerPriceLst.Company END AND
	Erp.Customer.CustID = '{CustID}' 