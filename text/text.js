define([
    "zeega",
    "zeega_dir/plugins/layers/_layer/_layer"
],
function( Zeega, _Layer ) {

    var Layer = Zeega.module();

    Layer.Text = _Layer.extend({
        // TODO: is the redundant naming necessary? If this program knows
        // this is a Layer, wouldn't "type" be sufficient?
        layerType: "Text",

        defaultAttributes: {
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

        domAttributes: function() {
            var style = "color: " + this.model.get("attr").color +"; font-size: " + this.model.get("attr").fontSize + "%;";
            return {
                style: style
            };
        },

        template: "plugins/text",

        // TODO: This doesn"t produce a "serialization", perhaps rename
        // to something more appropriate?
        serialize: function() {
            return this.model.toJSON();
        },

        beforePlayerRender: function() {

        }
  });

  return Layer;
});
