# Order Inquiry Changelog
All notable changes to the Order Inquiry app will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## [Unreleased]

## [1.3] - 2017-10-13
### Added
- Display the sum of the total amount of all orders in the footer

## [1.2] - 2017-09-05
### Added
- Added additional customer information (ID, city, state) to the customer select drop down list
### Fixed
- Correctly search for "All Accounts"

## [1.1] - 2017-08-28
### Added
- New setConfig parameter "autoLoad": With the loading of the page, if true, the bezl will run the query for the selected customer. If false, the bezl will require a manual search to run the query. Default is false.
- New setConfig parameter "autoLoadOnSelection": With the selection of a customer (with accounts view on the same panel), if true, the bezl will run the query for the selected customer. If false, the bezl will require a manual search to run the query. Default is true.
- New Prophet 21 SQL queries

### Changed
- Improved GUI
- Updated Visual GetAccounts query

## [1.0] - 2017-06-22
### Added
- Added versioning
