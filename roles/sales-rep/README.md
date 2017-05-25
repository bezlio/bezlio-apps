# Sales Rep Role

The Sales Rrep Role is currently comprised of the following:

* Accounts View - Allow a sales rep to see all of their assigned customers account information.
* Map View - See all assigned customers location and distance from a sales rep current location.
* Trip Planner - Map View with the ability to add and navigate multiple locations.
  ##### The following work with the the selected account from the Accounts View:
* Attachments View - See associated doc, pdf and txt files.
* CRM Calls View - See and record CRM calls.
* Customer Price List - See customer pricing.
* Invoice Inquiry - See all or a date range of invoices.
* Order Inquiry - See all or a date range of orders.
* RMA Inquiry - See all or a date range of RMAs.
* Tasks View - See and add tasks.

Currently this Role has been explicitly developed for the following platforms:

* Excel

    On this platform, all data is stored in an Excel spreadsheet stored within your network.  Customer attachments are set up to pull from a network drive where a subfolder exists per customer.

* Epicor 10 + & 9.05

    On this platform everything is being pulled and written to Epicor.  CRM calls are logged to the customer record as are tasks.  Attachments are pulled from the attachments on the customer record.

* Infor Visual 7 & Visual 8

    This platform is currently being configured starting with the Accounts View and more.

* Prophet 21

    This platform is currently being configured starting with the Accounts View and more.

* Planned

    Our planned platform is Salesforce. In general it should just be a matter of taking the queries written on one of the existing platforms and modifying them as appropriate to any other ODBC compliant database. If you would like to use this Bezl with a system not listed please let us know and we can assist in getting it configured.

# Installation

It is our aim to make role-based Bezls as easy as possible to load up.  Here are the steps:

## IT Administrator

The IT administration will need to configure the plugin instances expected by this role only once (regardless of how many users will be connecting).  To do so, navigate to http://localhost:3600 on the server where you installed the Bezlio Remote Data Broker, go to Maintain, and select 'Plugin Instances'.  From here, you will want to use the 'Add Plugin Instance' button to configure each of the following:

    Name: salesrep-queries
    Description: Queries in support of the Sales Rep role
    Plugin: ODBC or SQLServer (dependiong on backend datasource)
    Method: ExecuteQuery
    Context: SalesRep
    Connection / DSN: SalesRep
    QueryName: (leave blank)
    Authorized Connections: (Check all connections for sales reps you authorize.)

* The value for Context here refers to where you will be placing the .SQL files and needs to be defined within your plugin .config file.  See https://github.com/bezlio/bezlio-plugins for documentation.
* The value for Connection / DSN refers to a conenction defined within your associated plugin config file.  If this is using the ODBC plugin, you will also need to configure a 32-bit ODBC driver.    See https://github.com/bezlio/bezlio-plugins for documentation.

Also download all of the .SQL files from the appropriate subfolders and place them into the folder referrered to by 'Context'.  The locations of these .SQL files are:
* [Accounts View](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/accounts-view/sql)
* [CRM Calls View](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/crm-calls-view/sql)
* [Customer Price List](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/customer-price-list/sql)
* [Invoice Inquiry](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/invoice-inquiry/sql)
* [Map View](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/map-view/sql)
* [Order Inquiry](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/order-inquiry/sql)
* [RMA Inquiry](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/rma-inquiry/sql)
* [Tasks View](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/tasks-view/sql)
* [Trip Planner](https://github.com/bezlio/bezlio-apps/tree/development/roles/sales-rep/trip-planner/sql)

### If using the Epicor 10 integration also add:
    Name: salesrep-addNote
    Description: Add CRM note to Epicor
    Plugin: Epicor10
    Method: ExecuteBOMethod
    Connection: Epicor 10
    Company: <Your Epicor Company ID>
    BOName: CRMCall
    BOMethodName: UpdateExt
    Authorized Connections: (Check all connections for sales reps you authorize.)

* The value for Connection refers to a conenction defined within your associated plugin config file.  See https://github.com/bezlio/bezlio-plugins for documentation.

### And also for Epicor 10 integration add:
    Name: salesrep-updateTasks
    Description: Update tasks in Epicor in support of sales rep role
    Plugin: Epicor10
    Method: ExecuteBOMethod
    Connection: Epicor 10
    Company: <Your Epicor Company ID>
    BOName: Task
    BOMethodName: UpdateExt
    Authorized Connections: (Check all connections for sales reps you authorize.)

### If using the Excel integration also add:
    Name: salesrep-customerFiles
    Description: File system based files for a customer
    Plugin: FileSystem
    Method: GetFileList
    Context: CustomerFiles
    Authorized Connections: (Check all connections for sales reps you authorize.)

* The value for Context here refers to a name pointing a directory containing customer files and needs to be defined within your plugin .config file.  See https://github.com/bezlio/bezlio-plugins for documentation.

## End Users
Once the IT administrator has configured the server, users simply install the Bezls for this role from the 'Shared Bezls' tab and select the ones with names starting with 'Sales Rep'.  Note that many other Bezls will exist on this list as the entirety of the recipe book it presented here, however users will only be able to see data in Bezls they select if the IT administrator has explicitly authorized it.  To select a shared Bezl:

1. On either an existing panel or a new panel, click the arrow next to the panel name and select 'Create View'.
2. Provide a name for the new view (i.e. 'Sales').  Click OK.
3. When returned back to the panel, press the 'Select Bezl' button, then click the 'Shared Bezls' tab, and pick the desired Bezl.