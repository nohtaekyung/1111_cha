function checkMobileSize() {
    if ($(window).width() >= 992) {
        return false;
    } else {
        return true;
    }
}

var mainSwiper = {
    galleryTop : null
    ,galleryThumbs : null
    ,slideLength : null
    ,lastRealSlideIdx : null
    ,activeIdx : -1
    ,realIdx : -1
    ,thumbPrevIdx : -1
    ,clickedSlideIdx : -1
    ,clickedSlideRealIdx : -1
    ,onMobileSize : false

    ,init : function(){
        this.galleryTop =  new Swiper('.main_visual_inner.gallery-top', {
            speed : 800,
            spaceBetween: 10,
            loop:true,
            loopedSlides: 5, //looped slides should be the same
            slidesPerView: 1,
            allowTouchMove:true,
            slideToClickedSlide : true,
            effect: 'fade',
            thumbs: {
                swiper: this.galleryThumbs,
            }
            , pagination: {
                el: '.main_visual_pagination.swiper-pagination',
                type: 'bullets',
                clickable:true
            }
            ,breakpoints: {
                992: {

                }
            }
            ,on : {
                resize : function(){

                }
            }
        });
        this.galleryThumbs = new Swiper('.main_page_summary_con .gallery-thumbs', {
            speed : 800,
            spaceBetween: 10,
            slidesPerView: 'auto',
            //slidesPerView:3,
            loop: true,
            loopedSlides: 5, //looped slides should be the same,
            allowTouchMove:false
            ,slideToClickedSlide : false
            ,breakpoints: {
                992: {
                    allowTouchMove:true
                    ,centeredSlides:true
                    ,slideToClickedSlide : true
                }
            }
            ,on : {
                resize : function(){

                },
                init: function(){
                    if(!checkMobileSize()){
                        this.slideNext(0);
                    }
                }
            }
        });
        this.slideLength = this.galleryThumbs.slides.length/3;
        this.lastRealSlideIdx = this.galleryTop.slides.length/3*2;


        this.webMainSwipeEvent();

        if(checkMobileSize()){
            /* 모바일일때 */
            this.galleryThumbs.slideToLoop(this.galleryTop.realIndex);
            this.connectController();
            this.resetSlides();

        } else{
            /* 웹에서 */
            this.disConnectController();
            this.galleryThumbs.slideToLoop(this.galleryTop.realIndex+1);
        }


        this.registEvent();
    }
    ,registEvent : function(){
        var _this = this;

        _this.resizeEvent();

    }
    ,resizeEvent : function(){
        var _this = this;


        $(window).resize(function(){

            _this.webMainSwipeEvent();

            if(checkMobileSize() && !(_this.onMobileSize)){
                /* 모바일일때 */
                _this.galleryThumbs.slideToLoop(_this.galleryTop.realIndex);
               _this.connectController();

                _this.resetSlides();
                _this.onMobileSize = true;
            } else if(!(checkMobileSize()) && (_this.onMobileSize)){
                /* 웹에서 */
                _this.disConnectController();

                _this.galleryThumbs.slideToLoop(_this.galleryTop.realIndex+1);
                _this.onMobileSize = false;
            }
        });


    }
    ,connectController : function(){
        var _this = this;


        _this.galleryThumbs.controller.control = _this.galleryTop;
        _this.galleryTop.controller.control = _this.galleryThumbs;

    }
    ,disConnectController : function(){
        var _this = this;

       _this.galleryThumbs.controller.control = undefined;
       _this.galleryTop.controller.control = undefined;

    }
    ,resetSlides : function(){
        var _this = this;

        _this.galleryTop.slideReset();
        _this.galleryThumbs.slideReset();
    }
    ,webMainSwipeEvent: function () {
        var _this = this;
        
        
        _this.galleryThumbs.slides.off('click');
        _this.galleryTop.off("slideChangeTransitionStart");
        _this.galleryThumbs.off("slideChangeTransitionEnd");

        if (!checkMobileSize()) {
            _this.galleryThumbs.slides.on('click', function () {
                _this.clickedSlideRealIdx = $(this).attr('data-swiper-slide-index');
                _this.clickedSlideIdx = $(this).index();
                _this.galleryTop.slideTo(_this.clickedSlideRealIdx);
            });
            _this.galleryTop.on("touchMove", function () {
                _this.clickedSlideIdx = -1;
            });
            $(_this.galleryTop.pagination.el).on('click', function () {
                _this.clickedSlideIdx = -1;
            });
            _this.galleryTop.on("slideChangeTransitionStart", function () {

                if (!checkMobileSize()) {
                    _this.activeIdx = _this.galleryThumbs.activeIndex;
                    _this.realIdx = _this.galleryThumbs.realIndex;
                    if (_this.slideLength * 2 <= _this.clickedSlideIdx) {
                        _this.galleryThumbs.slideTo(_this.clickedSlideIdx + 1);
                        _this.galleryThumbs.$wrapperEl.css('transform', 'translate3d(-' + _this.galleryThumbs.slidesGrid[_this.clickedSlideIdx + 1] + 'px, 0px, 0px)');
                    }
                    else if ((_this.galleryTop.activeIndex == _this.lastRealSlideIdx) || (_this.thumbPrevIdx == _this.lastRealSlideIdx)) {
                        _this.galleryThumbs.slideNext();
                    }
                    else {
                        _this.galleryThumbs.slideToLoop(_this.galleryTop.realIndex + 1);
                    }
                }
            });
            _this.galleryThumbs.on("slideChangeTransitionEnd", function () {
                if (!checkMobileSize()) {

                    if (_this.slideLength * 2 <= _this.clickedSlideIdx) {
                        if (_this.clickedSlideIdx == (_this.slideLength * 3 - 1)) {
                            _this.galleryThumbs.slideTo(_this.clickedSlideIdx - (_this.slideLength * 2 - 1), 0);
                        }
                        else {
                            _this.galleryThumbs.slideTo(_this.clickedSlideIdx - (_this.slideLength - 1), 0);
                        }
                    }
                    else if ((_this.galleryTop.activeIndex == _this.lastRealSlideIdx) || (_this.thumbPrevIdx == _this.lastRealSlideIdx)) {
                        _this.galleryThumbs.slideToLoop(1);
                    }

                    _this.thumbPrevIdx = _this.galleryThumbs.activeIndex;
                }
            });
        }
    }


}

window.onload = function(){

    mainSwiper.init();

    window.mainSwiper = mainSwiper;


    var swiper1 = new Swiper('.visual_block_061_swiper_img .swiper-container', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,slidesPerView: 2 // 한번에 보이는 슬라이드 갯수
        ,spaceBetween: 28
        ,mousewheelControl: true // 마우스 휠로 슬라이드 움직임
        ,breakpoints: {
            1200: {
                slidesPerView: 1,
                spaceBetween: 0
            }
        }
    });

    var swiper1_text = new Swiper('.visual_block_061_swiper_text .swiper-container', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,slidesPerView: 1 // 한번에 보이는 슬라이드 갯수
        ,mousewheelControl: true // 마우스 휠로 슬라이드 움직임
        ,pagination: {
            el:'.visual_block_061 .theme014_swiper_pagination.swiper-pagination',
            type:'bullets',
            clickable:true
        }
    });

    /* 동기화 */
    swiper1_text.controller.control = swiper1;
    swiper1.controller.control = swiper1_text;

    var swiper2 = new Swiper('.visual_block_063_card_con .swiper-container', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,slidesPerView: 3 // 한번에 보이는 슬라이드 갯수
        /*,spaceBetween: 28*/
        //,mousewheelControl: true // 마우스 휠로 슬라이드 움직임
        ,autoplayDisableOnInteraction: true // 인터렉션 이후 다시 오토 플레이
        ,breakpoints: {
            767: {
                slidesPerView: 1
            },
            992: {
                slidesPerView: 2
            }
        }
        ,pagination: {
            el:'.visual_block_063_card_con + .theme014_swiper_pagination.swiper-pagination',
            type:'bullets',
            clickable:true
        }
    });

    var swiper3 = new Swiper('.visual_block_064_swiper_img_wrap .swiper-container', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,slidesPerView: 1 // 한번에 보이는 슬라이드 갯수
        ,mousewheelControl: true // 마우스 휠로 슬라이드 움직임
    });

    var swiper3_text = new Swiper('.visual_block_064_swiper_text_wrap .swiper-container', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,slidesPerView: 1 // 한번에 보이는 슬라이드 갯수
        ,mousewheelControl: true // 마우스 휠로 슬라이드 움직임
        ,pagination: {
            el:'.visual_block_064 .theme014_swiper_pagination.swiper-pagination',
            type:'bullets',
            clickable:true
        }
    });

    /* 동기화 */
    swiper3_text.controller.control = swiper3;
    swiper3.controller.control = swiper3_text;


}
