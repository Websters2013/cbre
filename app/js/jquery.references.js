( function(){

    $( function(){

        $.each( $( '.references' ), function() {
            new ReferencesAnimare( $( this ) );
        } );

    } );

    var ReferencesAnimare = function( obj ) {

        //private properties
        var _obj = obj,
            _objTop = _obj.offset().top,
            _window = $( '.site' );

        //private methods
        var _onEvent = function(){
                _window.on( {
                    'scroll': function () {

                        _checkScroll();

                    }
                } );
            },
            _checkScroll = function () {

                if ( ( _window.scrollTop() + _window.height() * 0.75 ) >= _objTop ){
                    _obj.addClass( 'animate-block' )
                }

            },
            _construct = function() {
                _checkScroll();
                _onEvent();
            };

        //public properties

        //public methods

        _construct();
    };

} )();