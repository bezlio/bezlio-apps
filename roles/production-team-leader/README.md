# Production Team Leader Role

The Production Team Leader Role is currently comprised of the following:

1. Allow a production team leader to see all of their team members.
2. View team members clocked in status and current activity.
3. Clock in or clock out a single or multiple team members.
4. Start job or end activities for a single or multiple team members.

Currently this Role has been explicitly developed for the following platforms:

* Excel

    On this platform, all data is stored in an Excel spreadsheet stored within your network.  Customer attachments are set up to pull from a network drive where a subfolder exists per customer.

* Epicor 9.05

    On this platform everything is being pulled and written to Epicor.  CRM calls are logged to the customer record as are tasks.  Attachments are pulled from the attachments on the customer record.

* Planned

    Our planned platforms are Epicor 10 + (which is simply a minor tweak to the .SQL files from Epicor 9.05), Infor Visual, and Salesforce. In general it should just be a matter of taking the queries written on one of the existing platforms and modifying them as appropriate to any other ODBC compliant database. If you would like to use this Bezl with a system not listed please let us know and we can assist in getting it configured.

# Installation

It is our aim to make role-based Bezls as easy as possible to load up.  Here are the steps:

## IT Administrator

The IT administration will need to configure the plugin instances expected by this role only once (regardless of how many users will be connecting).  To do so, navigate to http://localhost:3600 on the server where you installed the Bezlio Remote Data Broker, go to Maintain, and select 'Plugin Instances'.  From here, you will want to use the 'Add Plugin Instance' button to configure each of the following:

    Name: salesrep-queries
    Description: Queries in support of the Sales Rep role
    Plugin: ODBC or SQLServer (depending on backend datasource)
    Method: ExecuteQuery
    Context: SalesRep
    Connection / DSN: SalesRep
    QueryName: <leave blank>
    Authorized Connections: (Check all connections for sales reps you authorize.)

* The value for Context here refers to where you will be placing the .SQL files and needs to be defined within your plugin .config file.  See https://github.com/bezlio/bezlio-plugins for documentation.
* The value for Connection / DSN refers to a connection defined within your associated plugin config file.  If this is using the ODBC plugin, you will also need to configure a 32-bit ODBC driver.    See https://github.com/bezlio/bezlio-plugins for documentation.

Also download all of the .SQL files from the appropriate subfolders and place them into the folder referred to by 'Context'.  The locations of these .SQL files are:
* [Main View](https://github.com/bezlio/bezlio-apps/tree/master/roles/production-team-leader/main-view/sql)

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

* The value for Connection refers to a connection defined within your associated plugin config file.  See https://github.com/bezlio/bezlio-plugins for documentation.

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

## End users
Once the IT administrator has configured the server, users simply install the Bezls for this role from the 'Shared Bezls' tab and select the ones with names starting with 'Sales Rep'.  Note that many other Bezls will exist on this list as the entirety of the recipe book it presented here, however users will only be able to see data in Bezls they select if the IT administrator has explicitly authorized it.  To select a shared Bezl:

1. On either an existing panel or a new panel, click the arrow next to the panel name and select 'Create View'.
2. Provide a name for the new view (i.e. 'Main').  Click OK.
3. When returned back to the panel, press the 'Select Bezl' button, then click the 'Shared Bezls' tab, and pick the desired Bezl.