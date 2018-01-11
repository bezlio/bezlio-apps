SELECT
      tt.category_id AS TaskType
    , tt.category_desc As TypeDescription
FROM
    p21_view_category tt with(nolock)
--WHERE
--    tt.? = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one (n/a?)