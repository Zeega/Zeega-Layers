define([
	"zeega",
	'zeega_layers/_layer/_layer'
],

function(Zeega, _Layer){

	var Layer = Zeega.module();

	Layer.SlideShow = _Layer.extend({
			
		layerType : 'SlideShow',

		defaultAttributes : {
			'arrows' : true, // turns on/off visual arrow controls
			'keyboard' : false, // turns on/off keyboard controls

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
		},

		serialize : function(){ return this.model.toJSON(); },

		onPlay : function()
		{
			this.$el.css({'height': '100%'});
			this.hideArrows();
			this.initKeyboard();
		},

		onExit : function()
		{
			killKeyboard();
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
			this.$el.animate({left: (slideNo * -100)+'%'});
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

	return Layer;

});
