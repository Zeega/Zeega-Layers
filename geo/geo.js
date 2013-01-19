define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer",
    //plugins
    "plugins/jquery.imagesloaded.min"
],

function( Zeega, _Layer ){

    var Layer = Zeega.module();

    Layer.Geo = _Layer.extend({

        layerType: "Geo",

        attr: {
            title: "Streetview Layer",
            url: null,
            left: 0,
            top: 0,
            height: 100,
            width: 100,
            opacity: 1,
            aspect: 1.33,

            // streetview specific
            lat: 42.373613,
            lng: -71.119146,
            zoom: 10,
            streetZoom: 1,
            heading: -235,
            pitch: 17.79,
            mapType: 'satellite'
        },

        controls: []
    });

    Layer.Geo.Visual = _Layer.Visual.extend({

        streetview: null,

        template: "plugins/geo",

        // dynamically load the google maps api only once!
        initialize: function() {
            if ( Zeega.gmapAPI == "waiting" ) {
                Zeega.gmapAPI = "loading";

                window._gmapAPIReady = function() {
                    Zeega.gmapAPI = "loaded";
                    Zeega.trigger("gmaps_loaded");
                }.bind( this );

                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=_gmapAPIReady";
                document.body.appendChild(script);
            }
        },

        serialize: function() {
            return this.model.toJSON();
        },

        verifyReady: function() {
            if ( Zeega.gmapAPI == "loaded" ) {
                this.renderStreetView();
                this.model.trigger( "visual_ready", this.model.id );
            } else {
                Zeega.on("gmaps_loaded", function() {
                    Zeega.off("gmaps_loaded");
                    this.renderStreetView();
                    this.model.trigger( "visual_ready", this.model.id );
                }.bind( this ));
            }
        },

        renderStreetView: function() {
            var center = new google.maps.LatLng( this.model.get("attr").lat, this.model.get("attr").lng ),
                panoOptions = {
                    addressControl : false,
                    disableDoubleClickZoom : false,
                    panControl : false,
                    panControlOptions : false,
                    position : center,
                    pov : {
                        heading: this.model.get("attr").heading,
                        pitch: this.model.get("attr").pitch,
                        zoom: this.model.get("attr").streetZoom
                    },
                    zoomControl :false
                };
            
            this.streetview = new google.maps.StreetViewPanorama( this.$el[0], panoOptions );
            //this.initMapListeners(); // not needed for the player. EDITOR ONLY !!
        },

        initMapListeners: function() {
            google.maps.event.addListener( this.streetview, "position_changed", function(){
                delayedUpdate();
            });

            google.maps.event.addListener( this.streetview, "pov_changed", function(){
                delayedUpdate();
            });

            // need this so we don't spam the servers
            var delayedUpdate = _.debounce( function(){
                var a = this.model.get("attr");
                
                if ( a.heading != this.streetview.getPov().heading || a.pitch != this.streetview.getPov().pitch || a.streetZoom != this.streetview.getPov().zoom || Math.floor( a.lat * 1000 ) != Math.floor( this.streetview.getPosition().lat() * 1000 ) || Math.floor( a.lng * 1000 ) != Math.floor( this.streetview.getPosition().lng() * 1000 ) ) {
                    this.model.update({
                        heading: this.streetview.getPov().heading,
                        pitch: this.streetview.getPov().pitch,
                        streetZoom: Math.floor( this.streetview.getPov().zoom ),
                        lat: this.streetview.getPosition().lat(),
                        lng: this.streetview.getPosition().lng()
                    }, true );
                }
                
            }.bind( this ) , 1000);
        }

    });

    return Layer;
});
