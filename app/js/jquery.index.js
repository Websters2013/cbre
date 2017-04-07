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
            _scrollConteiner = $( '.site' ),
            _sceneItem = _obj.find( '.site__scene-item' ),
            _sceneFirstItem = _obj.find( '.site__first-scene' ),
            _sceneSecondItem = _obj.find( '.site__second-scene' ),
            _sceneSwipeItem = _obj.find( '.site__third-scene' ),
            _swipeItem = _sceneSwipeItem.find( '.services__item' ),
            _header = _scrollConteiner.find( '.site__header' ),
            _heroSkip = _sceneFirstItem.find( '.hero__skip' ),
            _indicator,
            _indicatorSwiper,
            _sceneActive = true;

        //private methods
        var _onEvent = function(){
                _window.on( {
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
                _scrollConteiner.on( {
                    'scroll': function () {

                        if ( _scrollConteiner.scrollTop() == 0 && _sceneActive ){
                            _obj.removeClass( 'hide' );
                            _indicatorSwiper.turnOn();
                            _hidePageScroll();
                        } else {
                            setTimeout( function () {
                                _sceneActive = true;
                                return false;
                            }, 1000 );
                        }

                    }
                } );
                _heroSkip.on( {
                    'click': function () {
                        _checkScroll( 1 );
                        return false;
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

                _scrollConteiner.addClass( 'animate' );

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
            _checkScroll = function ( direction ) {
                if ( direction > 0 ){
                    _checkSceneDown();
                }
                else if ( direction < 0 && _window.scrollTop() == 0 ) {
                    _checkSceneUp();
                }
            },
            _checkSceneUp = function () {

                var curElem = _sceneItem.filter( '.active' );

                console.log( curElem.data( 'index' ) )

                if ( curElem.data( 'index' ) - 1 >= 1 ) {

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

                if ( curElem.data( 'index' ) < lengthItems ) {

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

                _showCircles();

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
                if ( direction > 0 ){
                    _checkSwiperDown();
                }
                else if ( direction < 0 ) {
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
            _showCircles = function () {

                _scrollConteiner.addClass( 'show-circles' )

            },
            _hideScenes = function () {
                _obj.addClass( 'hide' );
                _indicator.turnOff();
                _sceneActive = false;
                _scrollConteiner.css( {
                    overflowY: 'auto'
                } );
            },
            _hidePageScroll= function () {

                _scrollConteiner.css( {
                    overflowY: 'hidden'
                } );

            },
            _construct = function() {

                if ( _window.outerWidth() >= 1200 ) {

                    _hidePageScroll();
                    _animateMainElement();
                    _onEvent();

                }

            };

        //public properties

        //public methods

        _construct();
    };

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

                if ( ( _window.scrollTop() + _window.height() / 2 ) >= _objTop ){
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

    var NewsAnimare = function( obj ) {

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

                if ( ( _window.scrollTop() + _window.height() / 2 )  >= _objTop ){
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

    var Sliders = function( obj ) {

        //private properties
        var _obj = obj,
            _servicesSlider = _obj.find( '.services__swipe' ),
            _servicesPagination = _obj.find( '.services__pagination' ),
            _servicesItem = _obj.find( '.services__item' ),
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
                    paginationClickable: true,
                    onSlideChangeStart: function () {
                        var curItem = _servicesItem.filter( '.swiper-slide-active' );

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
                    }
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