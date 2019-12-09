$(function(){
    $('.header_wrap').find('.menu_con').on('click',function(){
        if(!$('.clicked_header_wrap').hasClass('active')){
            $('.clicked_header_wrap').addClass('active');
            $('body').css('overflow','hidden');
        }else{
            $('.clicked_header_wrap').removeClass('active');
            $('body').css('overflow','');
        }
    })
    $('.clicked_header_wrap').find('.close_btn_con').on('click',function(){
        if($('.clicked_header_wrap').hasClass('active')){
            $('.clicked_header_wrap').removeClass('active');
            $('body').css('overflow','');
        }
    })
    $('.gnb_wrap').find('> ul > li').on('click',function(){
        if(!$(this).hasClass('active')){
            $(this).siblings().removeClass('active');
            $(this).siblings().find('> ul').slideUp();
            $(this).addClass('active');
            $(this).find('> ul').slideDown();
        }else{
            $(this).removeClass('active');
            $(this).find('> ul').slideUp();
        }
    })
})

var naviEl = {
    init : function(){
        this.el = $('#navigator').find('.menu_list_con');
        this.realEl = $('#navigator').find('.active_menu');
        this.elHeight = $(this.el).css('height','auto').outerHeight();
        this.el.css('height', 0);
        this.registEvent();
    }

    ,registEvent : function(){
        var _this = this;
        $(this.realEl).on('click', function(){

            var scrollHeight = $(window).innerHeight() - $(_this.realEl).outerHeight();

            if( $(_this.el).hasClass('active') ){
                if(_this.elHeight > scrollHeight){
                    $(_this.el).css('overflow-y','hidden');
                }
                TweenMax.to( _this.el, 0.5, {height : 0, onComplete : function(){
                    $(_this.el).removeClass('active');
                }});
            }else{
                TweenMax.to( _this.el, 0.5, {height : _this.elHeight, onComplete : function(){
                    $(_this.el).addClass('active');
                    if(_this.elHeight > scrollHeight){
                        $(_this.el).css({'maxHeight':scrollHeight}).css('overflow-y','scroll');
                    }
                }});
            }
        });

        $('.sns_btn_con').on('click', function(){
            if( $('.sns_popup_wrap').hasClass('active') ){
                $('.sns_popup_wrap').removeClass('active');
            }else{
                $('.sns_popup_wrap').addClass('active');
            }
        })

        $('.sns_close_btn').on('click', function(){
            if( $('.sns_popup_wrap').hasClass('active') ){
                $('.sns_popup_wrap').removeClass('active');
            }else{
                $('.sns_popup_wrap').addClass('active');
            }
        })
    }

    ,title_pos : function(){
        if( $('.sub_header_wrap').length > 0 ){
            var scrT = $(window).scrollTop();
            if(scrT > $("header").outerHeight()){
                $(".wrapper").addClass("fixed");
            }else{
                $(".wrapper").removeClass("fixed");
            }
        }
    }
}

$(document).ready(function(){
    naviEl.init();
})

$(window).on('scroll', function(){
    naviEl.title_pos();
})