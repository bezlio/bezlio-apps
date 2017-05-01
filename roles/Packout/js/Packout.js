define(function () {
    function DetermineBrowserSettings(bezl) {
        //determine if advanced settings can be used
        var isAdvancedUpload = function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }(); 

        //add advnaced upload to class
        var $form = $('.box');

        if (isAdvancedUpload) 
        {
            $form.addClass('has-advanced-upload');
        }

        if (isAdvancedUpload) 
        {
            var droppedFiles = false;

            $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on('dragover dragenter', function() {
                $form.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function() {
                $form.removeClass('is-dragover');
            })
            .on('drop', function(e) {
                droppedFiles = e.originalEvent.dataTransfer.files;
            });

        } 
    }
    return {
        determineBrowserSettings: DetermineBrowserSettings
    }
});