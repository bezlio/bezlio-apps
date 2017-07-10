SELECT
    s.SalesRepCode
FROM
    Erp.UserFile u with(nolock)

    INNER JOIN Erp.PerCon p with(nolock) ON
    p.DcdUserID = u.DcdUserID

    INNER JOIN Erp.SalesRep s with(nolock) ON
    s.Company = p.Company
    AND s.PerConID = p.PerConID
WHERE
	u.EMailAddress = '{EmailAddress}'