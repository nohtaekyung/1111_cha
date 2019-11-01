window.onload = function(){
    sub_swiper = new Swiper('.sub_03_02_pop_contents_con .swiper-container', {
        direction: 'horizontal' // 슬라이드 진행방향은 수평(vertical하면 수직으로 움직임)
        ,loop : true
        ,speed : 500
        ,autoplay : false
        ,slidesPerView: 1 // 한번에 보이는 슬라이드 갯수
        ,mousewheelControl: true // 마우스 휠로 슬라이드 움직임
        ,navigation: {
            nextEl: '.sub_03_02_pop_arrow.right',
            prevEl: '.sub_03_02_pop_arrow.left'
        }
    });
}

function openPop(idx){
    sub_swiper.slideToLoop(idx, 0);
    $('.sub_03_02_pop_con').css({'opacity' : '1', 'z-index' : '10'});
}
function closePop(){
    $('.sub_03_02_pop_con').css({'opacity' : '0', 'z-index' : '-1'});
}