INSERT INTO Bezlio_Customer_Geocode_Location 
	SELECT TOP 1 
		  {CustNum}
		, company_id -- or 'YourCompanyID'  -- Set this to match the company ID below if there is one
		, '{Geocode_Location}' 
	FROM 
		p21_view_customer 
	WHERE
	p21_view_customer.customer_id = {CustNum}
		AND
	   (SELECT 
			COUNT(*) 
		FROM 
			Bezlio_Customer_Geocode_Location 
		WHERE customer_id = {CustNum}
			--AND company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
		) = 0

UPDATE Bezlio_Customer_Geocode_Location SET
	Geocode_Location = '{Geocode_Location}'
FROM 
	Bezlio_Customer_Geocode_Location 
WHERE 
	customer_id = {CustNum}