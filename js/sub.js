var events = function( target ){
    return bm.eventTrigger.get( target );
};

bm.Events = function(){ this.trigger = {} }
bm.Events.prototype = {

    addListener : function( type, listener ){
        if( !this.trigger[type] ) this.trigger[type] = [];
        this.trigger[type].push( listener );
    }

    ,removeListener : function( type, listener ){
        if( this.hasListener(type, listener ) == false ) return;
        var index = this.trigger[type].indexOf( listener );
        this.trigger[type].splice( index, 1 );
        if( this.trigger[type].length == 0 ) delete this.trigger[ type ];
    }

    ,hasListener : function( type, listener ){
        if( this.trigger[type] && this.trigger[type].indexOf( listener ) > -1 ) return true;
        else return false;
    }

    ,dispatch : function( type, data ){

        if( type === '' ){
            throw new Error("Error [bm.Events.Event]:dispatch() ==> type is not defined");
            return;
        }

        var e = {};
        e.type = type;
        e.data = data;

        if( this.trigger[type] ){
            var len = this.trigger[type].length;
            while( len-- ){
                var fn = this.trigger[type][len];
                fn.call( fn, e );
            }
        }

    }
}

bm.eventTrigger = {

    eventList : []

    ,list : []

    ,get : function( target ){
        var idx = this.list.indexOf( target );
        if( idx > -1 ) return this.eventList[ idx ];
        else return this.make( target );
    }

    ,make : function( target ){
        this.list.push( target );
        this.eventList.push(new bm.Events());
        return this.eventList[ this.eventList.length-1 ];
    }
}

bm.each = function( list, fn ){
    var key, i = 0;
    if( !list || list.length == 0 ) return;

    if( list.length ) while( i<list.length ) fn.call( list[i], i, list[i], i++ ); /* fn( key, value, index ); */
    else for( key in list ){ fn.call( list[i], key , list[key], i++ ); }
}

bm.indexOf = function( list, item ){
    var i = list.length;
    while( i-- ) if( list[ i ] === item ) return i;
    return -1;
}

/* 자주하는질문 faq용
 * 질문 카테고리별로 faqcon이 나오고, 각각 오픈되고 닫혀야한다면 따로 객체 생성하고,
 * 여러개여도 항상 하나만 오픈되어야한다면 하나객체만 생성
 * */
faqController = function( ){
    this.targetCon = null;
    this.target = null;
    this.targetReply = null; //여닫을 reply. 이 el에 data-faqReply attr 붙여줘야함
    this.targetHeight = 0;

    this.selectedIdx = -1;
    this.activeClass = null; //오픈될때(active시) 붙일 클래스
    this.animateDuration = 0; //reply 오픈시 애니메이션 duration
    this.isResized = true; //리사이징 하고있을때 true. true일때만 리사이징이벤트 실행하도록 하는 변수
}

faqController.prototype = {

    init : function( targetCon , activeClass ){

        this.targetCon = $( targetCon );
        this.target = this.targetCon.children( 'li' );
        this.targetReply = this.target.children( '[data-faqReply]' );

        this.activeClass = activeClass;
        this.animateDuration = 200;

        this.registEvent();
    }

    ,registEvent : function(){
        var _this = this;


        _this.target.each(function( idx , el ){
            $( el).find('.comment_con').on('click', function(){

                //이전에 클릭한 타겟 == 현재 클릭한 타겟
                if( _this.selectedIdx == idx ){
                    if( _this.isOpen( idx ) ){
                        _this.closeTarget( idx );

                    } else {
                        _this.openTarget( idx );
                    }
                }
                //이전에 클릭한 타겟 != 현재 클릭한 타겟
                else {
                    _this.closeTarget( _this.selectedIdx );
                    _this.openTarget( idx );
                }
            })

        });

        //리사이징 이벤트
        $( window ).resize(function(){
            if( _this.isOpen( _this.selectedIdx ) && _this.isResized ){
                _this.resetReplyheight();
            }
        });
    }

    ,resetReplyheight : function(){
        var _this = this;
        var currentHeight;

        currentHeight = _this.getReplyHeight( _this.selectedIdx );

        if( ( currentHeight != _this.targetHeight ) ){
            _this.isResized = false;
            _this.setReplyHeight( _this.selectedIdx , currentHeight , 0 , function(){
                _this.isResized = true;
            });
        }
    }

    ,openTarget : function( idx ){
        var _this = this;

        _this.target.eq( idx ).addClass( _this.activeClass );
        _this.setReplyHeight( idx , _this.getReplyHeight( idx ) );
        _this.selectedIdx = idx;
    }

    ,closeTarget : function( idx ){
        var _this = this;

        if(idx == -1) return;

        _this.setReplyHeight( idx , 0 , _this.animateDuration ,  function(){
            _this.target.eq( idx ).removeClass( _this.activeClass );
        });
    }

    ,isOpen : function( idx ){
        var _this = this;

        if( _this.target.eq( idx ).hasClass( this.activeClass ) ) return true;

        return false;
    }

    ,setReplyHeight : function( idx , _height , duration , callback ){
        var _this = this;
        var tempDuration = ( duration != null) ? duration : _this.animateDuration;

        _this.targetReply.eq( idx ).animate({height: _height }, {duration : tempDuration ,
            complete:function(){
                _this.targetHeight = _height;

                if( callback ) callback.call();
            }
        } );
    }

    ,getReplyHeight : function( idx ){
        var _this = this;
        var _target = _this.targetReply.eq( idx );
        var autoHeight;

        _this.targetHeight = _target.height();
        autoHeight = _target.css( 'height' , 'auto' ).height();

        _this.setReplyHeight( idx , _this.targetHeight , 0 );

        return autoHeight;
    }

    ,removeEvent : function(){

    }

    ,destroy : function(){

    }

}

TabNavigator = function( btns, childs, btnOnClass ){

    this.selectedIndex = 0;
    this.btns = btns;
    this.childs = childs;
    this.btnOnClass = btnOnClass;

    this.active();
}

TabNavigator.TAB_INDEX_CHANGE = "TAB_INDEX_CHANGE";

TabNavigator.prototype = {

    active : function(){
        var tab = this;
        tab.indexControl();

        $(this.btns).on( "click", function(){
            tab.selectedIndex = bm.indexOf( tab.btns, this );
            tab.indexControl();
        });
    }

    ,deActive : function(){
        $(this.btns).off("click");
    }

    ,indexControl : function(){
        var len = this.btns.length;
        while( len-- ){
            if( this.selectedIndex == len ){
                $(this.btns[len]).addClass( this.btnOnClass );
                $(this.childs[len]).show();
            }else{
                $(this.btns[len]).removeClass( this.btnOnClass );
                $(this.childs[len]).hide();
            }
        }
        events( this ).dispatch( TabNavigator.TAB_INDEX_CHANGE, {selectedIndex:this.selectedIndex} );
    }
}

$(function() {
    var faqObj = new faqController();
    faqObj.init( '.comment_wrap' , 'list_on');

    if($('ul[data-wv-slide-list]').length != 0){
        $('ul[data-wv-slide-list]').find('> li > a').on('click',function(){
            var parent = $(this).parent();
            if(!parent.hasClass('active')){
                // 클릭 시 다 열리게 할거면 이부분 삭제
                parent.siblings().removeClass('active');
                parent.siblings().find('> .desc_con').slideUp(300);
                // -------------------------------------
                parent.addClass('active');
                parent.find('> .desc_con').slideDown(300);
            }else{
                parent.removeClass('active');
                parent.find('> .desc_con').slideUp(300);
            }
        })
    }

    faq_fn();

    var selectedIndex, findTabMenu;
    var selectedMenu = $('.tab_style_0 > li.active');
    var tabMenu = $('.tab_style_0 > li');
    var tabContents = $('.tab_style_0_child_con .input_list_style_1_con');

    if(selectedMenu){
        selectedIndex = selectedMenu.index();
    }else{
        selectedIndex = 0;
    }

    if($('.tab_style_0').length > 0 && ( tabMenu.length == tabContents.length ) ){
        findTabMenu = new TabNavigator( tabMenu , tabContents , 'active');
        findTabMenu.selectedIndex = selectedIndex;
        findTabMenu.indexControl();
    }

    if( $('.box_list_style_0_con').length > 0 ){
        boxListController.init();
    }

    if( $('.box_list_style_1_con').length > 0 ){
        boxListController1.init();
    }
});

/* faq */
function faq_fn(){
    $(".faq_list > li > a").click(function(){
        if($(this).next(".faq_con").css("display") == "block"){
            $(this).parent("li").removeClass("on");
            $(this).next(".faq_con").slideUp();
        }else{
            if ($(".faq_list").hasClass("pop")) {
                $('.faq_list > li').removeClass('on');
                $(".faq_con").slideUp();
            }

            $(this).parent("li").addClass("on");
            $(this).next(".faq_con").slideDown();
        }
    });
};

function openFloorPopup(){
    $('#floorImg').show();
    $('body').css('overflow', 'hidden');
}

function closeFloorPopup(){
    $('#floorImg').hide();
    $('body').css('overflow', '');
}

var boxListController = {
    init : function(){
        this.targetCon = $('.box_list_style_0_con');
        this.target = $(this.targetCon).find('> li');
        this.targetLen = this.target.length;
        this.defaultLen = 5;
        this.currentLen = 5;

        this.registEvent();
    }

    ,registEvent : function(){
        var _this = this;
        if( this.targetLen > this.defaultLen ){
            this.targetHeight = 0;
            for( var i=0; i<this.defaultLen; i++ ){
                _this.targetHeight = _this.targetHeight+parseInt($(_this.target[i]).outerHeight())+30;
            }
            _this.targetHeight-=30;
            this.targetCon.css('height', this.targetHeight);
        }
    }

    ,addLoad : function(){
        var _this = this;
        if( this.targetLen >= this.currentLen ){
            this.currentLen++;
            this.targetHeight = parseInt(this.targetHeight) + parseInt($(this.target[this.currentLen-1]).outerHeight())+30;
            TweenMax.to( this.targetCon, 0.5, {height : this.targetHeight});
        }
    }
}

var boxListController1 = {
    init : function(){
        this.targetCon = $('.box_list_style_1_con');
        this.target = $(this.targetCon).find('.box_list_style_1_list');
        this.targetLen = this.target.length;
        this.defaultLen = 6;
        this.currentLen = 6;

        this.registEvent();
    }

    ,registEvent : function(){
        var _this = this;
        if( this.targetLen > this.defaultLen ){
            this.targetHeight = 0;
            for( var i=0; i<this.defaultLen; i+=2 ){
                if( (parseInt($(_this.target[i]).outerHeight()) - parseInt($(_this.target[i+1]).outerHeight())) >= 0 ){
                    //왼쪽꺼가 오른쪽꺼보다 크거나 둘이 크기가 똑같을 때
                    _this.targetHeight = _this.targetHeight+parseInt($(_this.target[i]).outerHeight());
                }else{
                    //오른쪽꺼가 더 클 때
                    _this.targetHeight = _this.targetHeight+parseInt($(_this.target[i+1]).outerHeight());
                }
            }
            this.targetCon.css('height', this.targetHeight);
        }
    }

    ,addLoad : function(){
        var _this = this;
        if( this.targetLen >= this.currentLen ){
            this.currentLen++;
            if( this.targetLen % 2 == 0 ){
                // 리스트의 개수가 짝수일 떄
                if( parseInt($(this.target[this.currentLen-1]).outerHeight()) - parseInt($(this.target[this.currentLen]).outerHeight()) ){
                    //왼쪽꺼가 오른쪽꺼보다 크거나 둘이 크기가 똑같을 때
                    this.targetHeight = (parseInt(this.targetHeight) + parseInt($(this.target[this.currentLen-1]).outerHeight()));
                }else{
                    //오른쪽꺼가 더 클 때
                    this.targetHeight = (parseInt(this.targetHeight) + parseInt($(this.target[this.currentLen]).outerHeight()));
                }
                this.currentLen++;
            }else{
                // 리스트의 개수가 홀수일 떄
                this.targetHeight = (parseInt(this.targetHeight) + parseInt($(this.target[this.currentLen-1]).outerHeight()));
            }
            TweenMax.to( this.targetCon, 0.5, {height : this.targetHeight});
        }
    }
}