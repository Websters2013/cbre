( function(){

    "use strict";

    $( function(){

        $.each( $( '.site__section-scenes' ), function() {
            new Page ( $( this ) );
        } );

        $.each( $( '.services' ), function() {
            new Sliders( $( this ) );
        } );

        $.each( $( '.slides' ), function() {
            new Slides( $( this ) );
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
            _firstSlide = true,
            _canScroll = true,
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
                            _canScroll = true;
                            _hidePageScroll();
                        } else {
                            setTimeout( function () {
                                _sceneActive = true;
                                return false;
                            }, 400 );
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

                        if( !_canScroll ){
                            return false;
                        } else {
                            _checkScroll( directionY );
                            _canScroll = false;
                        }

                    }
                } );
                _indicator.getOption( 'preventMouse' );

                _indicatorSwiper = new WheelIndicator( {
                    elem: document.querySelector( '.site__third-scene' ),
                    callback: function( e ){

                        var directionY = ( e.direction == 'up' ) ? -1 : 1;

                        if( !_canScroll ){
                            return false;
                        } else {
                            _checkSwiperScroll( directionY );
                            _canScroll = false;
                        }

                    }
                } );
                _indicatorSwiper.getOption( 'preventMouse' );
                _indicatorSwiper.turnOff();
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
                if ( direction > 0 && _canScroll ){
                    _checkSceneDown();
                }
                else if ( direction < 0 && _canScroll && _window.scrollTop() == 0 ) {
                    _checkSceneUp();
                }
            },
            _checkSceneUp = function () {

                var curElem = _sceneItem.filter( '.active' );

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

                setTimeout( function () {
                    _canScroll = true;
                }, 400 )

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

                }

                _showCircles();

                setTimeout( function () {
                    _canScroll = true;
                }, 400 )

            },
            _checkSwiperActive = function () {

                if ( _sceneSwipeItem.hasClass( 'active' ) ){

                    _canScroll = false;

                    _sceneSwipeItem.addClass( 'animate-scene' );

                    _animateSwiper();

                    _indicatorSwiper.turnOn();

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

                    if ( curElem.index() == 1 ){
                        _canScroll = true;
                        _indicatorSwiper.turnOff();
                        _indicator.turnOn();
                        _firstSlide = true;
                    }

                }

                setTimeout( function () {
                    _canScroll = true;
                }, 300 )

            },
            _checkSwiperDown = function () {

                var curElem = _swipeItem.filter( '.swiper-slide-active' ),
                    lengthItems = _sceneItem.length;

                if ( curElem.index() < lengthItems && !_firstSlide ) {

                    curElem.each( function () {

                        $( '.services__swipe' )[0].swiper.slideNext( false, 300 );
                        _animateSwiper();

                    } );

                } else if ( !_firstSlide ) {
                    _canScroll = true;
                    _hideScenes();
                } else if ( _firstSlide ) {
                    _firstSlide = false;
                }

                setTimeout( function () {
                    _canScroll = true;
                }, 300 )

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
                $( '.references' ).addClass( 'animation' );
                _indicator.turnOff();
                _indicatorSwiper.turnOff();
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
            _getScrollWidth = function (){
                var scrollDiv = document.createElement( 'div'),
                    scrollBarWidth;

                scrollDiv.className = 'site__scrollbar-measure';

                document.body.appendChild( scrollDiv );

                scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

                document.body.removeChild(scrollDiv);

                return scrollBarWidth;
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

    var Slides = function ( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _window = $( '.site' );

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

    var Sliders = function( obj ) {

        //private properties
        var _obj = obj,
            _servicesSlider = _obj.find( '.services__swipe' ),
            _servicesPagination = _obj.find( '.services__pagination' ),
            _servicesItem = _obj.find( '.services__item' ),
            _window = $( window ),
            _initFlag = false,
            _services;

        //private methods
        var _initSlider = function() {

                if ( _window.width() < 1200  || _initFlag ) {
                    return false
                }

                _initFlag = true;

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

                _window.on(
                    'resize', function () {

                        if ( _window.width() < 1200 && !_initFlag ) {

                            _initSlider();

                            _initFlag = true;

                        } else if ( _window.width() >= 1200 && _initFlag ) {

                            _services.destroy( true, true );

                            _initFlag = false;

                        }

                    }
                )

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