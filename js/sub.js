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
            $( el ).on('click', function(){

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
});

/* faq */
function faq_fn(){
    $(".faq_list > li > a").click(function(){
        if($(this).next(".faq_con").css("display") == "block"){
            $(this).parent("li").removeClass("on");
            $(this).next(".faq_con").slideUp();
        }else{
            $(this).parent("li").addClass("on");

            if ($(".faq_list").hasClass("pop")) {
                $(".faq_con").slideUp();
            }

            $(this).next(".faq_con").slideDown();
        }
    });
};