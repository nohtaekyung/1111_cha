/**
 * Created by kjhmac on 2017-01-15.
 */


bm.number = {

    increaseStatus : false,


    /**
     * "rgb(255,255,255)" 를 hex 코드로 변경해주는 함수
     * @param rgb
     * @returns {string}
     */
    rgbToHex : function(rgb){
        rgb = rgb.split("(")[1].split(")")[0];
        rgb = rgb.split(",");

        return "#" + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    }


    /**
     * 숫자를 hex 코드로 변경해주는 함수
     * @param c
     * @returns {string}
     */
    ,hex : function(c) {
        var hex = parseInt(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * 숫자를 일정시간동안 증가 애니메이션 효과 주는 함수
     * @param target
     * @param duration 초단위
     * @param toNum
     * @param onComplete
     */

    ,increseAnimate : function (target, duration, toNum, onComplete){
        var _this = this;
        var dur = duration*1000;
        var $el = $(target);
        var counter = {var:0};

        $el.html(0);
        // if( _this.increaseStatus == false ){
        //     _this.increaseStatus = true;
            TweenMax.to( counter, duration, {var : toNum, onUpdate:function(){
                $(target).text(Math.ceil(counter.var));
            }, onComplete: function(){
                if( onComplete != null ){
                    onComplete();
                }
                // _this.increaseStatus = false;
            } });
        // }
    }

}