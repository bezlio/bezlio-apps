UPDATE Bezlio_Customer_Geocode_Location SET 
	Geocode_Location = '{Geocode_Location}' 
WHERE 
	customer_id = {CustNum}  
	--AND Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one