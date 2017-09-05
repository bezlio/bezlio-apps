Select
	p21_view_oe_hdr.order_no As OrderNum,
	p21_view_oe_hdr.order_date As OrderDate,
	p21_view_oe_hdr.po_no As POnum,
	(Select Sum(sum_oe_line.extended_price)
	 From p21_view_oe_line sum_oe_line with (nolock)
	 Where sum_oe_line.order_no = p21_view_oe_hdr.order_no)
	As OrderAmt,
	Case p21_view_oe_hdr.completed When 'Y' Then 1 Else 0 End As OpenOrder,
	p21_view_oe_line.line_no As OrderLine,
	p21_view_oe_line.customer_part_number As PartNum,
	p21_view_oe_line.extended_desc As PartDesc,
	p21_view_oe_line.unit_price As UnitPrice,
	p21_view_oe_line.extended_price As ExtPrice,
	p21_view_oe_line.qty_ordered As OrderQty,
	(Select Sum(p21_view_oe_pick_ticket_detail.ship_quantity) 
	 From p21_view_oe_pick_ticket_detail with (nolock)
	 Inner Join p21_view_oe_pick_ticket with (nolock) On
	 	p21_view_oe_pick_ticket_detail.pick_ticket_no = p21_view_oe_pick_ticket.pick_ticket_no
	 Where p21_view_oe_pick_ticket.order_no = p21_view_oe_hdr.order_no
		And p21_view_oe_pick_ticket_detail.oe_line_no = p21_view_oe_line.line_no) 
	As ShippedQty
From 
	p21_view_oe_hdr with (nolock)

	Inner Join p21_view_oe_line with (nolock) On
	p21_view_oe_hdr.order_no = p21_view_oe_line.order_no
Where 
	p21_view_oe_hdr.order_date >= '{StartDate}' And p21_view_oe_hdr.order_date <= '{EndDate}' + ' 23:59:59' and
	(p21_view_oe_hdr.customer_id = '{CustID}')
	--And p21_view_oe_hdr.company_id = CASE WHEN '{Company}' <> 'ALL' THEN '{Company}' ELSE p21_view_oe_hdr.company_id END
Order By 
	p21_view_oe_hdr.order_date Desc