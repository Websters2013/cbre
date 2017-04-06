( function(){

    "use strict";

    $( function(){

        $.each( $( '.site__section-scenes' ), function() {
            new Page ( $( this ) );
        } );

        $.each( $( '.services' ), function() {
            new Sliders( $( this ) );
        } );

        $.each( $( '.references' ), function() {
            new ReferencesAnimare( $( this ) );
        } );

        $.each( $( '.news' ), function() {
            new NewsAnimare( $( this ) );
        } );

    } );

    var Page = function( obj ) {

        //private properties
        var _obj = obj,
            _window = $( window ),
            _scrollConteiner = $( 'html' ),
            _sceneItem = _obj.find( '.site__scene-item' ),
            _sceneFirstItem = _obj.find( '.site__first-scene' ),
            _sceneSecondItem = _obj.find( '.site__second-scene' ),
            _sceneSwipeItem = _obj.find( '.site__third-scene' ),
            _swipeItem = _sceneSwipeItem.find( '.services__item' ),
            _site = $( '.site' ),
            _header = _site.find( '.site__header' ),
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
                                _indicatorSwiper.turnOn();
                                return false;
                            }, 1000 );
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
            _animateMainElement = function () {

                _site.addClass( 'animate' );

            },
            _animateSwiper = function () {

                var curItem = _swipeItem.filter( '.swiper-slide-active' );

                curItem.addClass( 'animate-slide' );

                curItem.find( '.tlt' ).textillate( {
                    in: {
                        effect: 'fadeIn',
                        delay: 3,
                        shuffle: true
                    }
                } );

                curItem.find( '.tlt-btn' ).textillate( {
                    initialDelay: 200,
                    in: {
                        effect: 'fadeIn',
                        delay: 50,
                        shuffle: true
                    }
                } );

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
                        _checkSecondScene();

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
                        _checkSecondScene();

                    } );

                } else {

                    _hideScenes();
                    _sceneActive = true;
                    return false;

                }

            },
            _checkSwiperActive = function () {

                if ( _sceneSwipeItem.hasClass( 'active' ) ){

                    _sceneSwipeItem.addClass( 'animate-scene' );

                    _indicator.turnOff();

                    _indicatorSwiper = new WheelIndicator( {
                        elem: document.querySelector( '.site__third-scene' ),
                        callback: function( e ){

                            var directionY = ( e.direction == 'up' ) ? -1 : 1;

                            _checkSwiperScroll( directionY );

                        }
                    } );
                    _indicatorSwiper.getOption( 'preventMouse' );

                    _animateSwiper();

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

                if ( curElem.index() < lengthItems ) {

                    curElem.each( function () {

                        $( '.services__swipe' )[0].swiper.slideNext( false, 300 );
                        _animateSwiper();

                    } );

                } else {

                    _indicatorSwiper.turnOff();
                    _indicator.turnOn();

                }

            },
            _checkSecondScene = function () {

                if ( _sceneSecondItem.hasClass( 'active' ) ){

                    _sceneSecondItem.find( '.tlt' ).textillate( {
                        in: {
                            effect: 'fadeIn',
                            delay: 3,
                            shuffle: true
                        }
                    } );

                    _sceneSecondItem.find( '.tlt-btn' ).textillate( {
                        initialDelay: 200,
                        in: {
                            effect: 'fadeIn',
                            delay: 50,
                            shuffle: true
                        }
                    } );

                }

            },
            _checkHeader = function () {

                if ( !( _sceneFirstItem.hasClass( 'active' ) ) ){

                    _header.addClass( 'minimize' )

                } else {

                    _header.removeClass( 'minimize' )

                }

            },
            _hideScenes = function () {
                _obj.addClass( 'hide' );
                _indicator.turnOff();
                _sceneActive = false;
                _scrollConteiner.css( {
                    overflowY: 'auto',
                    paddingRight: 0
                } );
                _header.css( {
                    paddingRight: 0
                } );
            },
            _hidePageScroll= function () {
                _scrollConteiner.css( {
                    overflowY: 'hidden',
                    paddingRight: _getScrollWidth()
                } );
                _header.css( {
                    paddingRight: _getScrollWidth()
                } );
            },
            _construct = function() {
                _animateMainElement();
                _hidePageScroll();
                _onEvent();
            };

        //public properties

        //public methods

        _construct();
    };

    var ReferencesAnimare = function( obj ) {

        //private properties
        var _obj = obj,
            _objTop = _obj.offset().top,
            _window = $( window );

        //private methods
        var _onEvent = function(){
                _window.on( {
                    'scroll': function () {

                        if ( ( _window.scrollTop() + _window.height() / 2 ) >= _objTop ){
                            _obj.addClass( 'animate-block' )
                        }

                    }
                } );
            },
            _construct = function() {
                _onEvent();
            };

        //public properties

        //public methods

        _construct();
    };

    var NewsAnimare = function( obj ) {

        //private properties
        var _obj = obj,
            _objTop = _obj.offset().top,
            _window = $( window );

        //private methods
        var _onEvent = function(){
                _window.on( {
                    'scroll': function () {

                        if ( ( _window.scrollTop() + _window.height() / 2 )  >= _objTop ){
                            _obj.addClass( 'animate-block' )
                        }

                    }
                } );
            },
            _construct = function() {
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