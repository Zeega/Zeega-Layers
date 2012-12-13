define([
    "zeega",
    "zeega_dir/plugins/layers/_layer/_layer"
],

function( Zeega, _Layer ) {

    var SSSlider = _Layer.LayoutView.extend({

        slide: 0,
        slidePos: 0,

        className: "slideshow-slider",
        template: "plugins/slideshowthumbslider",

        initialize: function() {

            this.slideNum = this.model.get("attr").slides.length;
            this.model.on("slideshow_update", function( slide ) {
                this.highlightThumb( slide.slideNum );
            }, this );

            Zeega.on("resize_window", this.onResize, this );
        },

        serialize: function() {
            return this.model.toJSON();
        },

        afterRender: function() {
            this.onResize();
            this.makeDraggable();
            this.sinkThumbSlider();
        },

        makeDraggable: function() {
            var dragWidth = -this.$(".slideshow-thumb-wrapper ul").width() + window.innerWidth - 10;

            this.$(".slideshow-thumb-wrapper ul").draggable({
                axis: 'x',
                containment: [ dragWidth - window.innerWidth / 2 , 0, window.innerWidth / 2, 0 ]
            });
        },

        onResize: function() {
            this.$el.css("top", (this.$el.closest('.ZEEGA-player').height() - this.$el.height()) +"px");
        },

        events: {
            "click a.slider-thumb": "onClickThumb",
            "click a.trackback": "onClickTrackback",
            "click .slideshow-slider-control-prev": "prev",
            "click .slideshow-slider-control-next": "next",

            "mouseenter": "onMouseOver",
            "mouseleave": "sinkThumbSlider"
        },

        onMouseOver: function() {
            if ( this.sinkThumbsTimer ) {
                clearTimeout( this.sinkThumbsTimer );
            }
            var newTop = this.$el.closest(".ZEEGA-player").height() - this.$el.height();
            $(".slideshow-slider").animate({"top": newTop });
        },

        sinkThumbSlider: function() {
            var _this = this;
            this.sinkThumbsTimer = setTimeout(function() {
                var newTop = _this.$el.closest(".ZEEGA-player").height() - _this.$el.height() + 70;
                $(".slideshow-slider").animate({"top": newTop });
            }, 2000 );
        },

        prev: function() {

            if ( this.slidePos > 0 ) {
                this.slidePos--;
                this.$("ul").stop().animate({
                    "left": (this.slidePos * -171) + "px"
                });
            }
            return false;
        },

        next: function() {
            var $ul = this.$("ul");

            // check slider position offset
            if ( this.slidePos < this.slideNum - 1 &&
                    ($ul.offset().left + $ul.width()) > window.innerWidth ) {
                this.slidePos++;
                $ul.stop().animate({
                    "left": this.slidePos * -171 + "px"
                });
            }
            return false;
        },

        onClickThumb: function( e ) {
            var slideNum = $( e.target ).closest("a").data("slidenum");

            this.highlightThumb( slideNum );
            this.model.trigger("slideshow_switch-frame", slideNum );
            return false;
        },

        onClickTrackback: function() {
            return false;
        },

        highlightThumb: function( num ) {
            var leftPosition = 0,
                $li = this.$("li"),
                $active = $li.eq(num);

            this.slide = num;
            $li.removeClass("active");
            $active.addClass("active");

            leftPosition = window.innerWidth / 2 - $active.position().left;

            this.$(".slideshow-thumb-wrapper ul").stop().animate({
                left: leftPosition
            }, 250);
        }
  });

  return SSSlider;
});
