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
            // TODO: If the target platforms are modern, there is no need to
            // use this-aliasing. Investigate rationale, remove if possible.
            var _this = this;

            this.slideNum = this.model.get("attr").slides.length;
            this.model.on("slideshow_update", function( slide ) {
                _this.highlightThumb(slide.slideNum);
            }, this );

            Zeega.on("resize_window", this.onResize, this );
        },

        serialize: function() {
            return this.model.toJSON();
        },

        afterRender: function(){
            this.onResize();
        },

        onResize: function() {
            this.$el.css("top", (window.innerHeight-this.$el.height()) +"px");
        },

        events: {
            "click a.slider-thumb": "onClickThumb",
            "click a.trackback": "onClickTrackback",
            "click .slideshow-slider-control-prev": "prev",
            "click .slideshow-slider-control-next": "next"
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
            var $li = this.$("li");

            this.slide = num;
            $li.removeClass("active");
            // TODO: If num is zero-indexed, this could be written as:
            // $li.eq(num).addClass("active");
            // Which would elimate a trip through jQuery()
            $( $li[num] ).addClass("active");
        }
  });

  return SSSlider;
});
