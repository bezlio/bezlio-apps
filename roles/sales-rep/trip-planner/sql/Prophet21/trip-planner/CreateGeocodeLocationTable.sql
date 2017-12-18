CREATE TABLE [dbo].[Bezlio_Customer_Geocode_Location](
	[customer_id] [decimal](19, 0) NOT NULL,
	[company_id] [varchar](8) NOT NULL,
	[Geocode_Location] [varchar](50) NULL,
 CONSTRAINT [PK_Bezlio_Customer_Geocode_Location] PRIMARY KEY CLUSTERED 
(
	[company_id] ASC,
	[customer_id] ASC
))
Grant Select, Insert, Update on Bezlio_Customer_Geocode_Location to Public