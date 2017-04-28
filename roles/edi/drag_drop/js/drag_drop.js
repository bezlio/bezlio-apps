define(function () {
    function DetermineBrowserSettings(bezl) {
        //determine if advanced settings can be used
        var isAdvancedUpload = function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }(); 

        //add advnaced upload to class
        var $form = $('.box');

        if (isAdvancedUpload) {
        $form.addClass('has-advanced-upload');
        } 
    }
    return {
        determineBrowserSettings: DetermineBrowserSettings
    }
});