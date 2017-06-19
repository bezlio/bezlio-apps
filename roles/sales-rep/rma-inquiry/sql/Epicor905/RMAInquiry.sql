Select
	RMAHead.Company As Company,
	RMAHead.RMANum As RMANum,
	RMAHead.RMADate As RMADate,
	Customer.Name As CustName,
	(Select   CustCnt.Name 
		FROM  CustCnt
		WHERE RMAHead.Company = CustCnt.Company AND RMAHead.ConNum = CustCnt.ConNum AND RMAHead.CustNum = CustCnt.CustNum AND
		CustCnt.ShipToNum = '') AS ContactName,
	--ALL LINE INFO
	RMADtl.RMALine As RMALine,
	RMADtl.OrderNum As OrderNum,
	RMADtl.OrderLine As OrderLine,
	RMADtl.OrderRelNum As OrderRelNum,
	RMADtl.PartNum As PartNum,
	RMADtl.RevisionNum As RevNum,
	RMADtl.LineDesc As LineDesc,
	RMADtl.ReturnQty As ReturnQty,
	Reason.Description As ReasonDesc
FROM RMAHead with (nolock)
	LEFT OUTER JOIN Customer with(nolock) ON RMAHead.Company = Customer.Company AND RMAHead.CustNum = Customer.CustNum
	LEFT OUTER JOIN RMADtl with(nolock) ON RMAHead.Company = RMADtl.Company AND RMAHead.RMANum = RMADtl.RMANum
	LEFT OUTER JOIN Reason with(nolock) ON RMADtl.Company = Reason.Company AND RMADtl.ReturnReasonCode = Reason.ReasonCode
WHERE 
	RMAHead.RMADate >= '{StartDate}' AND RMAHead.RMADate <= '{EndDate}' AND
	RMAHead.Company =  CASE WHEN 'ALL' <> 'ALL' THEN 'ALL' ELSE RMAHead.Company END AND
	Customer.CustID = '{CustID}'
ORDER BY 
	RMAHead.RMADate Desc