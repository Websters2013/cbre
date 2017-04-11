( function(){

    $( function(){

        $.each( $( '.references' ), function() {
            new ReferencesAnimate( $( this ) );
        } );

        $( function(){

            $.each( $( '.popup__object' ), function() {
                new ReferencesLoader ( $( this ) );
            } );

        } );

    } );

    var ReferencesAnimate = function( obj ) {

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

    var ReferencesLoader = function( obj ) {

        //private properties
        var _obj = obj,
            _wrap = $( '.references' ),
            _btn = $( '.references__item' ),
            _title = _obj.find( '.object__title' ),
            _area = _obj.find( '.object__area' ),
            _town = _obj.find( '.object__town' ),
            _swiper = _obj.find( '.object__swiper' ),
            _frame = _obj.find( '.object__frame' ),
            _linkPrev = _obj.find( '.object__links-prev' ),
            _linkNext = _obj.find( '.object__links-next' ),
            _data;

        //private methods
        var _onEvent = function(){
                _btn.on( {
                    'click': function () {

                        var curLink = $( this ).data( 'link' ),
                            curId = $( this ).data( 'id' );

                        _setPopup( curLink, curId );

                    }
                } );
            },
            _setPopup = function ( link, id ) {

                $.getJSON( link, function( kml ) {

                    _data = kml[0];

                    _title.html( _data.title );
                    _area.html( _data.area +' m²' );
                    _town.html( _data.town );

                    var swiperWrap = $( '<div class="swiper-wrapper"></div>' ),
                        swiperItem = $( '<div class="object__item swiper-slide"><img src="pic/img-021.jpg" alt="img"/></div>' );

                    for( var i = 0; _data.img.length > i; i++ ){

                        var curPicture = _data.img[i];

                        swiperWrap.append( '<div class="object__item swiper-slide"><img src="'+ curPicture +'" alt="img"/></div>' )

                    }

                    _swiper.append( swiperWrap );

                    $.each( _frame, function() {
                        new Sliders ( $( this ) );
                    } );

                    _linkPrev.attr( 'data-id', id - 1 );
                    _linkPrev.find( 'span' ).text( _wrap.find( '._btn' ).filter( 'data-id='+ id - 1 ).find( '.references__topic p' ).html() );

                    _linkNext.attr( 'data-id', id + 1 );

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
            _gallerySlider = _obj.find( '.object__swipe' ),
            _galleryPrev = _obj.find( '.object__button-prev' ),
            _galleryNext = _obj.find( '.object__button-next' ),
            _galleryPaginator = _obj.find( '.object__pagination'),
            _gallery;

        //private methods
        var _initSlider = function() {

                _gallery = new Swiper ( _gallerySlider, {
                    autoplay: false,
                    speed: 500,
                    effect: 'slide',
                    slidesPerView: 1,
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    nextButton: _galleryNext,
                    prevButton: _galleryPrev,
                    pagination: _galleryPaginator,
                    paginationClickable: true
                } );

            },
            _onEvent = function() {

            },
            _constructor = function() {
                _initSlider();
                _onEvent();
            };

        //public properties

        //public methods

        _constructor();
    };

} )();