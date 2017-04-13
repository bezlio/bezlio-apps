define(["./customer.js"], function (customer) {

    var delay = 100;
    var nextAddress = 0;
    var tempTracker = 0;

    function GetInfoWindowContent (Title, Address, Contacts) {
        // Develop the HTML for the customer contacts
        var contactHtml = '<br><h4>Contacts</h4>';
        var contacts = $.parseXML(Contacts);
        var contactsXml = $(contacts);

        contactsXml.find('Contact').each(function(index){
            var cntName = $(this).find('ContactName').text();
            var cntEmail = $(this).find('EMailAddress').text();
            var title = $(this).find('ContactTitle').text();
            var phoneNum = $(this).find('PhoneNum').text();

            if (title) {
            contactHtml += '<b>' + title + '</b>';
            }

            if (cntName) {
            contactHtml += '<br>' + cntName;
            }

            if (phoneNum) {
            contactHtml += '<br>Phone: <a href=\"tel:' + phoneNum + '\">' + phoneNum + '</a>';
            }

            if (cntEmail) {
            contactHtml += '<br>Email: <a href=\"mailto:' + cntEmail + '\">' + cntEmail + '</a>';
            }

            contactHtml += '<br>';
        });

        var contentString = 
            '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h4 id="firstHeading" class="firstHeading">' + Title + '</h4>'+
                '<div id="bodyContent">'+
                    '<a href=\"http://maps.google.com/maps?q=' + encodeURI(Address) + '\" target=\"_blank\">' + Address + '</a>' +
                    ((contacts) ? contactHtml : '')
                '</div>'+
            '</div>';
        
        return contentString;
    }

     function theNext(bezl) {

            //do the last one, temp fix
            if(bezl.vars.custWithoutLocations.length == 1 && bezl.vars.geoLocsNeeded != bezl.vars.geoLocsDone)
            {
               try{
               if( bezl.vars.custWithoutLocations[0].data.Geocode_Location == "" ||  bezl.vars.custWithoutLocations[0].data.Geocode_Location == null) {
                setTimeout(function(){getAddress({ 
                                    streetAddress:  bezl.vars.custWithoutLocations[0].data.Address, 
                                    title:  bezl.vars.custWithoutLocations[0].data.Name, 
                                    custNum:  bezl.vars.custWithoutLocations[0].data.CustNum,
                                    shipToNum:  bezl.vars.custWithoutLocations[0].data.ShipToNum,
                                    data:  bezl.vars.custWithoutLocations[0].data 
                                }, theNext, bezl)}, delay);

                nextAddress++;
            } } catch(ex) {
                console.log(ex);
            }
            }

            //check to see if the nextAddress is less than needed qty
            if (nextAddress < bezl.vars.custWithoutLocations.length-1) {
                
            //if geoloc is empty, get it.
            if( bezl.vars.custWithoutLocations[nextAddress].data.Geocode_Location == '' ||  bezl.vars.custWithoutLocations[nextAddress].data.Geocode_Location == null) {
                
                setTimeout(function(){getAddress({ 
                                    streetAddress:  bezl.vars.custWithoutLocations[nextAddress].data.Address, 
                                    title:  bezl.vars.custWithoutLocations[nextAddress].data.Name, 
                                    custNum:  bezl.vars.custWithoutLocations[nextAddress].data.CustNum,
                                    shipToNum:  bezl.vars.custWithoutLocations[nextAddress].data.ShipToNum,
                                    data:  bezl.vars.custWithoutLocations[nextAddress].data 
                                }, theNext, bezl)}, delay);
            }
            //move onto next address
          nextAddress++;
        } else if(bezl.vars.geoLocsNeeded != bezl.vars.geoLocsDone ){ 
            // If no customers needed geocoding, do not run again.
            
                nextAddress = 0;
                // Run Query to update results. Acts as second check as well
                bezl.functions["getCustomers"]();
        } else {

                // We're done. 
                bezl.vars.geoTracker = 100;
                var progressBar = document.getElementById('geoProgress');
                // Forces update of DOM
                    setTimeout(function(){ 
                        progressBar.style.width= bezl.vars.geoTracker + '%';
                    }, 200);
                nextAddress = 0;
                bezl.vars.loading.customerList = false;
            }
      }

      // ====== Geocoding ======
      function getAddress(customerRecord, next, bezl) {
        bezl.vars.geocoder.geocode({address:`${customerRecord.streetAddress}`}, function (results,status)
          { 
            // If that was successful
            if (status == google.maps.GeocoderStatus.OK) {
              // Output the data
               if (results != null && results.length > 0) {

                var marker = new bezl.vars.client.Marker({
                position: results[0].geometry.location,
                map: bezl.vars.map,
                title: customerRecord.title,
                data: customerRecord.data,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
               }
             bezl.vars.markers[customerRecord.custNum] = marker;

              var g;
              if( results[0].geometry.location == '' || results[0].geometry.location == null ){
                  g = 'Unavailable';
              } else {
                g = JSON.stringify(results[0].geometry.location)
                .replace(/"/g, '')
                .replace('{', '')
                .replace('}', '');
              }

            bezl.vars.geoLocsDone++;
            tempTracker = Math.round((bezl.vars.geoLocsDone / bezl.vars.geoLocsNeeded)*100);

            if(tempTracker > bezl.vars.geoTracker) {
                
                var progressBar = document.getElementById('geoProgress');
                bezl.vars.geoTracker = tempTracker;
                // Forces update of DOM
                setTimeout(function(){ 
                    progressBar.style.width= bezl.vars.geoTracker + '%';
                }, 200);

            }

                updateGeo(bezl, customerRecord, g);

            }
            else {
              // if we were sending the requests to fast, try this one again and increase the delay
              if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                nextAddress--;

                if (delay > 5000){
                    delay = 100;
                } else{
                    delay++;
                }
              } else {
                console.log('Geocoding Error');
              }   
            }
            next(bezl);
          }
        );
      }

    function updateGeo(bezl, customerRecord, g) {
         // Update the database so we don't need to look this up next time
            bezl.dataService.add('SetGeocodeOnAddress_' + customerRecord.custNum,'brdb','sales-rep-queries','ExecuteNonQuery',
                                { "QueryName": "/Geocoder/SetGeocodeOnAddress",
                                    "Parameters": [
                                        { "Key": "Geocode_Location", "Value": g || '' },
                                        { "Key": "CustNum", "Value": customerRecord.custNum },
                                        { "Key": "CustID", "Value": customerRecord.data.CustID || '' }
                                    ] },0);  
    }

    function UpdateAddress(bezl) {
        
            bezl.vars.markers[nextAddress].setMap(null);
            
            var marker = new bezl.vars.client.Marker({
                position: bezl.vars.customers[nextAddress].Geocode_Location,
                map: bezl.vars.map,
                label: 'A',
                title: '',
                lat: bezl.vars.customers[nextAddress].Geocode_Location.geometry.location.lat(),
                lng: bezl.vars.customers[nextAddress].Geocode_Location.geometry.location.lng()
            });

            bezl.vars.markers[nextAddress] = marker;
            
    }
  
    return {
        getInfoWindowContent: GetInfoWindowContent,
        updateAddress: UpdateAddress,
        theNext: theNext
    }
});