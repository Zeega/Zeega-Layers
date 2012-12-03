define([
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer'
],

function(Zeega, _Layer){

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
			'click .slideshow-slider-control-prev' : 'prev',
			'click .slideshow-slider-control-next' : 'next'
		},

		prev : function()
		{
			if(this.slidePos > 0)
			{
				this.slidePos--;
				this.$('ul').stop().animate({ 'left': this.slidePos*-171+'px' });
			}
			return false;
		},

		next : function()
		{
			// check slider position offset 
			if(this.slidePos < this.slideNum-1 && (this.$('ul').offset().left + this.$('ul').width()) > window.innerWidth )
			{
				this.slidePos++;
				this.$('ul').stop().animate({ 'left': this.slidePos*-171+'px' });
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

	return SSSlider;

});
