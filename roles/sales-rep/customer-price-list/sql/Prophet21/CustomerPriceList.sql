Select
	p21_view_customer.customer_id_string As CustID,
	p21_view_customer.customer_name As CustName,
	p21_view_price_page.company_id As Company,
	p21_view_inv_mast.item_id As PartNum,
	p21_view_inv_mast.item_desc As PartDescription,
	p21_view_price_page.effective_date As StartDate,
	p21_view_price_page.expiration_date As EndDate,
	p21_view_price_page.price As BasePrice,
	-- PENDING \/
	Erp.PLPartBrk.Quantity As Quantity,
	Erp.PLPartBrk.UnitPrice As PriceBreakUnitPrice
From 
	p21_view_price_page with (nolock)
	Left Outer Join p21_view_customer with(nolock) On
	p21_view_price_page.customer_id = p21_view_customer.customer_id
	Left Outer Join p21_view_inv_mast with(nolock) On
	p21_view_price_page.inv_mast_uid = p21_view_inv_mast.inv_mast_uid
Where
	--? Erp.CustomerPriceLst.Company =  Case When 'ALL' <> 'ALL' Then 'ALL' Else p21_view_price_page.Company End And
	p21_view_customer.customer_id = '{CustID}'