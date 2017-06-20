define([], function () {

    function GetInfoWindowContent(Title, Address, Contacts) {
        // Develop the HTML for the customer contacts
        var contactHtml = '<br><h4>Contacts</h4>';
        var contacts = $.parseXML(Contacts);
        var contactsXml = $(contacts);

        contactsXml.find('Contact').each(function (index) {
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
            '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h4 id="firstHeading" class="firstHeading">' + Title + '</h4>' +
            '<div id="bodyContent">' +
            '<a href=\"http://maps.google.com/maps?q=' + encodeURI(Address) + '\" target=\"_blank\">' + Address + '</a>' +
            ((contacts) ? contactHtml : '')
        '</div>' +
            '</div>';

        return contentString;
    }

    function CalculateDistances(bezl) {
        var calcDistance = function distance(lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1 / 180
            var radlat2 = Math.PI * lat2 / 180
            var theta = lon1 - lon2
            var radtheta = Math.PI * theta / 180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist)
            dist = dist * 180 / Math.PI
            dist = dist * 60 * 1.1515
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist
        };

        bezl.vars.markers = bezl.vars.markers.filter(mark => mark !== undefined);

        for (var i = 0; i < bezl.vars.customers.length; i++) {
            var custNum = bezl.vars.customers[i].key;
            if (bezl.vars.markers[custNum]) {
                bezl.vars.customers[i].distance = Math.round(calcDistance(bezl.vars.markers[0].lat,
                    bezl.vars.markers[0].lng,
                    bezl.vars.markers[custNum].lat,
                    bezl.vars.markers[custNum].lng,
                    'M'));
            }
        };
    }

    function GeocodeAddress(bezl, customerRecord) {
        try {
            bezl.vars.geocoder.geocode({ address: `${customerRecord.streetAddress}` }, function (results, status) {
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
                    marker.addListener('click', function () {
                        bezl.vars.customerFile.select(bezl, customerRecord.custNum);
                    });

                    bezl.vars.markers[customerRecord.custNum] = marker;

                    var g = JSON.stringify(results[0].geometry.location)
                        .replace(/"/g, '')
                        .replace('{', '')
                        .replace('}', '');

                    // Update the database so we don't need to look this up next time
                    bezl.dataService.add('SetGeocodeOnAddress_' + customerRecord.custNum, 'brdb', 'sales-rep-queries', 'ExecuteNonQuery',
                        {
                            "QueryName": "/map-view/SetGeocodeOnAddress",
                            "Parameters": [
                                { "Key": "Geocode_Location", "Value": g || '' },
                                { "Key": "CustNum", "Value": customerRecord.custNum },
                                { "Key": "CustID", "Value": customerRecord.data.CustID || '' }
                            ]
                        }, 0);
                }

                // Calculate distances
                CalculateDistances(bezl);

            });

        } catch (err) {
            console.log(err);
        }
    }

    function UpdateAddress(bezl) {
        try {
            bezl.vars.geocoder.geocode({ address: `${bezl.vars.currentAddress}` }, function (results, status) {
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
                    marker.addListener('click', function () {
                        bezl.vars.customerFile.select(bezl, parm.custNum);
                    });

                    bezl.vars.markers[0] = marker;
                    bezl.vars.map.setCenter(marker.getPosition());
                }

                // Calculate distances
                CalculateDistances(bezl);

            });

        } catch (err) {
            console.log(err);
        }
    }

    return {
        getInfoWindowContent: GetInfoWindowContent,
        calculateDistances: CalculateDistances,
        geocodeAddress: GeocodeAddress,
        updateAddress: UpdateAddress
    }
});