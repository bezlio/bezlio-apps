# Sales Rep Role

The sales rep role is currently comprised of a single Bezl that does the following:

1. Allow a sales rep to see all of their assigned customers both in a grid and map view with searching.
2. Reorient the map center point to any address and the customer listing will be updated to reflect appropriate distances.
3. View and record CRM calls.
4. Maintain tasks assocated with customers.
5. Load files associated with the given customer, either from a network drive broken down by customer ID or as associated with the custoemr master record in the database.
6. Run custom inquiries against a customer.

Currently this Bezl has been explicitly developed for the following platforms:

* Excel

On this platform, all data is stored in an Excel spreadsheet stored within your network.  Customer attachments are set up to pull from a network drive where a subfolder exists per customer.

* Epicor 10 +

On this platform everything is being pulled and written to Epicor.  CRM calls are logged to the customer record as are tasks.  Attachments are pulled from the attachments on the customer record.

* Planned

Our planned platforms are Epicor 9.05 (which is simply a minor tweak to the .SQL files from Epicor 10), Infor Visual, and Salesforce.  If you would like to use this Bezl with a system not listed here please let us know and we can assist in getting it configured.  In general it should just be a matter of taking the queries written on one of the existing platforms and modifying them as appropriate to any other ODBC compliant database.

# Installation

It is our aim to make role-based Bezls as easy as possible to load up.  Here are the steps:

## IT Administrator

The IT administration will need to configure the plugin instances expected by this role only once (regardless of how many users will be connecting).  To do so, navigate to http://localhost:3600 on the server where you installed Bezlio Remote Data Broker, go to Maintain, and select 'Plugin Instances'.  From here, you will want to use the 'Add Plugin Instance' button to configure each of the following:

Name: salesrep-queries
Description: Queries in support of the Sales Rep role
Plugin: ODBC or SQLServer (dependiong on backend database)
Method: ExecuteQuery
Context: SalesRep
Connection / DSN: SalesRep
QueryName: <leave blank>
Authorized Connections: Check all connections for sales reps you authorize

* The value for Context here refers to where you will be placing the .SQL files and needs to be defined within your plugin .config file.  See https://github.com/bezlio/bezlio-plugins for documentation.
* The value for Connection / DSN refers to a conenction defined within your associated plugin config file.  If this is using the ODBC plugin, you will also need to configure a 32-bit ODBC driver.    See https://github.com/bezlio/bezlio-plugins for documentation.

Also download all of the .SQL files from the appropriate subfolders and place them into the folder referrered to by 'Context'.  The locations of these .SQL files are:
* https://github.com/bezlio/bezlio-recipes/tree/master/roles/sales-rep/main-view/sql

### If using the Epicor 10 integration also add these:
Name: salesrep-addNote
Description: Add CRM note to Epicor
Plugin: Epicor10
Method: ExecuteBOMethod
Connection: Epicor 10
Company: <Your Epicor Company ID>
BOName: CRMCall
BOMethodName: UpdateExt
Authorized Connections: Check all connections for sales reps you authorize

* The value for Connection refers to a conenction defined within your associated plugin config file.  See https://github.com/bezlio/bezlio-plugins for documentation.

Name: salesrep-updateTasks
Description: Update tasks in Epicor in support of sales rep role
Plugin: Epicor10
Method: ExecuteBOMethod
Connection: Epicor 10
Company: <Your Epicor Company ID>
BOName: Task
BOMethodName: UpdateExt
Authorized Connections: Check all connections for sales reps you authorize

### If you are using the Excel integration add this
Name: salesrep-customerFiles
Description: File system based files for a customer
Plugin: FileSystem
Method: GetFileList
Context: CustomerFiles
Authorized Connections: Check all connections for sales reps you authorize

* The value for Context here refers to a name pointing a directory containing customer files and needs to be defined within your plugin .config file.  See https://github.com/bezlio/bezlio-plugins for documentation.

## End users
Once the IT administrator has configured the server, users simply install the Bezls for this role from the 'Shared Bezls' tab and select the ones with names starting with 'Sales Rep'.  Note that many other Bezls will exist on this list as the entirety of the recipe book it presented here, however users will only be able to see data in Bezls they select if the IT administrator has explicitly authorized it.  To select a shared Bezl:

1. On either an existing panel or a new panel, click the arrow next to the panel name and select 'Create View'.
2. Provide a name for the new view (i.e. 'Main').  Click OK.
3. When returned back to the panel, press the 'Select Bezl' button, then click the 'Shared Bezls' tab, and pick the desired Bezl.