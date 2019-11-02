/**
 * Created by iove95 on 2019-11-02.
 */
function setViewport() {
    if( window.screen.width < 750 ) {
        var ww = ( document.documentElement.clientWidth < window.screen.width ) ? $(window).width() : window.screen.width;
        var mw = 750;
        var ratio = ww / mw;
        $('meta[name="viewport"]').attr( 'content', 'width=' + mw  );
    } else {
        $('meta[name="viewport"]').attr( 'content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no' );
    }
}

app.ready(function(){
    setViewport();
})