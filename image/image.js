define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer",
    //plugins
    "plugins/jquery.imagesloaded.min"
],

function( Zeega, _Layer ){

    var Layer = Zeega.module();

    Layer.Image = _Layer.extend({

        layerType: "Image",

        attr: {
            "title": "Image Layer",
            "url": "none",
            "left": 0,
            "top": 0,
            "height": 100,
            "width": 100,
            "opacity": 1,
            "aspect": 1.33
        },

        controls: [
            {
                type: "checkbox",
                property: "dissolve",
                label: "Fade In"
            },
            {
                type: "slider",
                property: "width",
                label: "Scale",
                suffix: "%",
                min: 1,
                max: 200
            },
            {
                type: "slider",
                property: "opacity",
                label: "Scale",
                step: 0.01,
                min: 0.05,
                max: 1
            }
        ]
    });

    Layer.Image.Visual = _Layer.Visual.extend({

        template: "plugins/image",

        serialize: function() {
            return this.model.toJSON();
        },

        verifyReady: function() {
            var img = Zeega.$( this.$el ).imagesLoaded();

            img.done(function() {
                this.model.trigger( "visual_ready", this.model.id );
            }.bind(this));

            img.fail(function() {
                this.model.trigger( "visual_error", this.model.id );
            }.bind(this));
        }
    });

    return Layer;
});
