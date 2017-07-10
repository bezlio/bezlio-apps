SELECT
    s.SalesRepCode
FROM
    UserFile u with(nolock)

    INNER JOIN PerCon p with(nolock) ON
    p.DcdUserID = u.DcdUserID

    INNER JOIN SalesRep s with(nolock) ON
    s.Company = p.Company
    AND s.PerConID = p.PerConID
WHERE
	u.EMailAddress = '{EmailAddress}'