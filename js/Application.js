window.version = ( function() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return parseInt( rv );
} )();


var Application = function () {

    var winLoaded = false;
    var appLoaded = true;
    var readyCallBack = [];

    this.wvElementList = { length : 0 };
    var _this = this;

    var loadCheck = function(){
        if( winLoaded && appLoaded ) {

            // 전체 로딩완료시 wevenjs 의 defaultSetting 을 먼저 호출
            _this.defaultSetting();

            // 등록된 ready 함수들 순차 호출
            var len = readyCallBack.length;
            for( var i = 0; i<len; i++ ) readyCallBack[i]();
            readyCallBack.length = 0;
        }
    }


    /**
     * @param id : element id
     */
    this.getWvElement = function( id ){
        return this.wvElementList[id];
    }

    // window load ready
    $(function(){ winLoaded = true; loadCheck(); })
    this.appLoadedComplete = function(){
        appLoaded = true;
        loadCheck();
    }

    this.appDataPrepare = function(){
        appLoaded = false;
    }

    /**
     * ready 콜백 함수 등록
     * @param fn
     */
    this.ready = function( fn ){
        readyCallBack.push( fn );
        loadCheck();
    }

    this.defaultSetting = function(){
        this.wvTypeCrawling();
        this.wvHandlerCrawling();
    }

    /**
     * 핸들러 크롤링 시작
     * [2016.06.20-hjd] target 인자 추가(default undefined), 특정 시점에서 특정 대상에 handler 처리가 필요할 경우가 있음
     */
    this.wvHandlerCrawling = function( target ){

        var o;
        var _this = this;

        // [hjd] 특정 범위에서 handler 처리가 필요할 경우
        var _target = null;
        if( target != null ){
            _target = $(target).find('[data-wv-handler]');
        }else{
            _target = $('[data-wv-handler]');
        }

        _target.each( function(){
            o = bm.parsing.parseStrToObj( $(this).attr("data-wv-handler") );

            // 이곳에 else if 형태로 핸들러 추가.
            if( o.type == "datepicker" ){
                bm.datepicker.registDatePicker( this, o.target );

            }else if (o.type == "visibleToggle" ){

                if( !o.target ) {
                    alert(  "visibleToggle의 target이 없습니다." );
                    bm.effect.elementPoint( this );
                    return;
                }

                bm.interaction.registVisibleToggle( this, $(o.target)[0] );

            }else if (o.type == "draggable" ){

                bm.interaction.registDraggable( this );

            }else if (o.type == "fileUploader" ){
                bm.fileUploader.registFileUploader( this, o );
            }
        })
    }

    /**
     * 위븐 빌더 타입별 크롤링 시작
     */
    this.wvTypeCrawling = function(){

        var type, id, obj;
        var _this = this;
        var wvObjList = [];

        $('[data-wv-type]').each( function(){
            type = $(this).attr("data-wv-type");
            id = $(this).attr("id");
            if( !id ){
                alert( "data-wv-type : "+type+" 의 ID가 정의되지 않았습니다.");
                return;
            }

            if( !bm[type] ){
                alert( "data-wv-type : "+type+" 은 정의되지 않은 객체입니다." );
                return;
            }

            obj =  bm[type]( this );

            _this.wvElementList[ id ] = obj;
            wvObjList.push( obj );
        })


        // 바인딩
        var len = wvObjList.length;
        while( len-- ){
            if( wvObjList[len].binding ) wvObjList[len].binding();
        }

    }
}





/**
 * 어플리케이션 생성
 * @type {Application}
 */
var app = new Application();