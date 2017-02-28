define(function () {
 
    function OnDataChange (bezl) {
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