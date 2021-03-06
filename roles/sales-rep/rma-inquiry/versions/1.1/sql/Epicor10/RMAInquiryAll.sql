Select
	Erp.RMAHead.Company As Company,
	Erp.RMAHead.RMANum As RMANum,
	Erp.RMAHead.RMADate As RMADate,
	Erp.Customer.Name As CustName,
	(Select   Erp.CustCnt.Name 
		FROM  Erp.CustCnt
		WHERE Erp.RMAHead.Company = CustCnt.Company AND Erp.RMAHead.ConNum = Erp.CustCnt.ConNum AND Erp.RMAHead.CustNum = Erp.CustCnt.CustNum AND
		Erp.CustCnt.ShipToNum = '') AS ContactName,
	--ALL LINE INFO
	Erp.RMADtl.RMALine As RMALine,
	Erp.RMADtl.OrderNum As OrderNum,
	Erp.RMADtl.OrderLine As OrderLine,
	Erp.RMADtl.OrderRelNum As OrderRelNum,
	Erp.RMADtl.PartNum As PartNum,
	Erp.RMADtl.RevisionNum As RevNum,
	Erp.RMADtl.LineDesc As LineDesc,
	Erp.RMADtl.ReturnQty As ReturnQty,
	Erp.Reason.Description As ReasonDesc
FROM Erp.RMAHead with (nolock)
	INNER JOIN Erp.Customer with(nolock) ON Erp.RMAHead.Company = Erp.Customer.Company AND Erp.RMAHead.CustNum = Erp.Customer.CustNum
	INNER JOIN Erp.SaleAuth with(nolock) ON Erp.Customer.Company = Erp.SaleAuth.Company AND Erp.Customer.SalesRepCode = Erp.SaleAuth.SalesRepCode
	INNER JOIN Erp.UserFile with (nolock) ON Erp.UserFile.DcdUserID = Erp.SaleAuth.DcdUserID AND Erp.UserFile.EMailAddress = '{EmailAddress}'
	LEFT OUTER JOIN Erp.RMADtl with(nolock) ON Erp.RMAHead.Company = Erp.RMADtl.Company AND Erp.RMAHead.RMANum = Erp.RMADtl.RMANum
	LEFT OUTER JOIN Erp.Reason with(nolock) ON Erp.RMADtl.Company = Erp.Reason.Company AND Erp.RMADtl.ReturnReasonCode = Erp.Reason.ReasonCode
WHERE 
	Erp.RMAHead.RMADate >= '{StartDate}' AND Erp.RMAHead.RMADate <= '{EndDate}' AND
	Erp.RMAHead.Company =  CASE WHEN 'ALL' <> 'ALL' THEN 'ALL' ELSE Erp.RMAHead.Company END 
	--AND Erp.Customer.CustID = '{CustID}'
ORDER BY 
	Erp.RMAHead.RMADate Desc