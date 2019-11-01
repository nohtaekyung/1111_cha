$(function(){

    var main_visual_slide = new Swiper('.main_visual_wrap .main_visual_slide_con', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 1000
        ,mousewheelControl: false
        ,autoplay: {
            delay: 5000,
            disableOnInteraction: false, //사용자 상호 작용 후 자동 재생이 중지되지 않으며 매회 다시 시작
        }
        ,autoplayDisableOnInteraction: true // 인터렉션 이후 다시 오토 플레이
        , pagination: {
            el: '.main_visual_wrap .main_visual_pagination.swiper-pagination',
            type: 'bullets',
            clickable : true
        }
        ,navigation: {
            nextEl: '.main_visual_wrap .main_visual_slide_arrow.right',
            prevEl: '.main_visual_wrap .main_visual_slide_arrow.left',
        }
        ,on : {
            slideChangeTransitionStart : function() {
                $('.main_visual_text_list').hide();
                $('.main_visual_text_list').css('opacity', '0');
                $($('.main_visual_text_list').find('h2')).css('opacity', '0');
                $($('.main_visual_text_list').find('.h_desc2')).css('opacity', '0');
                $($('.main_visual_text_list')[this.realIndex]).show();
                $($('.main_visual_text_list')[this.realIndex]).css('opacity', '1');

                //TweenMax.to($('.main_visual_text_list')[this.realIndex], 1, {ease: Sine.easeInOut,opacity:1});
                TweenMax.to($($('.main_visual_text_list')[this.realIndex]).find('h2'), 1, {ease: Sine.easeInOut,opacity:1});
                TweenMax.to($($('.main_visual_text_list')[this.realIndex]).find('.h_desc2'), 1, {ease: Sine.easeInOut,delay:1.3,opacity:1});
            }
        }
    });

    main_visual_slide.autoplay.start(); //자동 재생 시작

})