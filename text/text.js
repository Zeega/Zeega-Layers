define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer"
],
function( Zeega, _Layer ) {

    var Layer = Zeega.module();

    Layer.Text = _Layer.extend({
        // TODO: is the redundant naming necessary? If this program knows
        // this is a Layer, wouldn't "type" be sufficient?
        layerType: "Text",

        attr: {
            "citation": false,
            "default_controls": true,
            "left": 30,
            "opacity": 1,
            "title": "Text Layer",
            "top": 40,
            "width": 25
        }
    });

    Layer.Text.Visual = _Layer.Visual.extend({

        template: "plugins/text",

        serialize: function() {
            return this.model.toJSON();
        },

        onRender: function() {

            // using jquery because it provides a few vendor prefix styles
            this.$el.css({
                color: this.model.get("attr").color,
                fontSize: this.model.get("attr").fontSize + "%"
            });
        }
  });

  return Layer;
});
