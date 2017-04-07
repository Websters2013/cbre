"use strict";
( function(){

    $( function () {

        $.each( $( '.validation-form' ), function() {

            new FormValidator ( $( this ) );

        } );

    } );

    var FormValidator = function (obj) {

        //private properties
        var _self = this,
            _obj = obj,
            _fields = _obj.find( '[data-required]' ),
            _btn = _obj.find( 'button' );

        //private methods
        var _constructor = function () {

                _onEvents();
                _obj[0].obj = _self;

            },
            _addNotTouchedClass = function () {

                _fields.each( function() {

                    var curItem = $(this);

                    if( curItem.val() === '' ){

                        curItem.parent().addClass( 'not-touched' );

                        _validateField( curItem );

                    }
                } );

            },
            _onEvents = function () {
                _fields.on( {
                    focus: function() {

                        $( this ).parent().removeClass( 'not-touched' );

                    },
                    keyup: function() {

                        _validateField( $( this ) );

                    },
                    keypress: function() {

                        var type = $( this ).attr( 'type' );

                        if( type === 'tel' ){

                            if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) ) {
                                event.preventDefault();
                            }
                        }
                    }
                } );

                _btn.on( {
                    click: function() {

                        _addNotTouchedClass();

                        if( _fields.parent().hasClass('not-touched') || _fields.parent().hasClass('not-valid') ) {

                            _obj.find('.not-touched:first input').focus();
                            _obj.find('.not-valid:first input').focus();

                            return false;

                        } else {

                            return true;

                        }
                    }
                } );

            },
            _makeNotValid = function ( field ) {
                field.parent().addClass( 'not-valid' );
                field.parent().removeClass( 'valid' );
            },
            _makeValid = function ( field ) {
                field.parent().removeClass( 'not-valid' );
                field.parent().addClass( 'valid' );
            },
            _validateEmail = function ( email ) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            _validateField = function ( field ) {
                var type = field.attr( 'type' );

                if( type === 'email' || type === 'text' || type === 'tel' ){

                    if( field.val() === '' ){
                        _makeNotValid( field );
                        return false;
                    }

                }

                if( type === 'email' ){
                    if( !_validateEmail( field.val() ) ){
                        _makeNotValid( field );
                        return false;
                    }
                }

                _makeValid( field );
            };

        //public properties

        //public methods
        _self.checkValid = function () {
            var valid = true;

            _fields.each( function () {
                $( this ).parent().removeClass( 'not-touched' );
                if( $( this ).parent().hasClass( 'not-valid' ) ){
                    valid = false;

                }
            } );

            return valid;
        };

        _constructor();
    };

} )();
