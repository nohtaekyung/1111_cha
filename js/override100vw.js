/**
 * Created by kej on 2019-04-04.
 */
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

$(document).ready(function(){

/*    var overrideWidth = getScrollbarWidth();
    console.log($(window).width());
    console.log(overrideWidth);*/
    $.get("../css/theme.page.main.css", function(data) {

        var pattern = /100vw/g;
        var css = data.replace(pattern, "100vw - " + getScrollbarWidth() + "px");
        $('body').append("<style>" + css + "</style>") ;

    });


});