define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer",
    "zeega_parser/plugins/media-player/media-player"

],
function( Zeega, _Layer, MediaPlayer ) {

    var Layer = Zeega.module();

    Layer.Popup = _Layer.extend({

        layerType: "Popup",

        attr: {
            citation: false,
            default_controls: true,
            left: 30,
            opacity: 1,
            pauses_player: true,
            title: "Popup Layer",
            top: 40,
            width: 25
        }
    });

    Layer.Popup.Visual = _Layer.Visual.extend({

        template: "plugins/popup",

        serialize: function() {
            return this.model.toJSON();
        },

        events: {
            "click .ZEEGA-popup-click-target": "popLayer"
        },

        popLayer: function() {
            if ( this.model.get("attr").popup_content ) {
                this.popup = new PopupOverlay({
                    model: this.model,
                    template: "plugins/popup-" + this.model.get("attr").popup_content.media_type.toLowerCase()
                });
                // append to the player layout because the popup needs to live inside the player but also above all layers
                this.model.status.get("project").Layout.$el.append( this.popup.el );
                this.popup.render();
                this.model.on("popup_remove", this.popupClosed, this );
                // pause the player
                this.model.status.get("project").pause();
            }
        },

        popupClosed: function() {
            this.model.status.get("project").play();
        },

        onExit: function() {
            if ( this.popup ) {
                this.popup.removePopup();
            }
        }

    });


    var PopupOverlay = _Layer.LayoutView.extend({

        className: "ZEEGA-popup-overlay",

        serialize: function() {
            return this.model.toJSON();
        },

        afterRender: function() {
            if ( this.model.get("attr").popup_content.media_type == "Video" ) {
                var modelAttr = _.extend({}, this.model.toJSON().attr.popup_content, { attr: this.model.toJSON().attr.popup_content } ),
                    model = new Zeega.Backbone.Model( modelAttr );
                this.mediaPlayer = new MediaPlayer.Views.Player({
                    model: model,
                    control_mode: "none"
                });
                this.$(".popup-video").append( this.mediaPlayer.el );
                this.mediaPlayer.render();
                this.mediaPlayer.placePlayer();

                // autoplay
                model.on("visual_ready", function() {
                    this.mediaPlayer.play();
                }.bind( this ));
            }
        },

        events: {
            "click": "closeOverlay",
            "click a": "closeOverlay"
        },

        closeOverlay: function() {
            this.removePopup();
            this.model.trigger("popup_remove");
            return false;
        },

        removePopup: function() {
            if( this.mediaPlayer ) {
                this.mediaPlayer.destroy();
            }
            this.remove();
        }

    });

  return Layer;
});
