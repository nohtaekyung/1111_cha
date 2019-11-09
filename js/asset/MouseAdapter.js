
var __mouseAdapter = {

    keyList : [],
    valueList : {},
    is : function( key ){
        return this.keyList.indexOf( key ) == -1 ? false : true;
    },
    add : function( key, value ){
        if( this.is( key ) == false ) {
            this.valueList[this.keyList.length] = value;
            this.keyList.push( key );
        }
    },
    get : function( key ){
        var idx = this.keyList.indexOf( key );
        return this.valueList[idx]
    }
};


mouseAdapter = function( target ){

    if( __mouseAdapter.is( target ) == false ){
        __mouseAdapter.add( target, new bm.MouseAdapter( target ) );
    }

    return __mouseAdapter.get( target );
}


bm.MouseAdapter = function( el ){

    if( !el ){
        throw new Error("Error [bm.MouseAdapter]:MouseAdapter() ==> 타겟이 없습니다. ");
        return;
    }
    this.target = el;
    this.fnList = {};

    this.__dragEnable = false;

    return this;
}

bm.MouseAdapter.prototype = {

    //--------------------------- down
    onDown : function(fn){
        var target = this.target;
        var context = this;

        function onDown(e){

            if( bm.isMobile )
            {
                e.clientX = e.targetTouches[0].clientX;
                e.clientY = e.targetTouches[0].clientY;
            }

            fn.call( context, e );
        }
        this.fnList.ondown = onDown;
        listener(target).add( bm.isMobile ? "touchstart" : "mousedown" , onDown );

        return context;
    }

    ,offDown : function(){
        if( this.fnList.ondown ){
            listener(this.target).remove( bm.isMobile ? "touchstart" : "mousedown", this.fnList.ondown );
            delete this.fnList.ondown;
        }
    }


    //--------------------------- up
    ,onUp : function(fn){
        var target = this.target;
        var context = this;

        function onUp(e){
            fn.call( context, e );
        }
        this.fnList.onup = onUp;
        listener(target).add( bm.isMobile ? "touchend" : "mouseup" , onUp );

        return context;
    }

    ,offUp : function(){
        if( this.fnList.onup ){
            listener(this.target).remove( bm.isMobile ? "touchend" : "mouseup" , this.fnList.onup );
            delete this.fnList.onup;
        }
    }


    //----------------------------- drag

    ,__dragStart : function( fn ){

        var target = this.target;
        this.__dragEnable = true;

        function onDown(e){
            if( bm.isMobile )
            {
                e.clientX = e.targetTouches[0].clientX;
                e.clientY = e.targetTouches[0].clientY;
            }

            fn( e );
        }
        this.fnList.drag = onDown;
        listener(target).add( bm.isMobile ? "touchstart" : "mousedown" , onDown );
    }
    ,onDrag : function(onDraggingFn, onDragUpFn, onDragStartFn){
        var context = this;
        var target = this.target;

        var start = bm.isMobile ? "touchstart" : "mousedown";
        var move = bm.isMobile ? "touchmove" : "mousemove";
        var end = bm.isMobile ? "touchend" : "mouseup";

        this.__dragStart(function(e){

            if( onDragStartFn ) onDragStartFn.call( context, e );

            function onMove(e){
                ( e.preventDefault) ? e.preventDefault() : ( e.returnValue = false );

                if( context.__dragEnable == false )
                {
                    unbind();
                    return;
                }

                if( bm.isMobile )
                {
                    e.clientX = e.targetTouches[0].clientX;
                    e.clientY = e.targetTouches[0].clientY;
                }

                onDraggingFn.call( context, e );
            }

            function unbind( e ){
                onDragUpFn && onDragUpFn.call( context, e );

                listener(document.body).remove( move, onMove );
                listener(document.body).remove( end, unbind );
                listener(window).remove( end, unbind );
//                if( !bm.isMobile ) listener(window).remove( "mouseout" , unbind );
            }

            listener(document.body).add( move, onMove );
            listener(document.body).add( end, unbind );// IE
            listener(window).add( end, unbind );// netscape
//            if( !bm.isMobile ) listener(window).add( "mouseout" , unbind );
        });

        return context;
    }

    ,offDrag : function(){
        this.__dragEnable = false;
        if( this.fnList.drag ){
            listener(this.target).remove( bm.isMobile ? "touchstart" : "mousedown", this.fnList.drag );
            delete this.fnList.drag;
        }
    }



    //--------------------------- wheel
    ,onWheel : function(fn){
        var target = this.target;
        var context = this;

        if( bm.isMobile ) return;

        function onWheel(e){
            var evt=window.event || e //equalize event object
            var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta

            e.delta = (delta<0)?-1:1;
            fn.call( context, e );
        }
        this.fnList.onwheel = onWheel;

        var type = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF3.x

        if( window["addEventListener"] ) target.addEventListener(type, onWheel );
        else target.attachEvent("on"+type, onWheel );

        return context;
    }

    ,offWheel : function(){
        if( bm.isMobile ) return;

        if( this.fnList.onwheel ){
            var type = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF3.x

            if( window["addEventListener"] ) this.target.removeEventListener(type, this.fnList.onwheel );
            else this.target.detachEvent("on"+type, this.fnList.onwheel );

            delete this.fnList.onwheel;
        }
    }

}