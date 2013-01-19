define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer"
],
function( Zeega, _Layer ) {

    var Layer = Zeega.module();

    Layer.Rectangle = _Layer.extend({
        // TODO: is the redundant naming necessary? If this program knows
        // this is a Layer, wouldn't "type" be sufficient?
        layerType: "Rectangle",

        attr: {
            "citation": false,
            "default_controls": false,
            "height": 50,
            "left": 25,
            "linkable": false,
            "opacity": 1,
            "opacity_hover": 1,
            "title": "Rectangle Layer",
            "top": 25,
            "width": 50
        }
    });

    Layer.Rectangle.Visual = _Layer.Visual.extend({

        template: "plugins/rectangle",

        // TODO: This doesn"t produce a "serialization", perhaps rename
        // to something more appropriate?
        serialize: function() {
            return this.model.toJSON();
        },

        beforePlayerRender: function() {
            // update the rectangle style
            var style = {
                "background-color": this.getAttr("backgroundColor"),
                "height": this.getAttr("height") + "%",
                "opacity": this.getAttr("opacity")
            };

            this.$el.css( style );
        }
  });

  return Layer;
});
