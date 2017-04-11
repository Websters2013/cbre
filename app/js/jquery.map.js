
( function() {
    "use strict";

    $( function() {

        $.each( $( '.contacts__maps-map' ), function() {

            new Map ( $( this ) );

        } );

    });

    var Map = function ( obj ) {

        this.obj = obj;
        this.mapWrap = this.obj;

        //private properties
        var _self = this,
            _map,
            _markers = [],
            _mapWrap = $( '.contacts__map' ),
            _addressItems = _mapWrap.find( '.contacts__map-item' ),
            _addressBtns = _addressItems.find( '.contacts__map-item-title' ),
            _addressInfo = _addressItems.find( '.contacts__map-item-inner' ),
            _data = JSON.parse( this.mapWrap.attr( 'data-map' ) ).marks,
            _zoom = JSON.parse( this.mapWrap.attr( 'data-map' ) ).zoom,
            _icon;

        //private methods
        var _constructor = function () {
                google.maps.event.addDomListener(window, 'load', _initMap);
                _onEvents();
            },
            _initMap = function () {

                var mapOptions = {
                    zoom: _zoom,
                    scrollwheel: false,
                    styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
                };

                _map = new google.maps.Map( _self.mapWrap[0], mapOptions );
                _setMarkers( _map );

            },
            _checkActiveAddress = function () {

                var curItem = _addressItems.filter( '.active' ),
                    curBtn = curItem.find( '.contacts__map-item-title' ),
                    country = curBtn.data( 'country' ),
                    curInfo = curItem.find( '.contacts__map-item-inner' );

                curInfo.show();

                _setCenterMap( country )

            },
            _choiceAddress = function ( elem ) {

                var curBtn = elem,
                    curParent = curBtn.parents( '.contacts__map-item' ),
                    addressInfo = curBtn.next( '.contacts__map-item-inner' ),
                    country = curBtn.data( 'country' );

                if ( !curParent.hasClass( 'active' ) ) {

                    _addressItems.removeClass( 'active' );
                    curParent.addClass( 'active' );
                    _addressInfo.slideUp( 200 );
                    addressInfo.slideDown( 200 );
                }

                _setCenterMap( country )

            },
            _onEvents = function () {

                _addressBtns.on({
                    click: function () {

                        _choiceAddress( $( this ) )
                    }
                });

            },
            _setCenterMap = function ( country ) {

                for ( var i = 0; i < _markers.length; i++ ) {

                     if ( _markers[ i ][ 'country' ] == country ) {

                         _map.panTo(_markers[ i ].getPosition());

                     }
                 }

            },
            _setMarkers = function ( map ) {

                $.each(_data, function ( i ) {

                    var curItem = this,
                        curLatLng = new google.maps.LatLng( curItem.poi_latitude, curItem.poi_longitude );

                    _markers[ i ] = new google.maps.Marker( {
                        position: curLatLng,
                        map: map,
                        clickable: false,
                        animation: google.maps.Animation.DROP,
                        icon: {
                            url: _icon ? _icon : 'img/map_marker.png',
                            scaledSize: new google.maps.Size( 30, 42 )
                        },
                        country: curItem.country
                    } );

                });
                _checkActiveAddress();
            };

        _constructor();
    };

} )();
