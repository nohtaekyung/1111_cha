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