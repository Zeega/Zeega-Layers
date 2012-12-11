define([
  "zeega",
  'zeega_dir/plugins/layers/_layer/_layer',
  'zeega_dir/plugins/layers/slideshow/thumbnail-slider'
],

function(Zeega, _Layer, SSSlider) {

  var Layer = Zeega.module();

  Layer.SlideShow = _Layer.extend({
      
    layerType : 'SlideShow',

    defaultAttributes : {
      'arrows': true, // turns on/off visual arrow controls
      'keyboard': false, // turns on/off keyboard controls
      'thumbnail_slider': true, // turns on/off thumbnail drawer

      'start_slide': null,
      'start_slide_id': null,

      'title': 'Slideshow Layer',
      'url': 'none',
      'left': 0,
      'top': 0,
      'height': 100,
      'width': 100,
      'opacity': 1,
      'aspect': 1.33
    }
  });

  Layer.SlideShow.Visual = _Layer.Visual.extend({
    
    template: 'plugins/slideshow',

    slide: 0,

    init: function() {
      this.slideCount = this.model.get('attr').slides.length;
      this.model.on('slideshow_switch-frame', this.scrollTo, this);
      Zeega.on('resize_window', this.positionArrows, this);
    },

    serialize: function() {
      return this.model.toJSON();
    },

    onPlay: function() {
      this.$el.css({ 'height': '100%' });
      this.hideArrows();
      this.initKeyboard();
      this.emitSlideData( this.slide );
      this.positionArrows();
      if( this.model.get('start_slide')) {
        this.scrollTo( this.model.get('start_slide'));
        this.model.set({'start_slide':null},{silent:true});
      } else if( this.model.get('start_slide_id')) {
        var slideIDArray = _.map( this.model.get('attr').slides, function( slide ) {
            return parseInt(slide.id,10);
          }),
          index = _.indexOf(slideIDArray,this.model.get('start_slide_id'));

        this.scrollTo( index );
        this.model.set({ 'start_slide_id': null }, { silent: true });
      }
    },

    onRender: function() {
      this.thumbSlider = new SSSlider({ model: this.model });
      this.$el.append( this.thumbSlider.el );
      this.thumbSlider.render();
    },

    onExit: function() {
      this.killKeyboard();
    },

    events: {
      'click  .slideshow-control-prev' : 'goLeft',
      'click  .slideshow-control-next' : 'goRight'
    },

    goLeft: function() {
      
      if( this.slide > 0 ) {
        this.slide--;
        this.scrollTo(this.slide);
      }
      return false;
    },

    goRight: function() {

      if( this.slide < this.slideCount -1 ) {
        this.slide++;
        this.scrollTo(this.slide);
      }
      return false;
    },

    scrollTo: function( slideNo ) {

      this.slide = slideNo;
      this.hideArrows();
      this.$('.slideshow-container').stop().animate({ left: (slideNo * -100)+'%' });
      this.emitSlideData( slideNo );
    },

    emitSlideData: function(slideNo) {
      this.model.trigger('slideshow_update', { slideNum: slideNo, data: this.getAttr('slides')[slideNo] } );
    },

    positionArrows: function() {
      this.$('.slideshow-arrow').css('top', (window.innerHeight/2 - 50) +'px');
    },

    hideArrows: function() {

      if( this.slideCount <= 1 ) {
        this.$('.slideshow-arrow').remove();
      } else if( this.slide === 0 ) {
        this.$('.slideshow-control-prev').addClass('disabled');
      } else if( this.slide == this.slideCount - 1 ) {
        this.$('.slideshow-control-next').addClass('disabled');
      } else {
        this.$('.slideshow-control-prev, .slideshow-control-next').removeClass('disabled');
      }
    },

    initKeyboard: function() {

      if( this.getAttr('keyboard') ) {
        var _this = this;

        $(window).bind('keyup.slideshow', function( e ) {
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
      
      if( this.getAttr('keyboard') ) {
        $(window).unbind('keyup.slideshow');
      }
    }
    
  });

  return Layer;
});