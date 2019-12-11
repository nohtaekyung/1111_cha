$(document).ready(function() {
    $("#lifeCardGrid").find("img").load(function(){
        $("#lifeCardGrid").masonry({
            itemSelector : ".life_card_list"
        });
    });
});

$(function(){
    //footer
    $('.footer_lang_area').on('click',function(){
        if($('.footer_lang_list').hasClass('on')){
            $('.footer_lang_list').removeClass('on');
        }else{
            $('.footer_lang_list').addClass('on');
        }
    })

    $('.quick_menu_close_btn').on('click', function(){
        $('.quick_menu_con').removeClass('active');
    })

    $('.quick_menu_btn').on('click', function(){
        $('.quick_menu_con').addClass('active');
    })
})

$(window).load(function(){
    var main_visual_slide = new Swiper('.main_visual_wrap .main_visual_inner', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,mousewheelControl: false
        ,autoplay: {
            delay: 3000,
        }
        ,autoplayDisableOnInteraction: true // 인터렉션 이후 다시 오토 플레이
        , pagination: {
            el: '.main_visual_wrap .main_visual_pagination_wrap .pagination_con',
            type: 'bullets',
            clickable : true
        }
    });

    var mainFacilityLineTop = 0;
    var main_facility_swiper = new Swiper('.facility_wrap .facility_slide_wrap', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,mousewheelControl: false
        ,autoplayDisableOnInteraction: true // 인터렉션 이후 다시 오토 플레이
        , pagination: {
            el: '.facility_wrap .facility_slide_pagination_con',
            type: 'bullets',
            clickable : true
        }
        ,on : {
            init : function(){
                mainFacilityLineTop = $($(this)[0].slides[0]).find('.text_con').position().top ;
                mainFacilityLineTop += $($(this)[0].slides[0]).find('.text_con .title').height();
                $('.facility_slide_line').css('top',mainFacilityLineTop);
            },
            slideChangeTransitionStart : function(){
                $('.facility_slide_line').css('width',0);
            },
            slideChangeTransitionEnd : function(){
                $('.facility_slide_line').css('width','171px');
            }
        }
    });

    mainStaffController.init();
})

var mainStaffController = {
    init : function(){
        this.target = $('.staff_card_list_con');
        this.targetHeight = $(this.target).outerHeight();
        this.targetLen = $('.staff_card_list').length;
        this.defaultLen = 4;
    }

    ,registEvent : function(){
    }

    ,addLoad : function(){
        var _this = this;
        if( this.targetLen > parseInt(this.defaultLen)+4 ){
            if( this.targetLen > this.defaultLen ){
                this.targetHeight = parseInt(this.targetHeight)+parseInt($('.staff_card_list').outerHeight()+20)*2;
                TweenMax.to( this.target, 0.5, {height : this.targetHeight});
                _this.defaultLen = parseInt(_this.defaultLen)+4;
            }
        }else{
            if( this.targetLen > this.defaultLen ){
                this.targetHeight = parseInt(this.targetHeight)+parseInt($('.staff_card_list').outerHeight()+20);
                TweenMax.to( this.target, 0.5, {height : this.targetHeight});
                _this.defaultLen = parseInt(_this.defaultLen)+2;
            }
        }
    }
}