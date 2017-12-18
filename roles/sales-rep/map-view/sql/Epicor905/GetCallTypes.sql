SELECT
    t.CallTypeCode AS CallType
    , t.CallTypeDesc
FROM
    CallType t
WHERE
	t.Inactive = 0
    --AND t.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
    