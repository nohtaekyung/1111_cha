/* regist event */
function listener(target){ return new __listener( target ); }

function __listener(target){
    var listeningMethod = "";
    var removeMoethod = "";
    var prefix = "";

    var check = function(){
        if( listeningMethod == "" || removeMoethod == "" ){
            if( typeof window.addEventListener != "undefined" ) {
                listeningMethod = "addEventListener";
                removeMoethod = "removeEventListener";
            }
            else {
                listeningMethod = "attachEvent";
                prefix = "on";
                removeMoethod = "detachEvent";
            }
        }
    }

    this.add = function( type, fn ){
        if( !fn ) return;
        check();
        target[listeningMethod]( prefix+type, fn );
    }

    this.remove = function( type, fn ){
        if( !fn ) return;
        check();
        target[removeMoethod]( prefix+type, fn );
    }
}