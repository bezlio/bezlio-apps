Select
	p21_view_customer.customer_id_string As CustID,
	p21_view_customer.customer_name As CustName,
	p21_view_price_page.company_id As Company,
	p21_view_inv_mast.item_id As PartNum,
	p21_view_inv_mast.item_desc As PartDescription,
	p21_view_price_page.effective_date As StartDate,
	p21_view_price_page.expiration_date As EndDate,
	p21_view_price_page.price As BasePrice,
	Quantity,
	PriceBreakUnitPrice
From 
	p21_view_price_page with (nolock)
	Left Outer Join p21_view_customer with(nolock) On
	p21_view_price_page.customer_id = p21_view_customer.customer_id
	Left Outer Join p21_view_inv_mast with(nolock) On
	p21_view_price_page.inv_mast_uid = p21_view_inv_mast.inv_mast_uid
	Left Outer Join (
		Select 
			price_page_uid,
			Quantity,
			PriceBreakUnitPrice
		From p21_view_price_page with (nolock)
		Cross Apply (
			Select 0, calculation_value1 Union
			Select break1, calculation_value2 Union
			Select break2, calculation_value3 Union
			Select break3, calculation_value4 Union
			Select break4, calculation_value5 Union
			Select break5, calculation_value6 Union
			Select break6, calculation_value7 Union
			Select break7, calculation_value8 Union
			Select break8, calculation_value9 Union
			Select break9, calculation_value10 Union
			Select break10, calculation_value11 Union
			Select break11, calculation_value12 Union
			Select break12, calculation_value13 Union
			Select break13, calculation_value14 Union
			Select break14, calculation_value15
			) ColmsToRows (Quantity, PriceBreakUnitPrice)
		where PriceBreakUnitPrice > 0
		) QuantityPricing On
	p21_view_price_page.price_page_uid = QuantityPricing.price_page_uid
Where
p21_view_price_page.company_id =  CASE WHEN '{Company}' <> 'ALL' THEN '{Company}' ELSE p21_view_price_page.company_id END
AND	p21_view_customer.customer_id_string = '{CustID}'