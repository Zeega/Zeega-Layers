/*
    possible transitions: [via http://jquery.malsup.com/cycle/browser.html]

    blindX
    blindY
    blindZ
    cover
    curtainX
    curtainY
    fade
    fadeZoom
    growX
    growY
    none
    scrollUp
    scrollDown
    scrollLeft
    scrollRight
    scrollHorz
    scrollVert
    shuffle
    slideX
    slideY
    toss
    turnUp
    turnDown
    turnLeft
    turnRight
    uncover
    wipe
    zoom

*/

define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer",
    "zeega_parser/plugins/layers/slideshow/thumbnail-slider",
    "plugins/cycle"
],

function( Zeega, _Layer, SSSlider ) {

    var Layer = Zeega.module();

    Layer.SlideShow = _Layer.extend({

        layerType: "SlideShow",

        attr: {
            arrows: true, // turns on/off visual arrow controls
            keyboard: false, // turns on/off keyboard controls
            thumbnail_slider: true, // turns on/off thumbnail drawer

            start_slide: null,
            start_slide_id: null,
            slides_bleed: true,

            title: "Slideshow Layer",
            url: "none",
            left: 0,
            top: 0,
            height: 100,
            width: 100,
            opacity: 1,
            aspect: 1.33
        }
    });

    Layer.SlideShow.Visual = _Layer.Visual.extend({

        template: "plugins/slideshow",

        slide: 0,

        init: function() {
            this.slideCount = this.model.get("attr").slides.length;
            this.model.on("slideshow_switch-frame", this.scrollTo, this);
            Zeega.on("resize_window", this.positionArrows, this);
        },

        serialize: function() {
            return this.model.toJSON();
        },

        onPlay: function() {
            var index,
                startSlide = this.model.get("start_slide"),
                startSlideId = this.model.get("start_slide_id");

            this.$el.css({ "height": this.$el.closest(".ZEEGA-player").height() + "px" });
            this.hideArrows();
            this.initKeyboard();
            this.emitSlideData( this.slide );
            this.positionArrows();

            // investigate why this is needed
            Zeega.$( this.$(".slideshow-container")[0] ).cycle({
                timeout: 0,
                fx: this.model.get("transition") || "scrollHorz",
                speed: this.model.get("speed") || 1000,
                startingSlide: this.slide
            });

        },

        onRender: function() {
            this.$el.css("height", this.$el.closest(".ZEEGA-player").height() );
            this.thumbSlider = new SSSlider({ model: this.model });
            this.$el.append( this.thumbSlider.el );
            this.thumbSlider.render();
        },

        onExit: function() {
            this.killKeyboard();
            Zeega.$( this.$(".slideshow-container")[0] ).cycle("destroy");
        },

        events: {
            "click  .slideshow-control-prev": "goLeft",
            "click  .slideshow-control-next": "goRight"
        },

        goLeft: function() {
            if ( this.slide > 0 ) {
                this.slide--;
                this.scrollTo(this.slide);
            }
            return false;
        },

        goRight: function() {
            if ( this.slide < this.slideCount -1 ) {
                this.slide++;
                this.scrollTo(this.slide);
            }
            return false;
        },

        scrollTo: function( slideNo ) {
            this.slide = slideNo;
            this.hideArrows();
            Zeega.$( this.$(".slideshow-container")[0] ).cycle( slideNo );

            this.updateTitle( slideNo );
            this.emitSlideData( slideNo );
        },

        updateTitle: function( slideNo ) {
            var slide = this.model.get('attr').slides[slideNo];

            this.$(".slide-title").text( slide.attr.title );
            this.$(".slide-description").text( slide.attr.description );
        },

        emitSlideData: function(slideNo) {
            this.model.trigger("slideshow_update", {
                slideNum: slideNo,
                data: this.getAttr("slides")[slideNo]
            });
        },

        positionArrows: function() {
            this.$(".slideshow-arrow").css({
                top: (this.$el.closest(".ZEEGA-player").height() / 2 - 50) + "px",
                height: (this.$el.closest(".ZEEGA-player").height() / 10 ) + "px",
                width: (this.$el.closest(".ZEEGA-player").height() / 10 ) + "px"
            });
        },

        hideArrows: function() {

            if ( this.slideCount <= 1 ) {
                this.$(".slideshow-arrow").remove();
            } else if( this.slide === 0 ) {
                this.$(".slideshow-control-prev").addClass("disabled");
            } else if( this.slide == this.slideCount - 1 ) {
                this.$(".slideshow-control-next").addClass("disabled");
            } else {
                this.$(".slideshow-control-prev, .slideshow-control-next")
                    .removeClass("disabled");
            }
        },

        initKeyboard: function() {
            if ( this.getAttr("keyboard") ) {

                Zeega.$( window ).on("keyup.slideshow", function( e ) {
                    switch( e.which ) {
                        case 37: // left arrow
                            _this.goLeft();
                            break;
                        case 39: // right arrow
                            _this.goRight();
                        break;
                    }
                });
            }
        },

        killKeyboard: function() {
            if ( this.getAttr("keyboard") ) {
                Zeega.$( window ).off("keyup.slideshow");
            }
        }
    });

    return Layer;
});
