define(["./customer.js"], function (customer) {

    var delay = 100;
    var nextAddress = 0;

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
        if (nextAddress < bezl.vars.customers.length) {
          setTimeout(function(){getAddress({ 
                                streetAddress: bezl.vars.customers[nextAddress].data.Address, 
                                title: bezl.vars.customers[nextAddress].data.Name, 
                                custNum: bezl.vars.customers[nextAddress].data.CustNum,
                                shipToNum: bezl.vars.customers[nextAddress].data.ShipToNum,
                                data: bezl.vars.customers[nextAddress].data 
                            }, theNext, bezl)}, delay);
          nextAddress++;
        } else {
          // We're done. 
          console.log('Done');
         
        }
      }

      // ====== Geocoding ======
      function getAddress(search, next, bezl) {
        bezl.vars.geocoder.geocode({address:`${customerRecord.streetAddress}`}, function (results,status)
          { 
            // If that was successful
            if (status == google.maps.GeocoderStatus.OK) {
              // Output the data

              var g = JSON.stringify(results[0].geometry.location)
            .replace(/"/g, '')
            .replace('{', '')
            .replace('}', '');

            updateGeo(bezl, customerRecord, g);

                
            }
            // ====== Decode the error status ======
            else {
              // === if we were sending the requests to fast, try this one again and increase the delay
              if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                nextAddress--;
                delay++;
              } else {
                console.log('errror');
              }   
            }
            next();
          }
        );
      }



    function GeocodeAddress(bezl, customerRecord) {
        //if(bezl.vars.redo.length % 10 == 0) {
                        setTimeout(function(){}, 3000);
                        console.log("timeout");
                        console.log(bezl.vars.redo.length);
                   // }
        try 
        {
        bezl.vars.geocoder.geocode( {address:`${customerRecord.streetAddress}`}, function(results, status) {
            console.log(status);
            if(status == "OK"){  
            if (results != null && results.length > 0) {
            var marker = new bezl.vars.client.Marker({
                position: results[0].geometry.location,
                map: bezl.vars.map,
                title: customerRecord.title,
                data: customerRecord.data,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
                        
            // Add a click handler
            /*marker.addListener('click', function() {          
                customer.select(bezl, customerRecord.custNum);
            });

            bezl.vars.markers[customerRecord.custNum] = marker;*/

            var g = JSON.stringify(results[0].geometry.location)
            .replace(/"/g, '')
            .replace('{', '')
            .replace('}', '');

             updateGeo(bezl, customerRecord, g);
            } else if(status == "OVER_QUERY_LIMIT"){
                nextAddress--;
                delay++;
               // if(bezl.vars.redo.find(a => a.CustID == customerRecord.CustID)) {
               //     bezl.vars.redo.push(customerRecord);
               // }
                
            }   
            }
        status = null;
        });
        
        } catch(err) {
        console.log(err);
        }
    }

    function updateGeo(bezl, customerRecord, g) {
         // Update the database so we don't need to look this up next time
            bezl.dataService.add('SetGeocodeOnAddress_' + customerRecord.custNum,'brdb','sales-rep-queries','ExecuteNonQuery',
                                { "QueryName": "SetGeocodeOnAddress",
                                    "Parameters": [
                                        { "Key": "Geocode_Location", "Value": g || '' },
                                        { "Key": "CustNum", "Value": customerRecord.custNum },
                                        { "Key": "CustID", "Value": customerRecord.data.CustID || '' }
                                    ] },0);  
    }

    function UpdateAddress(bezl) {
        try 
        {
        bezl.vars.geocoder.geocode( {address:`${bezl.vars.currentAddress}`}, function(results, status) {
            if(status == "OK") {
            if (results != null && results.length > 0) {
            bezl.vars.markers[0].setMap(null);
            
            var marker = new bezl.vars.client.Marker({
                position: results[0].geometry.location,
                map: bezl.vars.map,
                label: 'A',
                title: 'You are here',
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
                        
            // Add a click handler
            marker.addListener('click', function() {          
                customer.select(bezl, parm.custNum);
            });

            bezl.vars.markers[0] = marker;
            bezl.vars.map.setCenter(marker.getPosition());
            }
        } else if(status == "OVER_QUERY_LIMIT") {

        }
        

        });
        
        } catch(err) {
        console.log(err);
        }
    }
  
    return {
        getInfoWindowContent: GetInfoWindowContent,
        geocodeAddress: GeocodeAddress,
        updateAddress: UpdateAddress,
        theNext: theNext
    }
});