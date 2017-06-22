SELECT
	Customer.CustID AS CustID,
	Customer.Name AS CustName,
	CustomerPriceLst.Company AS Company,
	PriceLstParts.PartNum AS PartNum,
	Part.PartDescription As PartDescription,
	PriceLst.StartDate AS StartDate,
	PriceLst.EndDate As EndDate,
	PriceLstParts.BasePrice AS BasePrice,
	PLPartBrk.Quantity As Quantity,
	PLPartBrk.UnitPrice As PriceBreakUnitPrice
FROM CustomerPriceLst with (nolock)
	INNER JOIN PriceLst with (nolock) ON CustomerPriceLst.Company = PriceLst.Company AND CustomerPriceLst.ListCode = PriceLst.ListCode 
	INNER JOIN PriceLstParts with (nolock) ON PriceLst.Company = PriceLstParts.Company AND PriceLst.ListCode = PriceLstParts.ListCode
	INNER JOIN Customer with (nolock) ON CustomerPriceLst.Company = Customer.Company AND CustomerPriceLst.CustNum = Customer.CustNum
	INNER JOIN Part with (nolock) ON PriceLstParts.Company = Part.Company AND PriceLstParts.PartNum = Part.PartNum
	INNER JOIN PLPartBrk with (nolock) ON PriceLstParts.Company = PLPartBrk.Company AND PriceLstParts.ListCode = PLPartBrk.ListCode AND PriceLstParts.PartNum = PLPartBrk.PartNum AND PriceLstParts.UOMCode= PLPartBrk.UOMCode
WHERE
	CustomerPriceLst.Company =  CASE WHEN 'ALL' <> 'ALL' THEN 'ALL' ELSE CustomerPriceLst.Company END AND
	Customer.CustID = '{CustID}' 