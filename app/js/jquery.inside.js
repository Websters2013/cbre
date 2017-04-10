( function(){

    $( function(){

        $.each( $( '.site__header' ), function() {
            new MinimizeHeader( $( this ) );
        } );

    } );

    var MinimizeHeader = function( obj ){

        //private properties
        var _obj = obj,
            _objTop = _obj.offset().top,
            _window = $( window );

        //private methods
        var _checkScroll = function () {

                if ( _window.scrollTop() > 0 ){
                    _obj.addClass( 'minimize' )
                } else {
                    _obj.removeClass( 'minimize' )
                }

            },
            _onEvents = function(){
                _window.on( {
                    'scroll': function () {

                        _checkScroll();

                    }
                } );
            },
            _constructor = function(){
                _checkScroll();
                _onEvents();
            };

        //public properties

        //public methods

        _constructor();

    };

} )();