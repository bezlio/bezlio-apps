SELECT
	c.CustID
	, c.CustNum
	, c.Name
	, c.Address1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIP + ' ' AS Address
	, c.ServRef5 AS Geocode_Location
	, (CASE WHEN c.CustomerType = 'CUS' THEN 'Customer' ELSE (CASE WHEN c.CustomerType = 'SUS' THEN 'Suspect' ELSE (CASE WHEN c.CustomerType = 'PRO' THEN 'Prospect' ELSE c.CustomerType END) END) END) as CustomerType
	, t.TerritoryDesc AS Territory
	, c.EstDate
	, Contacts = '<Contacts>' +
				(select (
					select ContactName, EMailAddress, ContactTitle, PhoneNum from (
						SELECT 
							ct.Name AS ContactName
							, ct.EMailAddress
							, ct.ContactTitle
							, ct.PhoneNum
						FROM Erp.CustCnt ct
						WHERE ct.Company = c.Company
						AND ct.CustNum = c.CustNum
				) A
				FOR XML PATH('Contact')
				)) + '</Contacts>'
	, LastContact = (SELECT TOP 1 cl.LastDate FROM Erp.CRMCall cl with(nolock) WHERE cl.Company = c.Company and cl.CallCustNum = c.CustNum ORDER BY cl.LastDate DESC)
	, YTDSales = (SELECT SUM(ih.InvoiceAmt) FROM Erp.InvcHead ih with(nolock) WHERE ih.Company = c.Company and ih.CustNum = c.CustNum and ih.FiscalYear = YEAR(GETDATE()))
	, LYTDSales = (SELECT SUM(ih.InvoiceAmt) FROM Erp.InvcHead ih with(nolock) WHERE ih.Company = c.Company and ih.CustNum = c.CustNum and ih.FiscalYear = YEAR(GETDATE())-1)
	, TotalSales = (SELECT SUM(ih.InvoiceAmt) FROM Erp.InvcHead ih with(nolock) WHERE ih.Company = c.Company and ih.CustNum = c.CustNum)
	, sr.SalesRepCode AS SalesRep
	, tm.Description AS TermsDescription
	, NextTaskDue = (SELECT TOP 1 tsk.DueDate FROM Erp.Task tsk with(nolock) WHERE tsk.Company = c.Company and tsk.RelatedToFile = 'Customer' and tsk.Key1 = c.CustNum and tsk.Complete = 0 ORDER BY tsk.DueDate ASC)
FROM
	Erp.Customer c with(nolock)
	
	INNER JOIN Erp.SalesTer t with(nolock) ON
	t.Company = c.Company
	AND t.TerritoryID = c.TerritoryID
	
	INNER JOIN Erp.SalesRep sr with(nolock) ON
	sr.Company = c.Company
	AND sr.SalesRepCode = c.SalesRepCode

	LEFT OUTER JOIN Erp.Terms tm with(nolock) ON
	tm.Company = c.Company
	AND tm.TermsCode = c.TermsCode
WHERE
	c.ZIP <> ''
	AND sr.EMailAddress = '{EmailAddress}'
	--AND c.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	c.Name asc