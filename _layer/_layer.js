define([
	"zeega"
],

function(Zeega){

	_Layer = Zeega.Backbone.Model.extend({
		
		layerType : null,

		controls : [],

		defaults : {
			citation: true,
			default_controls : true,
			draggable : true,
			has_controls : true,
			linkable : true,
			mode : 'player',
			resizable : false,
			showCitation : true
		},
		defaultAttributes : {},

		initialize : function()
		{
			this.defaults = _.extend(this.defaults, this.defaultAttributes);
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

	_Layer.Visual = Zeega.Backbone.LayoutView.extend({
		
		fetch: function(path) {
			// Initialize done for use in async-mode
			var done;
			// Concatenate the file extension.
			path = 'app/templates/'+ path + ".html";
			// If cached, use the compiled template.
			if (JST[path]) {
				return JST[path];
			} else {
				// Put fetch into `async-mode`.
				done = this.async();
				// Seek out the template asynchronously.
				return $.ajax({ url: Zeega.root + path }).then(function(contents) {
					done(JST[path] = _.template(contents));
				});
			}
		},

		className : 'visual-element',
		template : '',

		serialize : function(){ return this.model.toJSON(); },

		initialize : function()
		{
			this.init();
		},

		beforePlayerRender : function(){},
		beforeRender : function()
		{
			this.className = this._className +' '+ this.className;
			this.beforePlayerRender();

			if(this.model.get('target_div') !== '' && !_.isNull(this.model.get('target_div')) )
			{
				$('#'+ this.model.get('target_div') +' .ZEEGA-player-window').append( this.el );
			}
			else
			{
				$('.ZEEGA-player-window').append( this.el );
			}
			this.$el.addClass('visual-element-'+ this.model.get('type').toLowerCase() );
			this.moveOffStage();
			this.applySize();
		},

		afterRender : function()
		{
			this.verifyReady();
			this.onRender();
		},

		onRender : function(){},

		applySize : function()
		{
			this.$el.css({
				//height : this.getAttr('height') +'%', // photos need a height!
				width : this.getAttr('width') +'%'
			});
		},

		init : function(){},
		render : function(){},

		// default verify fxn. return ready immediately
		verifyReady : function(){ this.model.trigger('visual_ready',this.model.id); },

		player_onPreload : function()
		{
			this.render();
		},
		player_onPlay : function()
		{
			this.onPlay();
		},
		player_onPause : function()
		{
			this.onPause();
		},
		player_onExit : function()
		{
			this.pause();
			this.moveOffStage();
			this.onExit();
		},
		player_onUnrender : function(){},
		player_onRenderError : function(){},

		onPreload : function()
		{

		},

		onPlay : function()
		{

		},

		onPause : function()
		{

		},

		onExit : function()
		{

		},

		updateZIndex : function( z )
		{
			this.$el.css('z-index', z);
		},


		editor_onLayerEnter : function(){},
		editor_onLayerExit : function(){},
		editor_onControlsOpen : function(){},
		editor_onControlsClosed : function(){},

		moveOffStage : function()
		{
			this.$el.css({
				top: '-1000%',
				left: '-1000%'
			});
		},

		moveOnStage : function()
		{
			this.$el.css({
				top: this.getAttr('top') +'%',
				left: this.getAttr('left') +'%'
			});
		},

		play : function()
		{
			this.isPlaying = true;
			this.moveOnStage();
			this.player_onPlay();
		},

		pause : function()
		{
			this.isPlaying = false;
			this.player_onPause();
		},

		playPause : function()
		{
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

	_Layer.LayoutView = Zeega.Backbone.LayoutView.extend({
		
		fetch: function(path) {
			// Initialize done for use in async-mode
			var done;
			// Concatenate the file extension.
			path = 'app/templates/'+ path + ".html";
			// If cached, use the compiled template.
			if (JST[path]) {
				return JST[path];
			} else {
				// Put fetch into `async-mode`.
				done = this.async();
				// Seek out the template asynchronously.
				return $.ajax({ url: Zeega.root + path }).then(function(contents) {
					done(JST[path] = _.template(contents));
				});
			}
		}
	});

	return _Layer;

});
