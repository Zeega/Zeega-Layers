define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer"
],

function( Zeega, _Layer ) {

    var Layer = Zeega.module();

    Layer.Link = _Layer.extend({

        layerType: "Link",

        attr: {
            title: "Link Layer",
            //to_sequence: null,
            to_frame: null,
            //from_frame: null,
            //from_sequence: null,
            left: 25,
            top: 25,
            height: 50,
            width: 50,
            opacity: 1,
            opacity_hover: 1,
            blink_on_start: true,
            glow_on_hover: true,
            citation: false,
            link_type: "default",
            linkable: false,
            default_controls: false
        }
    });

  Layer.Link.Visual = _Layer.Visual.extend({

    template: "plugins/link",

    serialize: function() {
        return this.model.toJSON();
    },

    beforePlayerRender: function() {
      style = {
          "border-radius": "0",
          "height": this.getAttr("height") + "%",
          "background": this.getAttr("backgroundColor"),
          "opacity": this.getAttr("opacity"),
          "box-shadow": "0 0 10px rgba(255,255,255,"+ this.getAttr("opacity") + ")"
      };

      this.$el.attr("data-glowOnHover", this.getAttr("glow_on_hover") );

      this.$el.addClass("link-type-" + this.getAttr("link_type") );
      this.$(".ZEEGA-link-inner").css( style );
    },

    events: {
        "click a": "goClick",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
    },

    onMouseOver: function() {
        this.$el.stop().fadeTo( 500, this.getAttr("opacity_hover") );
    },

    onMouseOut: function() {
        this.$el.stop().fadeTo( 500, this.getAttr("opacity") );
    },

    goClick: function() {
        this.model.relay.set( "current_frame", this.getAttr("to_frame") );
        return false;
    }

  });

    return Layer;
});