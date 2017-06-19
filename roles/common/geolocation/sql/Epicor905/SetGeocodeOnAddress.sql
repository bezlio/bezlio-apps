UPDATE Erp.Customer SET 
	ServRef5 = '{Geocode_Location}' 
WHERE 
	CustNum = {CustNum} 
	--AND Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one