SELECT
	emp.EmpID
	, emp.Name
	, CASE WHEN lh.LaborHedSeq IS NULL THEN 0 ELSE 1 END AS ClockedIn
	, lh.LaborHedSeq AS LaborID
	, CurrentActivity = (SELECT TOP 1 ld.JobNum FROM LaborDtl ld WHERE ld.Company = lh.Company AND ld.LaborHedSeq = lh.LaborHedSeq AND ld.ActiveTrans = 1)

FROM
	EmpBasic emp with(nolock)
	
	LEFT OUTER JOIN LaborHed lh with(nolock) ON
	lh.Company = emp.Company
	AND lh.EmployeeNum = emp.EmpID
	AND lh.ActiveTrans = 1
WHERE
	emp.EmpStatus = 'A'
	AND emp.Company = 'EPIC06'