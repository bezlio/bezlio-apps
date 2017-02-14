define(function(){

    function ColorPicker(bezl) {
            //sets the color of the selected event
bezl.vars['selectedEvent'].color = parm;

        //clear the current color pick
        $("#redCP").css("border-color", "white");
        $("#blueCP").css("border-color", "white");
        $("#greenCP").css("border-color", "white");
        $("#orangeCP").css("border-color", "white");
        $("#purpleCP").css("border-color", "white");

        //Put 'selection' border around selected color
        var eleID = "#" + parm + "CP";
        $(eleID).css("border-color", "cyan");

    }
    
    function GenerateUUID(bezl) {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        bezl.vars['UUID'] = uuid;
    }

    return {
        colorPicker: ColorPicker,
        generateUUID: GenerateUUID
    }
});