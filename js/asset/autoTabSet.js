function setTabStyle(_selector, mobileSelectboxSelector){
    this.dataTabUl = null;
    this.dataTabLiList = null;
    this.dataTabMenuList = null;

    this.selectedLi = null;
    this.dataSelectedItem = null;
    this.selectedIndex = 0;
    var _this = this;
    this.needLoadImgList;

    this.dataTabUl = $(_selector+' [data-tabStyle-ul]');
    this.dataTabLiList = $(_selector+' [data-tabStyle-li]');
    this.dataTabMenuList = $(_selector+' [data-tabStyle-li] > a');

    this.dataTabLiList.find('[data-tabStyle-item]').hide();
    this.selectedIndex = $(_selector+' [data-tabStyle-li]').index( $(_selector+' [data-tabStyle-li].active') );
    if( this.selectedIndex != -1 ){
        this.indexControl();
    }
    
    
    this.registEvent();
}

setTabStyle.prototype = {

    setIndex : function( index ){
        this.selectedIndex = index;
        this.indexControl();
    }

    ,getIndex : function(){
        return this.selectedIndex;
    }

    ,indexControl : function(){
        this.selectedLi = this.dataTabLiList[ this.selectedIndex ];

        this.dataSelectedItem = $( this.selectedLi ).find('[data-tabStyle-item]');
        this.dataTabLiList.removeClass('active');
        $( this.selectedLi ).addClass('active');
        this.dataTabLiList.find('[data-tabStyle-item]').hide();
        $( this.selectedLi ).find('[data-tabStyle-item]').show();

        // 기존에 이미지 로딩 이벤트를 대기중인 것이 있다면 off 함.
        if( this.needLoadImgList ) this.needLoadImgList.off("load");

        var _this = this;
        // 새로운 이미지를 찾아서 이벤트 핸들러 등록.
        setTimeout(function() {
        	_this.needLoadImgList = _this.dataSelectedItem.find("img");
            var imgLoadedCount = 0;
            if( _this.needLoadImgList.length > 0 ){
                _this.needLoadImgList.on("load", function(){
                    imgLoadedCount++;
                    _this.setUlHeight();
                }).each( function(){
                    if( this.complete ) $(this).load();
                })
            }else{
            	_this.setUlHeight();
            }
        }, 100);
    }

    ,registEvent : function(){
        var _this = this;
        this.dataTabMenuList.on("click", function() {
        	
        	_this.setMobileTab(_this.dataTabMenuList.index(this));
        	
            _this.setIndex( _this.dataTabMenuList.index(this) );
            _this.indexControl();
            if( _this.onTabChange ) _this.onTabChange.call( _this, _this.selectedIndex, _this.selectedLi, _this.dataSelectedItem )
        });

        $(window).on('resize', function(){
            _this.setUlHeight();
        })
        
        setTimeout(function() {
        	_this.setUlHeight();
        }, 500 );
    }

    ,removeEvent : function(){
        this.dataTabMenuList.off();
    }

    ,setUlHeight : function(){
    	if( !this.dataSelectedItem || !this.dataTabUl ) return;
        var itemHeight= this.dataSelectedItem.outerHeight();
        if( isNaN( parseInt( itemHeight ) ) && this.dataSelectedItem.length > 0 ) itemHeight = this.dataSelectedItem[0].offsetHeight;
        var size = itemHeight + parseInt( this.dataSelectedItem.css("marginTop") ) + parseInt( this.dataSelectedItem.css("marginBottom") ) + 10; // 10 의 여백을 더함.
        this.dataTabUl.css({'height': size });
    }

    ,onTabChange : null
    
    ,setMobileTab : function( idx ){
    	var mobileTabMenu = $(".mobile_tab_menu_selectbox_con select option");
    	
    	mobileTabMenu.prop("selected", false);
    	$(mobileTabMenu[idx]).prop("selected", true);
    }
    
};

//모바일 탭메뉴 컨트롤
function mobileTabControll( _this, mobileTabContainer, triggerTagName ){
	var idx = _this.value;
	var $tabList = $("."+ mobileTabContainer +" > li");
	
	if(triggerTagName != null && triggerTagName == "label"){
		$($tabList[idx]).find(triggerTagName)[0].click();
	}else{
		// 기본형(탭 차일드 on/off)
		$($tabList[idx]).find("a")[0].click();
	}
};

//링크 이동 시 특정 탭 열림
function setCurrentTab(){
	var url = location.href;
	var tab;
	
	url = url.slice( url.indexOf( location.host )+1 );
	if( url.indexOf("page/") > -1 ) url = url.slice( url.indexOf("page/") + 5 );
	if( url.indexOf( "?") > -1 ) url = url.slice( url.indexOf("?") + 1 );
	if( url.indexOf( "tabTarget=") > -1 ) tab = "#" + url.slice( url.indexOf("tabTarget=") + 10 );
	
	if( tab != "" ){
		$(tab).click();
	}
}

//app.ready(function(){
//    var tabBtns = new setTabStyle('.tab_style_0_con');
//    window["tabContents"] = tabBtns;
//})