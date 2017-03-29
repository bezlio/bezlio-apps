SELECT
      t.category_id AS CallType
    , t.category_desc
FROM
    p21_view_call_category t with(nolock)
--WHERE
	--t.row_status_flag = ? (n/a?)