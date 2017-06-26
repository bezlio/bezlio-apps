SELECT
	CUST_PRICE_EFFECT.CUSTOMER_ID AS CustID,
	CUSTOMER.NAME AS CustName,
	'' AS Company,
	CUST_PRICE_EFFECT.PART_ID AS PartNum,
	PART.DESCRIPTION As PartDescription,
	CUST_PRICE_EFFECT.EFFECTIVE_DATE AS StartDate,
	CUST_PRICE_EFFECT.DISCONTINUE_DATE As EndDate,
	CUST_PRICE_EFFECT.DEFAULT_UNIT_PRICE AS BasePrice,
	QuantityPricing.Quantity,
	QuantityPricing.PriceBreakUnitPrice
FROM CUST_PRICE_EFFECT with (nolock)
	INNER JOIN CUSTOMER with (nolock) ON CUST_PRICE_EFFECT.CUSTOMER_ID = CUSTOMER.ID
	INNER JOIN PART with (nolock) ON CUST_PRICE_EFFECT.PART_ID = PART.ID
Left Outer Join (
		Select 
			CUSTOMER_ID,
			PART_ID,
			Quantity,
			PriceBreakUnitPrice
		From CUST_PRICE_EFFECT with (nolock)
		Cross Apply (
			Select QTY_BREAK_1, UNIT_PRICE_1 Union
			Select QTY_BREAK_2, UNIT_PRICE_2 Union
			Select QTY_BREAK_3, UNIT_PRICE_3 Union
			Select QTY_BREAK_4, UNIT_PRICE_4 Union
			Select QTY_BREAK_5, UNIT_PRICE_5 Union
			Select QTY_BREAK_6, UNIT_PRICE_6 Union
			Select QTY_BREAK_7, UNIT_PRICE_7 Union
			Select QTY_BREAK_8, UNIT_PRICE_8 Union
			Select QTY_BREAK_9, UNIT_PRICE_9 Union
			Select QTY_BREAK_10, UNIT_PRICE_10
			) ColmsToRows (Quantity, PriceBreakUnitPrice)
		Where PriceBreakUnitPrice > 0
		) QuantityPricing 
			On CUST_PRICE_EFFECT.CUSTOMER_ID = QuantityPricing.CUSTOMER_ID
			And CUST_PRICE_EFFECT.PART_ID = QuantityPricing.PART_ID
--WHERE
--	AND CUST_PRICE_EFFECT.CUSTOMER_ID = '{CustID}' 