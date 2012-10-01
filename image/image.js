define([
  "zeega",
  "backbone",
  'zeega_plugins/_layer/_layer'
],

function(Zeega, Backbone, _Layer){

	var Layer = Zeega.module();

	Layer.Image = _Layer.extend({
			
		layerType : 'Image',

		defaultAttributes : {
			'title' : 'Image Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
			
			'linkable' : true
		},

		controls : [
			
			{
				type : 'checkbox',
				property : 'dissolve',
				label : 'Fade In'
			},
			{
				type : 'slider',
				property : 'width',
				label : 'Scale',
				suffix : '%',
				min : 1,
				max : 200
			},
			{
				type : 'slider',
				property : 'opacity',
				label : 'Scale',
				step : 0.01,
				min : 0.05,
				max : 1
			}

		]

	});

	Layer.Image.Visual = _Layer.Visual.extend({
		
		template : 'plugins/image',
		init : function()
		{
			console.log('image init', this);
		},

		serialize : function(){ return this.model.toJSON(); },
		
		verifyReady : function()
		{
			var _this = this;
			var img = this.$el.imagesLoaded();
			img.done(function(){ _this.model.trigger('ready',_this.model.id); });
			img.fail(function(){ _this.model.trigger('error',_this.model.id); });
		}
		
	});

	return Layer;

});
