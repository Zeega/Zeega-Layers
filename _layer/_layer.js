define([
    "zeega"
],

function( Zeega ) {

    _Layer = Zeega.Backbone.Model.extend({

        layerType: null,

        controls: [],

        defaultAttr: {
            citation: true,
            default_controls: true,
            draggable: true,
            has_controls: true,
            linkable: true,
            mode: "player",
            resizable: false
        },

        attr: {},

        initialize: function() {
            var attr = _.extend({}, this.defaultAttr, this.attr );
            this.set( "attr", attr );
            this.init();
        },

        init: function() {},

        player_onPreload: function() {},
        player_onPlay: function() {},
        player_onPause: function() {},
        player_onExit: function() {},
        player_onUnrender: function() {},
        player_onRenderError: function() {},

        editor_onLayerEnter: function() {},
        editor_onLayerExit: function() {},
        editor_onControlsOpen: function() {},
        editor_onControlsClosed: function() {}
    });

    _Layer.Visual = Zeega.Backbone.LayoutView.extend({

        className: "visual-element",
        template: "",

        fetch: function( path ) {
            // Initialize done for use in async-mode
            var done;
            // Concatenate the file extension.
            path = "app/templates/" + path + ".html";
            // If cached, use the compiled template.
            if ( JST[ path ] ) {
                return JST[ path ];
            } else {
                // Put fetch into `async-mode`.
                done = this.async();
                // Seek out the template asynchronously.
                return Zeega.$.ajax({ url: Zeega.root + path }).then(function( contents ) {
                    done(
                      JST[ path ] = _.template( contents )
                    );
                });
            }
        },

        serialize: function() {
            return this.model.toJSON();
        },

        initialize: function() {
            this.init();
        },

        beforePlayerRender: function() {},
        beforeRender: function() {
            var target = this.model.status.target.find(".ZEEGA-player-window");

            this.className = this._className + " " + this.className;
            this.beforePlayerRender();

            Zeega.$( target ).append( this.el );

            this.$el.addClass( "visual-element-" + this.model.get("type").toLowerCase() );
            this.moveOffStage();
            this.applyStyles();
        },

        afterRender: function() {
            this.verifyReady();
            this.onRender();
        },

        onRender: function() {},

        applyStyles: function() {
            this.$el.css({
                height: this.getAttr("height") + "%", // photos need a height!
                width: this.getAttr("width") + "%"
            });
        },

        init: function() {},
        render: function() {},

        // default verify fxn. return ready immediately
        verifyReady: function() {
            this.model.trigger("visual_ready", this.model.id );
        },

        player_onPreload: function() {
            this.render();
        },

        player_onPlay: function() {
            if ( this.getAttr("blink_on_start") ) {
                this.glowOnFrameStart();
            }
            this.onPlay();
        },

        player_onPause: function() {
            this.onPause();
        },

        player_onExit: function() {
            this.pause();
            this.moveOffStage();
            this.onExit();
        },

        player_onUnrender: function() {},
        player_onRenderError: function() {},

        onPreload: function() {},
        onPlay: function() {},
        onPause: function() {},
        onExit: function() {},


        glowOnFrameStart: function() {
            this.model.visualElement.$el.addClass("glow-blink");
            _.delay(function() {
                this.model.visualElement.$el.removeClass("glow-blink");
            }.bind( this ), 1000 );
        },

        /*
        TODO: Why is this special cased?
        if there is a need for shorthanding, then I suggest writing
        a "macro" to define many of these at initial run time:

        (function( global ) {
          var rdashAlpha = /-([\da-z])/gi,
              camelCase = function( string ) {
                return string.replace( rdashAlpha, function( all, letter ) {
                  return letter.toUpperCase();
                });
              };

          // Fake API
          global.Util = [
            // example list of properties to create shorthand setter api for
            "z-index", "background-color", "height", "width"
          ].reduce(function( api, property ) {
            var camel = camelCase( "set-" + property );

            api[ camel ] = function( value ) {
              console.log( "Set " + property + " to: " + value );
            };

            return api;
          }, {});

        }( this ));

        */
        updateZIndex: function( z ) {
            this.$el.css("z-index", z);
        },

        editor_onLayerEnter: function() {},
        editor_onLayerExit: function() {},
        editor_onControlsOpen: function() {},
        editor_onControlsClosed: function() {},

        moveOffStage: function() {
            this.$el.css({
                top: "-1000%",
                left: "-1000%"
            });
        },

        moveOnStage: function() {
            this.$el.css({
                top: this.getAttr("top") + "%",
                left: this.getAttr("left") + "%",
                opacity: this.getAttr("dissolve") ? 0 : this.getAttr("opacity") || 1
            });
            if ( this.getAttr("dissolve") ) {
                this.$el.animate({ "opacity": this.getAttr("opacity") }, 500 );
            }

        },

        play: function() {
            this.isPlaying = true;
            this.moveOnStage();
            this.player_onPlay();
        },

        pause: function() {
            this.isPlaying = false;
            this.player_onPause();
        },

        playPause: function() {
            if ( this.isPlaying !== false ) {
                this.isPlaying = false;
                this.player_onPause();
            } else {
                this.isPlaying = true;
                this.player_onPlay();
            }
        },

        // convenience fxn
        getAttr: function( key ) {
            return this.model.get("attr")[key];
        }

    });

    _Layer.LayoutView = Zeega.Backbone.LayoutView.extend({

        fetch: function( path ) {
            // Initialize done for use in async-mode
            var done;
            // Concatenate the file extension.
            path = "app/templates/"+ path + ".html";
            // If cached, use the compiled template.
            if (JST[path]) {
                return JST[path];
            } else {
                // Put fetch into `async-mode`.
                done = this.async();
                // Seek out the template asynchronously.
                return Zeega.$.ajax({ url: Zeega.root + path }).then(function( contents ) {
                    done(JST[path] = _.template( contents ));
                });
            }
        }
    });

    return _Layer;
});
