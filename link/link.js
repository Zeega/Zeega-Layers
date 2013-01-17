define([
    "zeega",
    "zeega_dir/plugins/layers/_layer/_layer"
],

function( Zeega, _Layer ) {

    var Layer = Zeega.module();

    Layer.Link = _Layer.extend({

        layerType: "Link",

        defaultAttributes: {
            "title": "Link Layer",
            "from_sequence": null,
            "to_frame": null,
            "from_frame": null,
            "left": 25,
            "top": 25,
            "height": 50,
            "width": 50,
            "opacity": 1,
            "opacity_hover": 1,
            "blink_on_start": true,
            "glow_on_hover": true,
            "citation": false,
            "linkable": false,
            "default_controls": false
        }
    });

  Layer.Link.Visual = _Layer.Visual.extend({

    template: "plugins/link",

    serialize: function() {
        return this.model.toJSON();
    },

    beforePlayerRender: function() {
        var _this = this,
        style = {
            "border-radius": "0",
            "height": this.getAttr("height") + "%",
            "background": this.getAttr("backgroundColor"),
            "opacity": this.getAttr("opacity"),
            "box-shadow": "0 0 10px rgba(255,255,255,"+ this.getAttr("opacity") +")"
        };

      this.$el.attr("data-glowOnHover", this.getAttr("glow_on_hover") );
/*
      this.$el.removeClass("link-arrow-right link-arrow-down link-arrow-up link-arrow-left");

      if( this.preview ) this.delegateEvents({"click":"goClick"});

      if(this.model.get("attr").link_type == "arrow_left")
        this.$el.html( this.getTemplate() ).css( style ).addClass("link-arrow-left");
      else if(this.model.get("attr").link_type == "arrow_right")
        this.$el.html( this.getTemplate() ).css( style ).addClass("link-arrow-right");
      else if(this.model.get("attr").link_type == "arrow_up")
        this.$el.html( this.getTemplate() ).css( style ).addClass("link-arrow-up");

      if( this.model.get("attr").glow_on_hover ) this.$el.addClass("linked-layer-glow");

      if( this.getAttr("mode") == "editor" )
      {
        _.extend( style, {
          "border": "2px dashed orangered",
          "border-radius": "6px"
        });
      }
*/
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

    /*
    player_onPlay: function()
    {
      this.render();
      this.delegateEvents({
        "click":"goClick",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
      });
      var _this = this;
      this.$el.animate({opacity:1},1000,function(){
        _this.$el.animate({opacity:0},1000);
      });
    }
    */


    });

    return Layer;
});
