define([
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer'
],

function(Zeega, _Layer){

	var Layer = Zeega.module();

	Layer.SlideShow = _Layer.extend({
			
		layerType : 'SlideShow',

		defaultAttributes : {
			'arrows' : true, // turns on/off visual arrow controls
			'keyboard' : false, // turns on/off keyboard controls
			'thumbnails' : true, // turns on/off thumbnail drawer

			'title' : 'Slideshow Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33
		}

	});

	Layer.SlideShow.Visual = _Layer.Visual.extend({
		
		template : 'plugins/slideshow',

		slide : 0,

		init : function()
		{
			this.slideCount = this.model.get('attr').slides.length;
			this.model.on('slideshow_switch-frame', this.scrollTo, this);
			Zeega.on('resize_window', this.positionArrows, this);
		},

		serialize : function(){ return this.model.toJSON(); },

		onPlay : function()
		{
			this.$el.css({'height': '100%'});
			this.hideArrows();
			this.initKeyboard();
			this.emitSlideData( this.slide );
			this.positionArrows();
		},

		onRender : function()
		{
			this.thumbSlider = new SSSlider({model:this.model});
			this.$el.append( this.thumbSlider.el );
			this.thumbSlider.render();
		},

		onExit : function()
		{
			this.killKeyboard();
		},

		events : {
			'click  .slideshow-left-arrow' : 'goLeft',
			'click  .slideshow-right-arrow' : 'goRight'
		},

		goLeft : function()
		{
			if(this.slide > 0 )
			{
				this.slide--;
				this.scrollTo(this.slide);
				this.hideArrows();
			}
			return false;
		},

		goRight : function()
		{
			if(this.slide < this.slideCount -1 )
			{
				this.slide++;
				this.scrollTo(this.slide);
				this.hideArrows();
			}
			return false;
		},

		scrollTo : function( slideNo )
		{
			this.$('.slideshow-container').animate({left: (slideNo * -100)+'%'});
			this.emitSlideData(slideNo);
		},

		emitSlideData : function(slideNo)
		{
			this.model.trigger('slideshow_update', { slideNum: slideNo, data: this.getAttr('slides')[slideNo] } );
		},

		positionArrows : function()
		{
			this.$('.slideshow-arrow').css('top', (window.innerHeight/2 - 50) +'px');
		},

		hideArrows : function()
		{
			if( this.slideCount <= 1 )						this.$('.slideshow-arrow').remove();
			else if( this.slide === 0 )						this.$('.slideshow-left-arrow').addClass('disabled');
			else if( this.slide == this.slideCount - 1 )	this.$('.slideshow-right-arrow').addClass('disabled');
			else											this.$('.slideshow-left-arrow, .slideshow-right-arrow').removeClass('disabled');
		},

		initKeyboard : function()
		{
			if( this.getAttr('keyboard') )
			{
				var _this = this;
				$(window).bind('keyup.slideshow', function(e){
					switch( e.which )
					{
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

		killKeyboard : function()
		{
			if( this.getAttr('keyboard') ) $(window).unbind('keyup.slideshow');
		}
		
	});

	var SSSlider = _Layer.LayoutView.extend({

		slide : 0,
		slidePos : 0,

		className : 'slideshow-slider',

		template : 'plugins/slideshowthumbslider',

		initialize : function()
		{
			var _this = this;
			this.slideNum = this.model.get('attr').slides.length;
			this.model.on('slideshow_update', function(slide){ _this.highlightThumb(slide.slideNum);}, this );
			Zeega.on('resize_window', this.onResize, this);
		},

		serialize : function()
		{
			console.log('asldkjfa;slfjasd;f',this.model.toJSON());
			return this.model.toJSON();
		},

		afterRender : function()
		{
			this.onResize();
		},

		onResize : function()
		{
			this.$el.css('top', (window.innerHeight-this.$el.height()) +'px');
		},

		events : {
			'click a.slider-thumb' : 'onClickThumb',
			'click a.trackback' : 'onClickTrackback',
			'click .slideshow-control-prev' : 'prev',
			'click .slideshow-control-next' : 'next'
		},

		prev : function()
		{
			if(this.slidePos > 0)
			{
				this.slidePos--;
				this.$('ul').animate({ 'left': this.slidePos*-171+'px' });
			}
			return false;
		},

		next : function()
		{
			if(this.slidePos < this.slideNum-1 )
			{
				this.slidePos++;
				this.$('ul').animate({ 'left': this.slidePos*-171+'px' });
			}
			return false;
		},

		onClickThumb : function(e)
		{
			var slideNum = $(e.target).closest('a').data('slidenum');
			this.highlightThumb(slideNum);
			this.model.trigger('slideshow_switch-frame',slideNum);
			return false;
		},

		onClickTrackback : function()
		{
			return false;
		},

		highlightThumb : function(num)
		{
			this.slide = num;
			this.$('li').removeClass('active');
			$(this.$('li')[num]).addClass('active');
		}
		

	});

	return Layer;

});
