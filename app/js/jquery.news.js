( function(){

    "use strict";

    $( function(){

        $.each( $( '.latest-news' ), function() {
            new NewsLoader ( $( this ) );
        } );

    } );

    var NewsLoader = function( obj ) {

        //private properties
        var _obj = obj,
            _catalogWrap = _obj.find( '.latest-news__catalog' ),
            _window = $( window ),
            _load = true,
            _data;

        //private methods
        var _onEvent = function(){

                _window.on( {
                    scroll: function() {
                        if ( ( _window.scrollTop() + _window.height() >= _catalogWrap.offset().top + _catalogWrap.height() - 10 ) && _load ) {

                            _load = false;
                            _setList();

                        }
                    }
                });

            },
            _setList = function () {

                _obj.addClass( 'load' );

                $.getJSON('php/news.json', function( kml ) {

                    _data = kml;

                    var num = _catalogWrap.find( '.latest-news__item' ).length;

                    for ( var i = num; i < num+1; i++ ) {

                        if ( _data[i] == undefined ){
                            return false;
                        }

                        var curData = _data[i];

                        _setItem( curData );

                    };

                } );

                _load = true;
                _obj.removeClass( 'load' );

            },
            _setItem = function ( data ) {

                var curData = data,
                    item = $( '<div class="latest-news__item slides"></div>' ),
                    imgContent = $( '<div class="latest-news__img"></div>' ),
                    date = curData.date,
                    dateObj = date.split( '-' ),
                    img = curData.image,
                    title = curData.title,
                    content = curData.content,
                    link = curData.link,
                    itemInfo = $( '<div class="latest-news__info"></div>' ),
                    itemContent = $( '<div class="latest-news__content"></div>' ),
                    imgObj = $( '<img src="'+ img +'" alt="'+ title +'"/>' ),
                    timeObj = $( '<time class="latest-news__data" datetime="'+ date +'"><span>'+ dateObj[2] +'</span> '+ dateObj[1] +'</time>' ),
                    yearObj = $( '<span class="latest-news__year">'+ dateObj[0] +'</span>' );

                imgContent.html( imgObj );

                itemInfo.append( imgContent );
                itemInfo.append( timeObj );
                itemInfo.append( yearObj );

                itemContent.append( '<h2>'+ title +'</h2>' );
                itemContent.append( '<p>'+ content +'</p>' );
                itemContent.append( '<a href="'+ link +'" class="latest-news__more">Read more</a>' );

                item.append( itemInfo );
                item.append( itemContent );

                if ( _catalogWrap.find( '.latest-news__item' ).length <= 0 ) {
                    _catalogWrap.html( item );
                } else {
                    _catalogWrap.append( item );
                }

                $.each( $( '.slides' ), function() {
                    new Slides ( $( this ) );
                } );

            },
            _construct = function() {

                _setList();
                _onEvent();

            };

        //public properties

        //public methods

        _construct();
    };

} )();