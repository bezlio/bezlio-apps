SELECT
	emp.EmpID
	, emp.Name
	, CASE WHEN lh.LaborHedSeq IS NULL THEN 0 ELSE 1 END AS ClockedIn
	, lh.LaborHedSeq AS LaborID
	, a.CurrentActivity
	, a.PendingQty
	, sup.EMailAddress as SupervisorID
FROM
	EmpBasic emp with(nolock)

	LEFT OUTER JOIN EmpBasic sup with(nolock) ON
	sup.Company = emp.Company
	AND sup.EmpID = emp.SupervisorID
	
	LEFT OUTER JOIN LaborHed lh with(nolock) ON
	lh.Company = emp.Company
	AND lh.EmployeeNum = emp.EmpID
	AND lh.ActiveTrans = 1

	LEFT JOIN 
		(
			SELECT 
				CAST(ld.JobNum AS VARCHAR) + '.' + CAST(ld.AssemblySeq AS VARCHAR) + '.' + CAST(ld.OprSeq AS VARCHAR) AS CurrentActivity
				, op.RunQty - op.QtyCompleted AS PendingQty
				, ld.Company
				, ld.LaborHedSeq
			FROM 
				LaborDtl ld with(nolock) 

				LEFT OUTER JOIN JobOper op with(nolock) ON
				op.Company = ld.Company
				AND op.JobNum = ld.JobNum
				AND op.AssemblySeq = ld.AssemblySeq
				AND op.OprSeq = ld.OprSeq
			WHERE 
				ld.ActiveTrans = 1
		) AS a
	ON lh.Company = a.Company AND lh.LaborHedSeq = a.LaborHedSeq
WHERE
	emp.EmpStatus = 'A'
	--AND emp.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one