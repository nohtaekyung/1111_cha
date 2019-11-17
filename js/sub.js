$(function(){
    if($('.disease_list_con').length != 0){
        $('.disease_list_con').find('> li > a').on('click',function(){
            var parent = $(this).parent();
            if(!parent.hasClass('active')){
                // 클릭 시 다 열리게 할거면 이부분 삭제
                parent.siblings().removeClass('active');
                parent.siblings().find('> .list_style_1_con').slideUp();
                // -------------------------------------
                parent.addClass('active');
                parent.find('> .list_style_1_con').slideDown();
            }else{
                parent.removeClass('active');
                parent.find('> .list_style_1_con').slideUp();
            }
        })
    }
})