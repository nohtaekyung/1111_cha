var gnb = {
    init : function(){
        this.registEvent();
    }

    ,registEvent : function(){
        $('.menu_wrap .menu_con > li').on('mouseover', function(){
                $('.header_fixed_dim.depth_2').addClass('active');
                $(this).find(">ul").show();
                $(this).siblings("li > ul").hide();
        })

        $('.menu_wrap .menu_con > li').on('mouseleave', function(){
                $('.header_fixed_dim.depth_2').removeClass('active');
                $(this).find(">ul").hide();
        })

        $('.footer_family_site_con').on('click', function(){
            if( bm.isMobile || checkMobileSize() ){
                $('.family_list_wrap').addClass('active');
            }else{
                TweenMax.to($('.family_list_wrap'), 0.5, {ease: Sine.easeInOut,bottom:'0px'});
            }
        })

        $('#familyClose').on('click', function(){
            if( bm.isMobile || checkMobileSize() ){
                $('.family_list_wrap').removeClass('active');
            }else{
                TweenMax.to($('.family_list_wrap'), 0.5, {ease: Sine.easeInOut,bottom:'-573px'});
            }
        })

        $(window).on("mousewheel DOMMouseScroll", onMouseWheelScroll );

       /* $(window).on('scroll', function(){
            window.scrollTargetTop = $(this).scrollTop();

            /!* 아래로 스크롤 시 *!/
            if( window.scrollTargetTop > 0 ){
                if( $('.wrapper').hasClass('sub') ){
                    $('.header_wrap').addClass('header_fixed');
                }
            }else{
                /!* 최상단일 때 *!/
                if( $('.wrapper').hasClass('sub') ){
                    $('.header_wrap').removeClass('header_fixed');
                }
            }
        })*/
    }
}

$(window).on("mousewheel DOMMouseScroll", onMouseWheelScroll );
function onMouseWheelScroll( e ){
    var e = e.originalEvent;

    //e.preventDefault();

    var delta = 0;
    if( e.detail ){
        delta = e.detail * -40;
    }else{
        delta = e.wheelDelta;
    }

    if( delta > 0 ){
        /* 아래로 스크롤 시 */
        if( $('.wrapper').hasClass('sub') ){
            $('.header_wrap').removeClass('header_fixed');
        }
    }else{
        /* 위로 스크롤 시 */
        if( $(window).scrollTop()>0 ){
            if( $('.wrapper').hasClass('sub') ){
                $('.header_wrap').addClass('header_fixed');
            }
        }
    }

    /*if( $(window).scrollTop() + document.body.clientHeight >= $('.footer_wrap').offset().top ){
        $('.canvas_con').css({'top' : parseInt($('.footer_wrap').offset().top-35)+'px', 'bottom': 'auto', 'position':'absolute'});
    }else{
        $('.canvas_con').css({'top' : '', 'bottom': '', 'position': ''});
    }*/


}


var mobile_gnb = {

    target : null
    ,menuIcon : null
    ,menuList : []
    ,menuListChild : []
    ,menuListHeight : []

    ,init : function(){
        var _this = this;


        this.target = $('.mobile_menu_wrap');
        this.menuIcon = $('.menu_icon');
        this.menuList = $('.mobile_menu_list > li');
        this.menuListChild = $(this.menuList).find('>ul');
        for( var i=0; i<this.menuListChild.length; i++ ){
            this.menuListHeight.push($(this.menuListChild[i]).outerHeight());
        }

        $(this.menuList).find('>a').attr('href', 'javascript:void(0)');
        this.menuListChild.css('height', '0');
        $(_this.target).css('top', '-100%');

        this.registEvent();
    }

    ,registEvent : function(){
        var _this = this;

        $(this.menuIcon).on('click', function(){
            if( $('.header_wrap').hasClass('menu_active') ){
                $('body').css('overflow', '');
                TweenMax.to($(_this.target), 0.5, {ease: Sine.easeInOut,top:-100+'%'});
                $('.header_wrap').removeClass('menu_active');
            }else{
                $('body').css('overflow', 'hidden');
                TweenMax.to($(_this.target), 0.5, {ease: Sine.easeInOut,top:0+'%'});
                $('.header_wrap').addClass('menu_active');
            }
        })

        $(this.menuList).on('click', function(){
            if( $(this).hasClass('gnb_open') ){
                $(this).removeClass('gnb_open');
                TweenMax.to($(_this.menuListChild), 0.5, {ease: Sine.easeInOut,height:0+'px'});
            }else{
                $(_this.menuList).removeClass('gnb_open');
                $(this).addClass('gnb_open');
                TweenMax.to($(this).find('>ul'), 0.5, {ease: Sine.easeInOut,height:_this.menuListHeight[$(this).index()]+'px'});
                TweenMax.to($(_this.menuList).not($(this)).find('>ul'), 0.5, {ease: Sine.easeInOut,height:0+'px'});
            }
        })
    }

    ,removeEvent : function(){

    }

    ,destroy : function(){

    }
}


$(function(){
    gnb.init();
    mobile_gnb.init();
    mobile_lnb.init();
    AOS.init({
        easing: 'ease-out-cubic'
    });

    $('.contact_us_click_btn').on('click', function(){
        if( bm.isMobile || checkMobileSize() ){
            $('body').css('overflow', 'hidden');
        }else{
            $('body').css('overflow', '');
        }
        $('.contact_us_contents_wrap').addClass('active');
        TweenMax.to($('.contact_us_contents_wrap'), 0.5, {ease: Sine.easeInOut,right:0+'%'});
        $('.contact_us_dim').show();
    })

    $('.contact_us_close_btn').on('click', function(){
        $('body').css('overflow', '');
        $('.contact_us_contents_wrap').removeClass('active');
        TweenMax.to($('.contact_us_contents_wrap'), 0.5, {ease: Sine.easeInOut,right:-100+'%'});
        $('.contact_us_dim').hide();
    })

    $('.contact_us_dim').on('click', function(){
        TweenMax.to($('.contact_us_contents_wrap'), 0.5, {ease: Sine.easeInOut,right:-100+'%'});
        $('.contact_us_dim').hide();
    })

    $('.canvas_con').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    })

    $('.footer_top_btn').click(function(){
        if( $('.footer_wrap').hasClass('active') ){
            $('.footer_wrap').removeClass('active');
            TweenMax.to($('.footer_polding_con'), 0.5, {ease: Sine.easeInOut,height:'164px'});
        }else{
            $('.footer_wrap').addClass('active');
            TweenMax.to($('.footer_polding_con'), 0.5, {ease: Sine.easeInOut,height:'0px'});
        }

    });

    $('.contact_us_send_btn').on('click', function(){
        $('body').css('overflow', '');
        $('.contact_us_contents_wrap').removeClass('active');
        TweenMax.to($('.contact_us_contents_wrap'), 0.5, {ease: Sine.easeInOut,right:-100+'%'});
        $('.contact_us_dim').hide();
        $('.contact_us_send_after').show();
        $('.contact_us_send_after img').show();
        setTimeout(function(){
            $('.contact_us_send_after').hide();
            $('.contact_us_send_after img').hide();
        },1400)
    })

    $('.contents_polding_btn').on('click', function(){
        if( $(this).closest('.product_list_style_0_list').hasClass('active') ){
            $(this).closest('.product_list_style_0_list').removeClass('active');
        }else{
            $(this).closest('.product_list_style_0_list').addClass('active');
        }
    })

    $('.product_list_style_0_list .text_box').on('click', function(){
        if( bm.isMobile || checkMobileSize() ){
            if( $(this).closest('.product_list_style_0_list').hasClass('active') ){
                $(this).closest('.product_list_style_0_list').removeClass('active');
            }else{
                $(this).closest('.product_list_style_0_list').addClass('active');
            }
        }
    })

    $('#openPopBtn').on('click', function(){
        $('.pop_style_0_con').show();
    })

    $('.pop_style_0_con').on('click', function(){
        $(this).hide();
    });

    var theCanvas = document.getElementById("canvas");
    var context = theCanvas.getContext("2d");
    var end = 0;
    function drawScreen(end){
        context.clearRect(0,0,50,50);
        context.beginPath();
        context.strokeStyle = "#a6ca01";
        context.lineWidth = 1;
        context.arc(25,25,24,(Math.PI/180)*(0-90), (Math.PI/180)*(end-90), false);
        context.stroke();
        context.closePath();
    }
    drawScreen();
    $(window).on("scroll", function(){
        end = $(window).scrollTop() * 360 / ($(document).height() - $(window).height());
        drawScreen(end);
    });

})


var mobile_lnb = {
    target : null
    ,menuCon : null
    ,menuHeight : 0

    ,init : function(){
        var _this = this;


        this.target = $('.mobile_lnb_list_con > li.active > ul > li.active > a');
        this.targetCon = $('.mobile_lnb_list_con > li.active > ul > li.active');
        this.menuCon = $('.mobile_lnb_list_con > li.active > ul');
        $(this.target).attr('href', 'javascript:void(0)');
        $(this.target).attr('onClick', 'mobile_lnb.clickEvent();');
        if( $(this.targetCon)[0] != undefined ){
            this.HTMLData = $(this.targetCon)[0].outerHTML;
            $(this.menuCon).prepend(this.HTMLData);
        }
        this.menuHeight = $(this.menuCon).outerHeight();
        $(this.menuCon).css({'height' : '73px', 'opacity' : '1'});
        this.registEvent();
    }

    ,registEvent : function(){
    }

    ,clickEvent : function(){
        var _this = this;

        if( $('.mobile_lnb_wrap').hasClass('active') ){
            $('.mobile_lnb_wrap').removeClass('active');
            TweenMax.to($(_this.menuCon), 0.5, {ease: Sine.easeInOut,height:'73px'});
        }else{
            $('.mobile_lnb_wrap').addClass('active');
            TweenMax.to($(_this.menuCon), 0.5, {ease: Sine.easeInOut,height:_this.menuHeight});
        }
    }
}


function setViewport() {
    if( $(window).width() < 480 ) {
        var ww = ( document.documentElement.clientWidth < window.screen.width ) ? $(window).width() : window.screen.width;
        var mw = 480;
        var ratio = ww / mw;
        $('meta[name="viewport"]').attr( 'content', 'width=' + mw + ', initial-scale=' + ratio + ', user-scalable=no' );
    } else {
        $('meta[name="viewport"]').attr( 'content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no' );
    }
}

setViewport();

function checkMobileSize() {
    if ($(window).width() >= 992) {
        return false;
    }else{
        return true;
    }
}