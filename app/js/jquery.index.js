( function(){

    "use strict";

    $( function(){

        $.each( $( '.site__section-scenes' ), function() {
            new Page ( $( this ) );
        } );

        $.each( $( '.services' ), function() {
            new Sliders( $( this ) );
        } );

        $.each( $( '.site__mobile' ), function() {
            new Menu( $( this ) );
        } );

    } );

    var Menu = function( obj ){

        //private properties
        var _obj = obj,
            _self = this,
            _btn = $( '.mobile-menu-btn' );

        //private methods
        var _constructor = function(){
                _onEvents();
            },
            _onEvents = function(){

                _btn.on( 'click', function() {

                    if ( $( this).hasClass( 'close' ) ){
                        _closeMenu();
                    } else {
                        _openMenu();
                    }

                } );

                _obj[ 0 ].obj = _self;

            },
            _openMenu = function(){
                _btn.addClass( 'close' );
                _obj.addClass( 'visible' );
            },
            _closeMenu = function(){
                _btn.removeClass( 'close' );
                _obj.removeClass( 'visible' );
            };

        //public properties
        _self.opened = false;

        //public methods

        _constructor();

    };

    var Page = function( obj ) {

        //private properties
        var _obj = obj,
            _window = $( window ),
            _scrollConteiner = $( 'html' ),
            _sceneItem = _obj.find( '.site__scene-item' ),
            _sceneFirstItem = _obj.find( '.site__first-scene' ),
            _sceneSwipeItem = _obj.find( '.site__third-scene' ),
            _swipeItem = _sceneSwipeItem.find( '.services__item' ),
            _header = $( '.site__header' ),
            _indicator,
            _indicatorSwiper,
            _canScroll = false,
            _sceneActive = true,
            _menu = new Menu( $('.menu') );

        //private methods
        var _onEvent = function(){
                _window.on( {
                    'scroll': function () {

                        if ( _window.scrollTop() == 0 && _sceneActive ){
                            _obj.removeClass( 'hide' );
                            _hidePageScroll();
                        } else {

                            setTimeout( function () {
                                _sceneActive = true;
                                _indicator.turnOn();
                                return false;
                            }, 500 );

                        }

                    },
                    'keydown': function ( e ) {
                        switch( e.which ) {

                            case 32:
                                _checkScroll( 1 );
                                break;
                            case 33:
                                _checkScroll( -1 );
                                break;
                            case 34 :
                                _checkScroll( 1 );
                                break;
                            case 35 :
                                _checkScroll( 1 );
                                break;
                            case 36 :
                                _checkScroll( -1 );
                                break;
                            case 38:
                                _checkScroll( -1 );
                                break;
                            case 40:
                                _checkScroll( 1 );
                                break;

                            default:
                                return;
                        }
                    }
                } );
                _indicator = new WheelIndicator( {
                    elem: document.querySelector( '.site__section-scenes' ),
                    callback: function( e ){

                        var directionY = ( e.direction == 'up' ) ? -1 : 1;

                        _checkScroll( directionY );

                    }
                } );
                _indicator.getOption( 'preventMouse' );
            },
            _getScrollWidth = function (){
                var scrollDiv = document.createElement( 'div'),
                    scrollBarWidth;

                scrollDiv.className = 'scroll__scrollbar-measure';

                document.body.appendChild( scrollDiv );

                scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

                document.body.removeChild(scrollDiv);

                return scrollBarWidth;
            },
            _checkScroll = function ( direction ) {
                if ( direction > 0 && !_menu.opened ){
                    _checkSceneDown();
                }
                else if ( direction < 0 && _window.scrollTop() == 0 && !_menu.opened ) {
                    _checkSceneUp();
                }
            },
            _checkSceneUp = function () {

                var curElem = _sceneItem.filter( '.active' );

                if ( curElem.index() >= 1 ) {

                    curElem.each( function () {
                        $( this ).prev().removeClass( 'prev' );
                        $( this ).prev().addClass( 'active' );
                        $( this ).removeClass( 'active' );

                        _checkSwiperActive();
                        _checkHeader();

                    } );

                }

            },
            _checkSceneDown = function () {

                var curElem = _sceneItem.filter( '.active' ),
                    lengthItems = _sceneItem.length;

                if ( curElem.index() + 1 < lengthItems ) {

                    curElem.each( function () {

                        $( this ).next().addClass( 'active' );
                        $( this ).addClass( 'prev' );
                        $( this ).removeClass( 'active' );

                        _checkHeader();
                        _checkSwiperActive();

                    } );

                } else {

                    _hideScenes();

                }

            },
            _checkSwiperActive = function () {

                if ( _sceneSwipeItem.hasClass( 'active' ) ){

                    _indicator.turnOff();

                    _indicatorSwiper = new WheelIndicator( {
                        elem: document.querySelector( '.site__third-scene' ),
                        callback: function( e ){

                            var directionY = ( e.direction == 'up' ) ? -1 : 1;

                            _checkSwiperScroll( directionY );

                        }
                    } );
                    _indicatorSwiper.getOption( 'preventMouse' );


                    return false
                }

            },
            _checkSwiperScroll = function ( direction ) {
                if ( direction > 0 && !_menu.opened ){
                    _checkSwiperDown();
                }
                else if ( direction < 0 && !_menu.opened ) {
                    _checkSwiperUp();
                }
            },
            _checkSwiperUp = function () {

                var curElem = _swipeItem.filter( '.swiper-slide-active' );

                console.log( curElem.index() );

                if ( curElem.index() >= 1 ) {

                    $( '.services__swipe' )[0].swiper.slidePrev( false, 300 );

                } else if ( curElem.index() == 0 ) {

                    _indicatorSwiper.turnOff();
                    _indicator.turnOn();

                }

            },
            _checkSwiperDown = function () {

                var curElem = _swipeItem.filter( '.swiper-slide-active' ),
                    lengthItems = _sceneItem.length;

                if ( curElem.index() + 1 < lengthItems ) {

                    curElem.each( function () {

                        $( '.services__swipe' )[0].swiper.slideNext( false, 300 );

                    } );

                } else {

                    _indicatorSwiper.turnOff();
                    _indicator.turnOn();

                }

            },
            _checkHeader = function () {

                if ( !( _sceneFirstItem.hasClass( 'active' ) ) ){

                    _header.addClass( 'minimize' )

                }

            }
            _hideScenes = function () {
                _obj.addClass( 'hide' );
                _indicator.turnOff();
                _sceneActive = false;
                _scrollConteiner.css( {
                    overflowY: 'auto',
                    paddingRight: 0
                } );
            },
            _hidePageScroll= function () {
                _scrollConteiner.css( {
                    overflowY: 'hidden',
                    paddingRight: _getScrollWidth()
                } );
            },
            _construct = function() {
                _hidePageScroll();
                _onEvent();
            };

        //public properties

        //public methods

        _construct();
    };

    var Sliders = function( obj ) {

        //private properties
        var _obj = obj,
            _servicesSlider = _obj.find( '.services__swipe' ),
            _servicesPagination = _obj.find( '.services__pagination' ),
            _services;

        //private methods
        var _initSlider = function() {

                _services = new Swiper ( _servicesSlider, {
                    autoplay: false,
                    speed: 500,
                    effect: 'fade',
                    slidesPerView: 1,
                    loop: false,
                    pagination: _servicesPagination,
                    paginationClickable: true
                } );

            },
            _onEvent = function() {

            },
            _init = function() {
                _initSlider();
                _onEvent();
            };

        //public properties

        //public methods

        _init();
    };

} )();