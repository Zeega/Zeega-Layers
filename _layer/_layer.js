define([
	"backbone"
],

function(Backbone){

	_Layer = Backbone.Model.extend({
		
		layerType : null,

		controls : [],

		defaults : {
			hasControls : true,
			defaultControls : true,
			showCitation : true
		},
		defaultAttributes : {},

		initialize : function()
		{
			this.init();
		},

		init : function(){},

		player_onPreload : function(){},
		player_onPlay : function(){},
		player_onPause : function(){},
		player_onExit : function(){},
		player_onUnrender : function(){},
		player_onRenderError : function(){},

		editor_onLayerEnter : function(){},
		editor_onLayerExit : function(){},
		editor_onControlsOpen : function(){},
		editor_onControlsClosed : function(){}

	});

	_Layer.Visual = Backbone.LayoutView.extend({
		
		className : 'visual-element',
		draggable : true,
		template : '',

		initialize : function()
		{
			this.init();
		},

		beforeRender : function()
		{
			$('.ZEEGA-player-window').append( this.el );
		},

		init : function(){},
		render : function(){},

		verifyReady : function(){ this.model.trigger('ready',this.model.id); },

		player_onPreload : function(){ this.verifyReady(); },
		player_onPlay : function(){},
		player_onPause : function(){},
		player_onExit : function(){},
		player_onUnrender : function(){},
		player_onRenderError : function(){},

		editor_onLayerEnter : function(){},
		editor_onLayerExit : function(){},
		editor_onControlsOpen : function(){},
		editor_onControlsClosed : function(){},


		play : function()
		{
			this.isPlaying = true;
			this.player_onPlay();
		},

		pause : function()
		{
			this.isPlaying = false;
			this.player_onPause();
		},

		playPause : function()
		{
			console.log('play pause layer', this);
			if( this.isPlaying !== false )
			{
				this.isPlaying = false;
				this.player_onPause();
			}
			else
			{
				this.isPlaying = true;
				this.player_onPlay();
			}
		},

		getAttr : function(key){ return this.model.get('attr')[key]; } // convenience method


	});

	return _Layer;

});
