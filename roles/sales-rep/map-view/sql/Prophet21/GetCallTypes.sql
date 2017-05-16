SELECT
      t.category_id AS CallType
    , t.category_desc AS CallTypeDesc
FROM
    p21_view_call_category t with(nolock)
--WHERE
	--t.row_status_flag = ? (n/a?)