define(function () {

    function NavigateLeft(bezl) {
        var currentIndex = 0;
        clearInterval(bezl.vars.timer);

        for (var i = 0; i < bezl.vars.announcements.length; i++) {
            if (bezl.vars.announcements[i].Selected) {
                currentIndex = i;
                bezl.vars.announcements[i].Selected = false;
            }
        };

        if (currentIndex > 0) {
            currentIndex -= 1;
        } else {
            currentIndex = bezl.vars.announcements.length - 1;
        }

        if (bezl.vars.announcements[currentIndex]) {  
            bezl.vars.announcements[currentIndex].Selected = true;
            var img = $(bezl.container.nativeElement).find('#viewer')[0];

            // Animate transition to the right off screen
            ($(bezl.container.nativeElement).find('#viewer')).removeClass().addClass('animated slideOutRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass();
            });
        
            if (bezl.vars.announcements[currentIndex].Loaded) {
                img.src = bezl.vars.announcements[currentIndex].Url; 
            
                // Animate transition to the left on screen
                ($(bezl.container.nativeElement).find('#viewer')).removeClass().addClass('animated slideInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass();
                });
            }
        }
    }

    function NavigateRight(bezl) {
        var currentIndex = 0;

        for (var i = 0; i < bezl.vars.announcements.length; i++) {
            if (bezl.vars.announcements[i].Selected) {
                currentIndex = i;
                bezl.vars.announcements[i].Selected = false;
            }
        };

        if (currentIndex < bezl.vars.announcements.length - 1) {
            currentIndex += 1;
        } else {
            currentIndex = 0;
        }

        if (bezl.vars.announcements[currentIndex]) {
            bezl.vars.announcements[currentIndex].Selected = true;
            var img = $(bezl.container.nativeElement).find('#viewer')[0];

            // Animate transition to the left off screen
            ($(bezl.container.nativeElement).find('#viewer')).removeClass().addClass('animated slideOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass();
            });
        
            if (bezl.vars.announcements[currentIndex].Loaded) {
                img.src = bezl.vars.announcements[currentIndex].Url; 
            
                // Animate transition to the right on screen
                ($(bezl.container.nativeElement).find('#viewer')).removeClass().addClass('animated slideInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass();
                });
            }
        }
    }

    function NavigateDirect(bezl) {
        clearInterval(bezl.vars.timer);

        for (var i = 0; i < bezl.vars.announcements.length; i++) {
            bezl.vars.announcements[i].Selected = false;
        };

        bezl.vars.announcements[parm].Selected = true;

        if (bezl.vars.announcements[currentIndex].Loaded) {
            var img = $(bezl.container.nativeElement).find('#viewer')[0];
            img.src = bezl.vars.announcements[parm].Url;
        }

    }

    return {
        navigateLeft: NavigateLeft,
        navigateRight: NavigateRight,
        navigateDirect: NavigateDirect
    }
});
