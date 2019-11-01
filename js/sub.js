
function mousewheelEventControl(){
    if( checkMobileSize() == false ){
        var os, ua = navigator.userAgent;
        if (!ua.match(/Mac|PPC/)) {
            $(window).on("mousewheel DOMMouseScroll", onMouseWheelScroll );
        }
    }else{
        $(window).off("mousewheel DOMMouseScroll" );
    }
}

function onMouseWheelScroll( e ){
    var e = e.originalEvent;

    if( !window.scrollTopTarget ) window.scrollTopTarget = $(window).scrollTop();
    if( !window.currentScrollValue ) window.currentScrollValue = $(window).scrollTop();
    else{
        window.currentScrollValue = $(window).scrollTop();
    }

    e.preventDefault();

    var delta = 0;
    if( e.detail ){
        delta = e.detail * -40;
    }else{
        delta = e.wheelDelta;
    }

    if(delta > 0 ){
        if($(window).scrollTop() > 0){
            window.scrollTopTarget -= 100;
            if( window.scrollTopTarget <= 0 ) window.scrollTopTarget = 0;
        }
    }else{
        window.scrollTopTarget += 100;

        var body = document.body, html = document.documentElement;

        var windowHeight = Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight );
        windowHeight = windowHeight - $(window).height();
        if( window.scrollTopTarget > windowHeight ) window.scrollTopTarget = windowHeight;
    }

    TweenMax.killTweensOf( window );
    TweenMax.to( window, 0.5, {currentScrollValue:window.scrollTopTarget, ease : Cubic.easeOut, onUpdate:function(){
        window.scrollTo( $(window).scrollLeft(), window.currentScrollValue );
    }, onComplete : function(){

    }
    });
}

$(window).on("resize", function(){
    //mousewheelEventControl();
})

// init
mousewheelEventControl();