( function(){

    $( function(){

        $.each( $( '.site__mobile' ), function() {
            new Menu( $( this ) );
        } );

    } );

    var Menu = function( obj ){

        //private properties
        var _obj = obj,
            _scrollConteiner = $( 'html' ),
            _btn = $( '.mobile-menu-btn' );

        //private methods
        var _constructor = function(){
                _onEvents();
            },
            _onEvents = function(){

                _btn.on( 'click', function() {

                    if ( $( this ).hasClass( 'close' ) ){
                        _closeMenu();
                    } else {
                        _openMenu();
                    }

                } );

            },
            _openMenu = function(){
                _btn.addClass( 'close' );
                _obj.addClass( 'visible' );

                _scrollConteiner.css( {
                    overflowY: 'hidden'
                } );
            },
            _closeMenu = function(){
                _btn.removeClass( 'close' );
                _obj.removeClass( 'visible' );

                _scrollConteiner.css( {
                    overflowY: 'auto'
                } );
            };

        //public properties

        //public methods

        _constructor();

    };

} )();