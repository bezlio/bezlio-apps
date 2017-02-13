define(["./customer.js",
        "./map.js"], function (customer, map) {
 
    function OnDataChange (bezl) {
        // Populate the 'customers' array if we got CustomerList back
        if (bezl.data.CustList) {
            bezl.vars.customers = [];
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                bezl.vars.customers.push({ selected: false,
                                            key: bezl.data.CustList[i].CustNum,
                                            display: bezl.data.CustList[i].Name,
                                            lastContact: (bezl.data.CustList[i].LastContact || 'T').split('T')[0],
                                            nextTaskDue: (bezl.data.CustList[i].NextTaskDue || 'T').split('T')[0],
                                            distance: null,
                                            streetAddress: bezl.data.CustList[i].Address, 
                                            title: bezl.data.CustList[i].Name, 
                                            custNum: bezl.data.CustList[i].CustNum,
                                            shipToNum: bezl.data.CustList[i].ShipToNum,
                                            data: bezl.data.CustList[i]
                                            });
            }
        
            // Configure the typeahead controls for the customer and customer search.  For full documentation of
            // available settings here see http://www.runningcoder.org/jquerytypeahead/documentation/
            $('.js-typeahead-customers').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.customers; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        customer.select(bezl, item.key);
                    }
                }
            });
        
            $('.js-typeahead-customers2').typeahead({
                order: "asc",
                maxItem: 8,
                source: {
                    data: function() { return bezl.vars.customers; }
                },
                callback: {
                    onClick: function (node, a, item, event) {
                        customer.select(bezl, item);
                    }
                }
            });
        
            // Tell the jsGrid to load up
            $("#jsGrid170123").jsGrid("loadData");
            
            bezl.vars.loading.customerList = false;
            
            // Now loop through the results and plot each
            for (var i = 0; i < bezl.data.CustList.length; i++) {
                if (bezl.data.CustList[i].Address.length > 3) {
                
                    // Test to see whether we already saved the geocode.  If not, use the API to calculate it and save it
                    if (bezl.data.CustList[i].Geocode_Location == "" ||  bezl.data.CustList[i].Geocode_Location == null) {
                        map.geocodeAddress(
                            bezl, 
                            { 
                                streetAddress: bezl.data.CustList[i].Address, 
                                title: bezl.data.CustList[i].Name, 
                                custNum: bezl.data.CustList[i].CustNum,
                                shipToNum: bezl.data.CustList[i].ShipToNum,
                                data: bezl.data.CustList[i] 
                            }
                        );                   
                    } else {
                        var marker = new bezl.vars.client.Marker({
                            position: { lat: + parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[0].split(':')[1]), lng: parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[1].split(':')[1]) },
                            map: bezl.vars.map,
                            title: bezl.data.CustList[i].Name,
                            data: bezl.data.CustList[i],
                            lat: parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[0].split(':')[1]),
                            lng: parseFloat(bezl.data.CustList[i].Geocode_Location.split(',')[1].split(':')[1])
                        });

                        // Add a click handler
                        marker.addListener('click', function() {
                            customer.select(bezl, this.data.CustNum);
                        });
                        
                        bezl.vars.markers[bezl.data.CustList[i].CustNum] = marker;
                    }
                }
            };   
        
            // Calculate distances
            map.calculateDistances(bezl);

            // Clean up CustList data subscription as we no longer need it
            bezl.dataService.remove('CustList');
            bezl.data.CustList = null;
        }

        // Handle inquiry results coming back
        if (bezl.data.Inquiry) {
            bezl.vars.inquiryResults = [];
            for (var i = 0; i < bezl.data.Inquiry.length; i++) {
                bezl.vars.inquiryResults.push(bezl.data.Inquiry[i]);
            };
            
            // Configure the jsGrid
            $("#jsGridInquiry").jsGrid({
                width: "100%",
                height: "100%",
                heading: true,
                sorting: true,
                autoload: true, 	
                inserting: false,
                controller: {
                loadData: function() {
                    return bezl.vars.inquiryResults;
                }
                },
                fields: bezl.vars.selectedInquiry.Fields
            });
            
            // Tell the jsGrid to load up
            $("#jsGridInquiry").jsGrid("loadData");
            
            bezl.vars.loading.inquiry = false;
            
            // Clean up Inquiry data subscription as we no longer need it
            bezl.dataService.remove('Inquiry');
            bezl.data.Inquiry = null;
        }

        if (bezl.data.CRMCallHistory) {
            bezl.vars.loading.crmHistory = false;
        }

        if (bezl.data.InvoiceHistory) {
            bezl.vars.loading.invoiceHistory = false;
        }

        if (bezl.data.Attachments) {
            // Detect whether this is coming back as a file listing or database query.  If
            // it is a database query we do not need to do anything but if it is a file listing
            // we need to tweak the data presentation a bit
            if (!bezl.data.Attachments[0].FileName) {
                var a = [];
                for (var i = 0; i < bezl.data.Attachments.length; i++) {
                    if (bezl.data.Attachments[i].includes(bezl.vars.selectedCustomer.CustID)) {
                        a.push( { 
                            FileName: bezl.data.Attachments[i],
                            Description: bezl.data.Attachments[i],
                            FileExt: bezl.data.Attachments[i].substr(bezl.data.Attachments[i].length - 4)
                        } );
                    }
                }
                bezl.data.Attachments = a;
            }

            bezl.vars.loading.attachments = false;
        }

        if (bezl.data.OpenTasks) {
            for (var i = 0; i < bezl.data.OpenTasks.length; i++) {
                bezl.data.OpenTasks[i].StartDate = new Date(bezl.data.OpenTasks[i].StartDate).toISOString().substring(0, 10);
                bezl.data.OpenTasks[i].DueDate = new Date(bezl.data.OpenTasks[i].DueDate).toISOString().substring(0, 10);
            };
            
            bezl.vars.loading.openTasks = false;
        }


        if (bezl.data.AddCRMCall) {
            bezl.vars.loading.addHistory = false;
            bezl.vars.loading.crmHistory = true;
            bezl.vars.newNote = { "type": "", "details": "", "shortSummary": ""};

            // Clean up AddCRMCall data subscription as we no longer need it
            bezl.dataService.remove('AddCRMCall');
            bezl.data.AddCRMCall = null;

            customer.runQuery(bezl, 'CRMCallHistory');
            }

            if (bezl.data.UpdateTask) {
            bezl.vars.loading.updateTask = false;

            if (bezl.data.UpdateTask.BOUpdError) {
                if (JSON.stringify(bezl.data.UpdateTask.BOUpdError) != '[]') {
                    bezl.notificationService.showCriticalError(JSON.stringify(bezl.data.UpdateTask.BOUpdError));
                }
            }
        }

        if (bezl.data.fileview != null) {
            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.fileview);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);
            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);
                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            
            var file = new Blob(byteArrays, {type: bezl.vars.attachmentFileType});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            
            bezl.vars.loading.attachment[bezl.vars.attachmentFileName] = false;
            
            // Clean up data subscription as we no longer need it
            bezl.dataService.remove('fileview');
            bezl.data.fileview = null;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});