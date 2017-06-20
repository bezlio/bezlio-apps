# Month To Date Sales: Current Year Versus Prior

This query will return the month to date invoiced sales for the current year versus the same period last year by territory.

## Functionality Notes

- This does not filter off credit memos so those should successfully deduct from the sales totals.  Note that if a credit memo occurred in a different month than the initial invoice this could result in unbalanced results.
- This query does take into consideration the current day of the month to ensure a fair comparison versus last year.