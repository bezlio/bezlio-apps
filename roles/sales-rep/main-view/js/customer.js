define(["./map.js"], function (map) {
 
    function Select (bezl, custNum) {
        if (bezl.vars.markers[custNum]) {
        // Locate this customer and navigate to them on the map
        bezl.vars.infoWindow.setContent(map.getInfoWindowContent(bezl.vars.markers[custNum].title,
                                                                    bezl.vars.markers[custNum].data.Address,
                                                                    bezl.vars.markers[custNum].data.Contacts));

        bezl.vars.selectedCustomer = bezl.vars.markers[custNum].data;
        bezl.vars.selectedCustomer.LastContact = (bezl.vars.selectedCustomer.LastContact || 'T').split('T')[0];
        bezl.vars.infoWindow.open(bezl.vars.map, bezl.vars.markers[custNum]);

        $('html, body').animate({
                scrollTop: $("#map").offset().top
            }, 2000);
        } else {
        // If there is not a marker for the given address, geocode it now
        for (var i = 0; i < bezl.vars.customers.length; i++) {
            if (bezl.vars.customers[i].custNum == custNum) {
                map.geocodeAddress(bezl, bezl.vars.customers[i]); 
                break;
            }
        };
        }

        // Load the customers CRM call history
        RunQuery(bezl, 'CRMCallHistory');

        // Load the customers attachments
        RunQuery(bezl, 'Attachments');

        // Load the open tasks
        RunQuery(bezl, 'OpenTasks');
    }

    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "CustList":
                // Pull in the customer list for the logged in user
                bezl.dataService.add('CustList','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetCustomersWithAddress",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "CRMCallHistory":
                // Load the customers CRM call history
                bezl.dataService.add('CRMCallHistory','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetCRMCallHistory",
                    "Parameters": [
                        { "Key": "CustNum", "Value": bezl.vars.selectedCustomer.CustNum },
                        { "Key": "CustID", "Value": bezl.vars.selectedCustomer.CustID },  
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                bezl.vars.loading.crmHistory = true;
                break;
            case "OpenTasks":
                bezl.dataService.add('OpenTasks','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetOpenTasks",
                    "Parameters": [
                        { "Key": "CustNum", "Value": bezl.vars.selectedCustomer.CustNum },
                        { "Key": "CustID", "Value": bezl.vars.selectedCustomer.CustID },  
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                bezl.vars.loading.openTasks = true;
                break;
            case "Attachments":
                switch (bezl.vars.config.CRMPlatform) {
                    case "Epicor10":
                        bezl.dataService.add('Attachments','brdb','sales-rep-queries','ExecuteQuery', { 
                            "QueryName": "GetCustomerAttachments",
                            "Parameters": [
                                { "Key": "CustNum", "Value": bezl.vars.selectedCustomer.CustNum },
                                { "Key": "CustID", "Value": bezl.vars.selectedCustomer.CustID },  
                                { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                            ] },0);
                        break;
                    case "Excel":
                        bezl.dataService.add('Attachments','brdb','sales-rep-customerFiles','GetFileList', { },0);
                        break;
                    default:
                        break;
                }

                bezl.vars.loading.attachments = true;
                break;
            default:
                // Otherwise, assume this was a custom inquiry
                bezl.dataService.add('Inquiry','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": queryName,
                    "Parameters": [
                        { "Key": "CustNum", "Value": bezl.vars.selectedCustomer.CustNum },
                        { "Key": "CustID", "Value": bezl.vars.selectedCustomer.CustID }
                    ]
                },0);
                bezl.vars.loading.inquiry = true;

                // Push details about the selected inquiry into the selectedInquiry variable
                for (var i = 0; i < bezl.vars.config.CustomerInquiries.length; i++) {
                    if (bezl.vars.config.CustomerInquiries[i].QueryName == queryName) {
                        bezl.vars.selectedInquiry = bezl.vars.config.CustomerInquiries[i];
                    }
                };

                break;
        }
    }

    function ViewFile (bezl, file) {
        bezl.vars.attachmentFileName = file.FileName;
        bezl.vars.loading.attachment[file.FileName] = true;

        switch(file.FileExt) {
            case ".doc": bezl.vars.attachmentFileType = "application/msword"; break;
            case ".dot": bezl.vars.attachmentFileType = "application/msword"; break;
            case ".onetoc": bezl.vars.attachmentFileType = "application/onenote"; break;
            case ".onetoc2": bezl.vars.attachmentFileType = "application/onenote"; break;
            case ".onetmp": bezl.vars.attachmentFileType = "application/onenote"; break;
            case ".onepkg": bezl.vars.attachmentFileType = "application/onenote"; break;
            case ".pdf": bezl.vars.attachmentFileType = "application/pdf"; break;
            case ".ai": bezl.vars.attachmentFileType = "application/postscript"; break;
            case ".eps": bezl.vars.attachmentFileType = "application/postscript"; break;
            case ".ps": bezl.vars.attachmentFileType = "application/postscript"; break;
            case ".xls": bezl.vars.attachmentFileType = "application/vnd.ms-excel"; break;
            case ".xlm": bezl.vars.attachmentFileType = "application/vnd.ms-excel"; break;
            case ".xla": bezl.vars.attachmentFileType = "application/vnd.ms-excel"; break;
            case ".xlc": bezl.vars.attachmentFileType = "application/vnd.ms-excel"; break;
            case ".xlt": bezl.vars.attachmentFileType = "application/vnd.ms-excel"; break;
            case ".xlw": bezl.vars.attachmentFileType = "application/vnd.ms-excel"; break;
            case ".xlam": bezl.vars.attachmentFileType = "application/vnd.ms-excel.addin.macroenabled.12"; break;
            case ".xlsb": bezl.vars.attachmentFileType = "application/vnd.ms-excel.sheet.binary.macroenabled.12"; break;
            case ".xlsm": bezl.vars.attachmentFileType = "application/vnd.ms-excel.sheet.macroenabled.12"; break;
            case ".xltm": bezl.vars.attachmentFileType = "application/vnd.ms-excel.template.macroenabled.12"; break;
            case ".ppt": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint"; break;
            case ".pps": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint"; break;
            case ".pot": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint"; break;
            case ".ppam": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint.addin.macroenabled.12"; break;
            case ".pptm": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint.presentation.macroenabled.12"; break;
            case ".sldm": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint.slide.macroenabled.12"; break;
            case ".ppsm": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint.slideshow.macroenabled.12"; break;
            case ".potm": bezl.vars.attachmentFileType = "application/vnd.ms-powerpoint.template.macroenabled.12"; break;
            case ".mpp": bezl.vars.attachmentFileType = "application/vnd.ms-project"; break;
            case ".mpt": bezl.vars.attachmentFileType = "application/vnd.ms-project"; break;
            case ".docm": bezl.vars.attachmentFileType = "application/vnd.ms-word.document.macroenabled.12"; break;
            case ".dotm": bezl.vars.attachmentFileType = "application/vnd.ms-word.template.macroenabled.12"; break;
            case ".wps": bezl.vars.attachmentFileType = "application/vnd.ms-works"; break;
            case ".wks": bezl.vars.attachmentFileType = "application/vnd.ms-works"; break;
            case ".wcm": bezl.vars.attachmentFileType = "application/vnd.ms-works"; break;
            case ".wdb": bezl.vars.attachmentFileType = "application/vnd.ms-works"; break;
            case ".wpl": bezl.vars.attachmentFileType = "application/vnd.ms-wpl"; break;
            case ".xps": bezl.vars.attachmentFileType = "application/vnd.ms-xpsdocument"; break;
            case ".oxt": bezl.vars.attachmentFileType = "application/vnd.openofficeorg.extension"; break;
            case ".pptx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"; break;
            case ".sldx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.presentationml.slide"; break;
            case ".ppsx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.presentationml.slideshow"; break;
            case ".potx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.presentationml.template"; break;
            case ".xlsx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; break;
            case ".xltx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.template"; break;
            case ".docx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; break;
            case ".dotx": bezl.vars.attachmentFileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.template"; break;
            case ".bmp": bezl.vars.attachmentFileType = "image/bmp"; break;
            case ".gif": bezl.vars.attachmentFileType = "image/gif"; break;
            case ".jpeg": bezl.vars.attachmentFileType = "image/jpeg"; break;
            case ".jpg": bezl.vars.attachmentFileType = "image/jpeg"; break;
            case ".jpe": bezl.vars.attachmentFileType = "image/jpeg"; break;
            case ".pict": bezl.vars.attachmentFileType = "image/pict"; break;
            case ".pic": bezl.vars.attachmentFileType = "image/pict"; break;
            case ".pct": bezl.vars.attachmentFileType = "image/pict"; break;
            case ".png": bezl.vars.attachmentFileType = "image/png"; break;
            case ".svg": bezl.vars.attachmentFileType = "image/svg+xml"; break;
            case ".svgz": bezl.vars.attachmentFileType = "image/svg+xml"; break;
            case ".tiff": bezl.vars.attachmentFileType = "image/tiff"; break;
            case ".tif": bezl.vars.attachmentFileType = "image/tiff"; break;
            case ".psd": bezl.vars.attachmentFileType = "image/vnd.adobe.photoshop"; break;
            case ".dwg": bezl.vars.attachmentFileType = "image/vnd.dwg"; break;
            case ".dxf": bezl.vars.attachmentFileType = "image/vnd.dxf"; break;
            case ".csv": bezl.vars.attachmentFileType = "text/csv"; break;
            case ".html": bezl.vars.attachmentFileType = "text/html"; break;
            case ".htm": bezl.vars.attachmentFileType = "text/html"; break;
            case ".txt": bezl.vars.attachmentFileType = "text/plain"; break;
            case ".text": bezl.vars.attachmentFileType = "text/plain"; break;
            default:
                bezl.vars.attachmentFileType = "application/octet-stream";
        }

        bezl.dataService.add('fileview','brdb','FileSystem','GetFile', { "Context": "Default", "FileName": file.FileName},0);
    }
  
    return {
        select: Select,
        runQuery: RunQuery,
        viewFile: ViewFile
    }
});