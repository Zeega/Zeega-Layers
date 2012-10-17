define([
	"zeega",
	'zeega_layers/_layer/_layer'
],

function(Zeega, _Layer){

	var Layer = Zeega.module();

	Layer.SlideShow = _Layer.extend({
			
		layerType : 'SlideShow',

		defaultAttributes : {
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

		player_onPlay : function()
		{
			this.$el.css({'height': '100%'});
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
			}
			return false;
		},

		goRight : function()
		{
			if(this.slide < this.slideCount -1 )
			{
				this.slide++;
				this.scrollTo(this.slide);
			}
			return false;
		},

		scrollTo : function( slideNo )
		{
			this.$el.animate({left: (slideNo * -100)+'%'});
		}
		
	});

	return Layer;

});
