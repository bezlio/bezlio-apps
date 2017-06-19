


select sr.NAME, a.Last30d, b.Prior30d

from SALES_REP sr

	left outer join 
	(select SALESREP_ID, '$' + PARSENAME(convert(varchar(20),convert(money,sum(TOTAL_AMOUNT)), 1),2) as Last30d, sum(TOTAL_AMOUNT) as sort
	 from RECEIVABLE
	 where INVOICE_DATE >= getdate() - 30
	 group by SALESREP_ID
	 ) a on a.SALESREP_ID = sr.ID

	left outer join 
	(select SALESREP_ID, '$' + PARSENAME(convert(varchar(20),convert(money,sum(TOTAL_AMOUNT)), 1),2) as Prior30d
	 from RECEIVABLE
	 where INVOICE_DATE between getdate() - 60 and getdate() - 30
	 group by SALESREP_ID
	 ) b on b.SALESREP_ID = sr.ID

order by a.sort desc