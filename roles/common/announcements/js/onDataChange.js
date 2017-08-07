define(["./announcement.js"], function (announcement) {
 
    function OnDataChange (bezl) {

        // Detect when the announcements data subscription has come back.  It gives us a file listing
        // of an 'Announcements' directory from the FileSystem plugin.  For each file listed in this
        // result, download the file and add it to our announcements variable
        if (bezl.data.announcements && bezl.data.userGroups) {

            // Start off by determining what groups the logged in user belongs to
            bezl.vars.groups = [];
            bezl.data.userGroups.forEach(g => {
                if (g.UserID == bezl.env.currentUser) {
                    bezl.vars.groups.push(g.Group);
                }
            });

            // Loop through each announcement and add to our announcements array if this user should see it
            bezl.vars.announcements = [];
            bezl.data.announcements.forEach(announcement => {
                if (announcement.Active == 'X' && (announcement.Group == '' || bezl.vars.groups.indexOf(announcement.Group))) {
                    bezl.vars.announcements.push({ id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                            return v.toString(16);
                                                        }),
                                                   text: announcement.Text, 
                                                   image: announcement.Image, 
                                                   Url: {}, 
                                                   Obj: {}, 
                                                   Loaded: false, 
                                                   Loading: false, 
                                                   Selected: false });
                }
            });

            // Mark the first annoucement as Selected
            bezl.vars.announcements[0].Selected = true;

            // Lastly clear out bezl.data.announcements and bezl.data.userGroups so we don't repeat this process
            bezl.data.announcements = null;
            bezl.dataService.remove('announcements');
            bezl.data.userGroups = null;
            bezl.dataService.remove('userGroups');
        }

        // If we are done pulling in the announcements, fire off another process to download any images specified
        if (bezl.vars.announcements.length > 0) {
            bezl.vars.announcements.forEach(announcement => {
                // First check to see if the announcement has not been loading and is not loading - in that case we
                // need to fire off a call to download it
                if (announcement.image != null && !announcement.Loaded  && !announcement.Loading) {
                    announcement.Loading = true;
                    // Perform the BRDB call to actually download the file
                    bezl.dataService.add(announcement.id,'brdb','FileSystem','GetFile',
                                    { "Context": "Content"
                                        , "FileName": "img\\" + announcement.image
                                        , "Parameters": [] },0);
                // If it isn't loaded, we are loading, and we got it back
                } else if (announcement.image != '' && !announcement.Loaded  && announcement.Loading && bezl.data[announcement.id]) {
                    announcement.Loaded = true;
                    announcement.Loading = false;
                    
                    // Convert the byte array that came back on GetFile into a blob object we can use in HTML
                    var sliceSize = 1024;
                    var byteCharacters = atob(bezl.data[announcement.id]);
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

                    announcement.Obj = new Blob(byteArrays, {type: 'image/png'});  
                    announcement.Url = URL.createObjectURL(announcement.Obj);
                    
                    if (announcement.Selected) {
                        var img = $(bezl.container.nativeElement).find('#viewer')[0];
                        img.src = announcement.Url;  
                    }
                    
                    // Remove the data subscription for this file since we have it stored now
                    bezl.data[announcement.id] = null;
                    bezl.dataService.remove(announcement.id);
                }
            });
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
