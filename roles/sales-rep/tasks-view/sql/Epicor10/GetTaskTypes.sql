SELECT
    t.TypeCode AS TaskType
    , t.TypeDescription
FROM
    Erp.TaskType t
--WHERE
--    t.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one