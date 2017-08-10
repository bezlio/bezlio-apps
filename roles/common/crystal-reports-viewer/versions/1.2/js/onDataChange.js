define(["./report.js"], function (report) {
 
    function OnDataChange (bezl) {
        if (bezl.data.ReportListing) {
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Report) { 
            var pdfData = atob(bezl.data.Report);

            require.config({paths: {'//mozilla.github.io/pdf.js/build/pdf': 'pdf'}});
            require(['pdfjs-dist/build/pdf'], function(pdf) {

                pdf.PDFJS.disableWorker = true;
                console.log('PDFJS Module: ' + pdf + '<br>');
                console.log('PDFJS Global: ' + window.PDFJS);

                // Using DocumentInitParameters object to load binary data.
                var loadingTask = pdf.PDFJS.getDocument({data: pdfData});
                loadingTask.promise.then(function(pdf) {
                    console.log('PDF loaded');
                    
                    // Fetch the first page
                    var pageNumber = 1;
                    pdf.getPage(pageNumber).then(function(page) {
                        console.log('Page loaded');
                        
                        var scale = 1.5;
                        var viewport = page.getViewport(scale);

                        // Prepare canvas using PDF page dimensions
                        var canvas = document.getElementById('viewer');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.then(function () {
                        console.log('Page rendered');
                        });
                    });
                }, function (reason) {
                    // PDF loading error
                    console.error(reason);
                });
                
            });

            /*var bytesLength = byteCharacters.length;
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
            }*/

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

            var mimeType = "application/octet-stream"; // Sane default
            require([bezl.vars.config.baseLibraryUrl + 'mimeTypes.js'], function(mime) {
                mimeType = mime.getMimeTypeFromExtension(bezl.vars.saveAsFileExtension);
            });
            var file = new Blob(byteArrays, {type: mimeType});
            saveAs(file, bezl.vars.selectedReport.BaseName + bezl.vars.saveAsFileExtension);

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
