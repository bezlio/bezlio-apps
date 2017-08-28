# Invoice Inquiry Changelog
All notable changes to the Invoice Inquiry app will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## [Unreleased]

## [1.1] - 2017-08-28
### Added
- New setConfig parameter "autoLoad": With the loading of the page, if true, the bezl will run the query for the selected customer. If false, the bezl will require a manual search to run the query. Default is false.
- New setConfig parameter "autoLoadOnSelection": With the selection of a customer (with accounts view on the same panel), if true, the bezl will run the query for the selected customer. If false, the bezl will require a manual search to run the query. Default is true.
- New Prophet 21 SQL queries

### Changed
- Updated Visual GetAccounts query
- Improved GUI interface

### Fixed
- Incorrect query called on selected account

## [1.0] - 2017-06-22
### Added
- Added versioning
