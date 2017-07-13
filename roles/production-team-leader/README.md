# Production Team Leader Role

The Production Team Leader Role is currently comprised of the following:

1. Allow a production team leader to see all of their team members.
2. View team members clocked in status and current activity.
3. Clock in or clock out a single or multiple team members.
4. Start job or end activities for a single or multiple team members.

Currently this Role has been explicitly developed for the following platforms:

* Epicor 9.05

* Visual 7.1 and above

# Installation

It is our aim to make role-based Bezls as easy as possible to load up.  Here are the steps:

## IT Administrator

The IT administration will need to configure the plugin instances expected by this role only once (regardless of how many users will be connecting).  To do so, navigate to http://localhost:3600 on the server where you installed the Bezlio Remote Data Broker, go to Maintain, and select 'Plugin Instances'.  From here, you will want to use the 'Add Plugin Instance' button to configure each of the following:

    Name: production-team-leader-queries
    Description: Queries in support of the production team leader role
    Plugin: SQLServer
    Method: ExecuteQuery
    Context: production-team-leader
    Connection: Production
    QueryName: <leave blank>
    Authorized Connections: (Check all connections for sales reps you authorize.)

* The value for Context here refers to where you will be placing the .SQL files and needs to be defined within your plugin .config file.  See https://github.com/bezlio/bezlio-plugins for documentation.
* The value for Connection refers to a connection defined within your associated plugin config file.  See https://github.com/bezlio/bezlio-plugins for documentation.

Also download all of the .SQL files from the appropriate subfolders and place them into the folder referred to by 'Context'.  The locations of these .SQL files are:
* [Main View](https://github.com/bezlio/bezlio-apps/tree/master/roles/production-team-leader/main-view/sql)

Place downloaded .SQL files into your production-team-leader queries location.