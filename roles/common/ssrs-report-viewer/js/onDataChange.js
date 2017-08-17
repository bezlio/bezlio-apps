define(function () {

    function OnDataChange(bezl) {
        if (bezl.data.ReportListing) {
            console.log(bezl.data.ReportListing);
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Report) {
            console.log(bezl.data.Report);

            var data = btoa(bezl.data.Report);

            var sliceSize = 1024;
            var byteCharacters = atob(data);
            var bytesLength = byteCharacters.length;
            var sliceCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(sliceCount);

            for (var sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);
                var bytes = new Array(end - begin);

                for (var offset = begin, i = 0; offset < end; i++ , ++ofset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }

            var file = new Blob(byteArrays, { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
            viewer.src = fileURL;
            bezl.vars.reportLoading = false;
        }
    }

    return {
        onDataChange: OnDataChange
    }
});