
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
                    styles: [
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#e9e9e9"
                                },
                                {
                                    "lightness": 17
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#f5f5f5"
                                },
                                {
                                    "lightness": 20
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 17
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 29
                                },
                                {
                                    "weight": 0.2
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 18
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 16
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#f5f5f5"
                                },
                                {
                                    "lightness": 21
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#dedede"
                                },
                                {
                                    "lightness": 21
                                }
                            ]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 16
                                }
                            ]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "saturation": 36
                                },
                                {
                                    "color": "#333333"
                                },
                                {
                                    "lightness": 40
                                }
                            ]
                        },
                        {
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#f2f2f2"
                                },
                                {
                                    "lightness": 19
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#fefefe"
                                },
                                {
                                    "lightness": 20
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#fefefe"
                                },
                                {
                                    "lightness": 17
                                },
                                {
                                    "weight": 1.2
                                }
                            ]
                        }
                    ]
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
