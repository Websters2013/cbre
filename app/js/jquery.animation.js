$( function() {

    $.each( $( '.slides' ), function() {
        new Slides ( $( this ) );
    } );

    $.each( $( '.tlt' ), function() {
        new LetteringInit ( $( this ) );
    } );

});

var LetteringInit = function ( obj ) {

    //private properties
    var _obj = obj,
        _window = $( window );

    //private methods
    var _onEvents = function () {
            _window.on({
                scroll: function () {

                    _checkScroll();

                }
            });
        },
        _checkScroll = function(){

            var windowH = _window.height();

            _obj.each(function () {

                var topPos = _obj.offset().top;

                if( _window.scrollTop() > (topPos - windowH/1.3) ){

                    _obj.addClass( 'visible' )

                    _obj.textillate( {
                        in: {
                            effect: 'fadeIn',
                            delay: 3,
                            shuffle: true
                        }
                    } );

                }
            })

        },
        _init = function () {
            _onEvents();
            _checkScroll();
        };

    //public properties

    //public methods

    _init();
};

var Slides = function ( obj ) {

    //private properties
    var _self = this,
        _obj = obj,
        _window = $( window );

    //private methods
    var _onEvents = function () {
            _window.on({
                scroll: function () {

                    _checkScroll();

                }
            });
        },
        _checkScroll = function(){

            var windowH = _window.height();

            _obj.each(function () {

                var curItem = $(this),
                    topPos = _obj.offset().top;

                if( _window.scrollTop() > (topPos - windowH/1.3) && !curItem.hasClass( 'animation' ) ){

                    curItem.addClass( 'animation' );

                }
            })
        },
        _init = function () {
            _obj[0].slides = _self;
            _onEvents();
            _checkScroll();
        };

    //public properties

    //public methods

    _init();
};