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
        this.el = $('#navigator');
        this.realEl = $('#navigator').find('> li')[0];
        this.elHeight = $('#navigator').outerHeight();
        this.el.css('height', '101px');
        this.registEvent();
    }

    ,registEvent : function(){
        var _this = this;
        $(this.realEl).on('click', function(){
            if( $(_this.el).hasClass('active') ){
                TweenMax.to( _this.el, 0.5, {height : '101px', onComplete : function(){
                    $(_this.el).removeClass('active');
                }});
            }else{
                TweenMax.to( _this.el, 0.5, {height : _this.elHeight, onComplete : function(){
                    $(_this.el).addClass('active');
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
        var scrT = $(window).scrollTop();
        if(scrT > $("header").outerHeight()){
            $(".wrapper").addClass("fixed");
        }else{
            $(".wrapper").removeClass("fixed");
        }
    }
}

$(document).ready(function(){
    naviEl.init();
})

$(window).on('scroll', function(){
    naviEl.title_pos();
})