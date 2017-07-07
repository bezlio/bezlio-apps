define(["./report.js"], function (report) {
 
    function OnDataChange (bezl) {
        if (bezl.data.ReportListing) {
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Report) { 
            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.Report);
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

            var file = new Blob(byteArrays, {type: 'application/pdf'});

            if (screen.width <= 480) {
                report.back(bezl);
                saveAs(file);
            } else {
                var fileURL = URL.createObjectURL(file);
                var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
                viewer.src = fileURL;
            }

            bezl.vars.reportLoading = false;

            // Clean up data subscription as we no longer need it
            bezl.dataService.remove('Report');
            bezl.data.Report = null;
        }

        if (bezl.data.SaveReport) {
            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.SaveReport);
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

            var file = new Blob(byteArrays, {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);

            //window.open(fileURL);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = fileURL;
            a.download = bezl.vars.selectedReport.BaseName;
            a.click();
            window.URL.revokeObjectURL(fileURL);

            bezl.vars.reportLoading = false;

            // Clean up data subscription as we no longer need it
            bezl.dataService.remove('SaveReport');
            bezl.data.SaveReport = null;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
