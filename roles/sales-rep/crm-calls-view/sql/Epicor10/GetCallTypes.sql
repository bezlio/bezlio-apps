SELECT
    t.CallTypeCode AS CallType
    , t.CallTypeDesc
FROM
    Erp.CallType t
WHERE
	t.Inactive = 0
    AND t.Company = 'EPIC06'
    