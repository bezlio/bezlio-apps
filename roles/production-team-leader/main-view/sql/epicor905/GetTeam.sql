SELECT
	  emp.EmpID
	, emp.Name
	, CASE WHEN lh.LaborHedSeq IS NULL THEN 0 ELSE 1 END AS ClockedIn
	, lh.LaborHedSeq AS LaborID
	, CurrentActivity = (SELECT TOP 1 CAST(ld.JobNum AS VARCHAR) + '.' + CAST(ld.AssemblySeq AS VARCHAR) + '.' + CAST(ld.OprSeq AS VARCHAR) FROM LaborDtl ld WHERE ld.Company = lh.Company AND ld.LaborHedSeq = lh.LaborHedSeq AND ld.ActiveTrans = 1)
FROM
	EmpBasic emp with(nolock)
	
	INNER JOIN EmpBasic sup with(nolock) ON
	sup.EMailAddress = '{EmailAddress}'
	
	LEFT OUTER JOIN LaborHed lh with(nolock) ON
	lh.Company = emp.Company
	AND lh.EmployeeNum = emp.EmpID
	AND lh.ActiveTrans = 1
WHERE
	(emp.SupervisorID = sup.EmpID
	 Or emp.EMailAddress = sup.EMailAddress)
	And emp.Shift = sup.Shift -- Comment this line out if you want to see team members across shifts
	And emp.JCDept = sup.JCDept -- Comment this line out if you want to see team members across departments
	AND emp.EmpStatus = 'A'
	--AND emp.Company = 'EPIC06'