ScrollContainer = function( content, width, height, left /* 0 */ , top /* 0 */, container /* null */ ){

    // default setting
    this.width = width;
    this.height = height;
    this.target = content;
    this.container = container || bm.html("<div></div>");
    this.isAutoUpdate = true;
    this.preventMouseDown = false;
    this.wheelInterval = 30;

    this.useVirtualSize = false;
    this.virtualSize = { width:0, height:0 };

    // scroll
    this.scrollHeight = 0; // 스크롤 버튼이 이동가능한 높이.
    this.scrollableContentHeight = 0; // 스크롤 가능한 높이.
    this.scrollBar = document.createElement('div');
    this.scrollBtn = document.createElement('div');
    this.scrollRect = document.createElement('div');

    bm.addChild(this.scrollBar, this.container );
//   this.container.appendChild( this.scrollBar );
    this.scrollBar.appendChild( this.scrollBtn );
    this.scrollBtn.appendChild( this.scrollRect );

    // update 시 이동 포지션 값.
    this.__posPrevLeft = left||0;
    this.__posPrevTop = top||0;
    this.__posLeft = left||0;
    this.__posTop = top||0;
    this.__isScrollBtnDragging = false;

    if( !container ){
        bm.setStyles( this.container, {
            width : this.width+"px",
            height : this.height+"px",
            clear : "both"
            //        left : (left||0)+"px",
            //        top : (top||0)+"px",
            //        background : "#000"
            //        ,overflow : "hidden"
            //        ,position:"absolute"
        });
    }

    content && bm.setStyles( content, { width : this.container.offsetWidth-8 +"px"});

    bm.setStyles( this.scrollBar, {
        float : 'right',
        width : "8px",
        height : this.height + "px"
//        position : "absolute",
//        top : 0,
//        marginLeft : content.offsetWidth + "px",
//        left : this.width-8 + "px",
//        background : "#eff"
//        zIndex : "99997"
    });

//    $(this.scrollBar).css('float','right');

    bm.setStyles( this.scrollBtn, {
        width : "6px",
        height : this.height+"px",
//        position : "absolute",
//        marginTop : this.scrollBar.offsetTop+"px",
//        padding : 0,
//        top : 0,
//        left : this.scrollBar.offsetLeft+1+"px",
//        left : "1px",
        background : "#1aa5d9"
//        zIndex : "99998"
    });

    bm.setStyles( this.scrollRect, {
        width : "35px",
        height : this.height+"px",
//        position : "absolute",
        marginLeft : -27 + "px"
//        zIndex : "99999"
    });

    // content, container stage setting
    if( !this.container.parentNode ){
        var parent = content.parentNode;
//        parent.insertBefore( this.container, this.target );
//        parent.removeChild( this.target );
//        this.container.appendChild( this.target );
    }




    // event handling
    var prevY = [];
    var powDepth = 3;
    var moveDistance = 0;
    var movePow = 10;

    var sc = this;


//    mouseAdapter(this.container).onDown( onDown );
//    mouseAdapter(this.container).onDrag( onDragging, onDragUp );
//    mouseAdapter(this.container).onWheel(onWheel);

    this.eventRegistration = function( value ){
        if( value ){
            mouseAdapter(this.container).onDown( onDown );
            mouseAdapter(this.container).onDrag( onDragging, onDragUp );
            mouseAdapter(this.container).onWheel(onWheel);
        }else{
            mouseAdapter(this.container).offDown( onDown );
            mouseAdapter(this.container).offDrag( onDragging, onDragUp );
            mouseAdapter(this.container).offWheel(onWheel);
        }
    }

    this.eventRegistration( true );

    mouseAdapter( this.scrollBtn).onDown( onBtnDown );
    mouseAdapter( this.scrollBtn ).onDrag( onBtnDragging, onBtnDragUp );

    function onBtnDown(e){
        ( e.preventDefault) ? e.preventDefault() : ( e.returnValue = false );
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;

        bm.setStyles( content, { width : sc.container.offsetWidth-24 +"px"});
        bm.setStyles( sc.scrollBar, { width:"24px" } );
        bm.setStyles( sc.scrollBtn, { width:"20px", left:sc.scrollBar.offsetLeft+1+"px"} );

        TweenMax.killTweensOf( sc );
        prevBtnY = e.clientY;
    }

    var prevBtnY = 0;
    function onBtnDragging( e ){
        ( e.preventDefault) ? e.preventDefault() : ( e.returnValue = false );
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        sc.__isScrollBtnDragging = true;

        var currY = Math.min( Math.max( 0, parseInt(sc.scrollBtn.style.marginTop) + e.clientY - prevBtnY), sc.scrollHeight);
        sc.scrollBtn.style.marginTop = currY + "px";
        sc.__posTop =  ( sc.scrollHeight==0 ? 0 : currY/sc.scrollHeight ) * -sc.scrollableContentHeight;
        sc.moveContent( content, 0, sc.__posTop );
        prevBtnY = e.clientY;

        sc.__isScrollBtnDragging = false;
    }

    function onBtnDragUp( e ){
        ( e.preventDefault) ? e.preventDefault() : ( e.returnValue = false );
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        sc.__isScrollBtnDragging = false;

        bm.setStyles( content, { width : sc.container.offsetWidth-8 +"px"});
        bm.setStyles( sc.scrollBar, { width:"8px" } );
        bm.setStyles( sc.scrollBtn, { width:"6px", left:sc.scrollBar.offsetLeft+1+"px"} );

        sc.scrollBarRefresh();
//        sc.moveContent( content, 0, parseInt(sc.scrollBtn.style.marginTop)/sc.scrollHeight * -sc.scrollableContentHeight );
    }


    function onDown(e){
        if( sc.preventMouseDown ) ( e.preventDefault) ? e.preventDefault() : ( e.returnValue = false );

        TweenMax.killTweensOf( sc );

        prevBtnY = 0;
        var len = powDepth;
        while( len-- ) prevY[len] = e.clientY;
    }

    function onDragging(e){
        moveDistance = e.clientY - prevY[0];

        prevY[0] = e.clientY;
        var len = powDepth;
        while( len ) prevY[len] = prevY[--len];

        sc.__posTop += moveDistance;
        sc.moveContent( content, 0, sc.__posTop );

    }

    function onDragUp(e){
        var duration;

        moveDistance = prevY[0] - prevY[powDepth-1];
        duration = Math.max(0.5, Math.abs( moveDistance/movePow/movePow) );
        destination = sc.__posTop+moveDistance*movePow;

        TweenMax.to( sc, duration, {__posTop:destination, onUpdate:function(){
            sc.moveContent( content, 0, sc.__posTop );
        }} );
    }

    function onWheel( e ){
        ( e.preventDefault) ? e.preventDefault() : ( e.returnValue = false );

        var destination, origin;

        origin = sc.__posTop;
        if( e.delta < 0 ) destination = origin - sc.wheelInterval;
        else destination = origin + sc.wheelInterval;

        sc.moveContent( content, 0, destination );
    }

    this.refresh();
}



ScrollContainer.prototype = {
    destroy : function(){

    }

    ,moveContent : function( content, left, top ){

        left = Math.min( left, this.__limit.startX );
        left = Math.max( left, this.__limit.endX );


        top = Math.min( top, this.__limit.startY );
        top = Math.max( top, this.__limit.endY );

        this.__posLeft = left;
        this.__posTop = top;


        var moveLeft = this.__posLeft - this.__posPrevLeft;
        var moveTop = this.__posTop - this.__posPrevTop;

        events(this).dispatch( "scrollChange", {left:left,top:top, moveLeft:moveLeft, moveTop:moveTop});
//        events(this).dispatch( "scrollChange", {left:Math.round(left),top:Math.round(top), moveLeft:Math.round(moveLeft), moveTop:Math.round(moveTop)});


        this.__posPrevLeft = left;
        this.__posPrevTop = top;

        this.refreshLimit();
        this.scrollBarRefresh();

        if( this.isAutoUpdate ){
            content.style.left = left + "px";
            content.style.top = top + "px";
        }
    }


    ,refresh : function(){
        this.__limit = {
            startX : 0,
            startY : 0,
            endX : -Math.max( ( ( this.useVirtualSize || !this.target ) ? this.virtualSize.width : this.target.offsetWidth ) - this.width, 0),
            endY : -Math.max( ( ( this.useVirtualSize || !this.target ) ? this.virtualSize.height : this.target.offsetHeight ) - this.height, 0 )
        }

        this.refreshLimit();
        this.scrollBarRefresh();
    }

    ,refreshLimit : function(){
        this.__posPrevLeft = Math.min( this.__posPrevLeft, this.__limit.startX );
        this.__posPrevLeft = Math.max( this.__posPrevLeft, this.__limit.endX );
        this.__posPrevTop = Math.min( this.__posPrevTop, this.__limit.startY );
        this.__posPrevTop = Math.max( this.__posPrevTop, this.__limit.endY );
    }


    ,btnMinHeight : 30 // 최소 사이즈
    ,scrollBarRefresh : function(){

        var barHeight = this.container.offsetHeight || this.height || 0;
        this.scrollableContentHeight = ( ( this.useVirtualSize || !this.target ) ? this.virtualSize.height : this.target.offsetHeight ) - this.height;
        var btnHeight = Math.min( barHeight , Math.max( this.btnMinHeight, barHeight/ ( this.scrollableContentHeight+this.height ) * barHeight )) || 0; // 버튼의 높이는 총 컨텐츠 크기로 계산되어야 하므로 height 를 다시 더해줌.
        this.scrollHeight = barHeight - btnHeight;

        this.scrollBtn.style.height = btnHeight + "px";
        this.scrollRect.style.height = this.scrollBtn.style.height;

        if( barHeight == btnHeight ){
            this.scrollBar.style.display = "none";
            this.scrollBtn.style.display = "none";
            this.scrollRect.style.display = "none";

            this.eventRegistration( false );
        }else if( this.scrollBtn.style.display == "none" ){
            this.scrollBar.style.display = "block";
            this.scrollBtn.style.display = "block";
            this.scrollRect.style.display = "block";

            this.eventRegistration( true );
        }

        this.calBtnPos();
    }

    ,calBtnPos : function(){
        var positionRate = -this.__posPrevTop / this.scrollableContentHeight || 0;
        var btnPos = this.scrollHeight * positionRate || 0;
        if( !this.__isScrollBtnDragging ) this.scrollBtn.style.marginTop = btnPos + "px"; /* 스크롤 버튼으로 조정하지 않을때에만, 버튼 y 이동.*/
    }

    ,scrollBtnReset : function(){
        this.__posTop = 0;
        this.__posPrevTop = 0;
        this.scrollBarRefresh();
    }

    ,getLimit : function(){
        return {
            startX : this.__limit.startX,
            startY : this.__limit.startY,
            endX : this.__limit.endX,
            endY : this.__limit.endY
        }
    }

    ,setSize : function( width, height ){
        this.width = width;
        this.height = height;

//        this.container.style.width = width + "px";
//        this.container.style.height = height + "px";
    }

}
