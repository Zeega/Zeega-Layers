define([
	"zeega",
	'zeega_layers/_layer/_layer',

	'modules/plugins/media-player/media-player'
],

function(Zeega, _Layer, MediaPlayer){

	var Layer = Zeega.module();

	Layer.Video = _Layer.extend({
			
		layerType : 'Video',

		defaultAttributes : {
			'title' : 'Video Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 0.5,
			'cue_in'  : 0,
			'cue_out' : null,
			'fade_in' : 0,
			'fade_out' : 0,
			'dissolve': false,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function()
		{
			this.initMediaPlayer()
			console.log('init media player', MediaPlayer);
		},
		
		initMediaPlayer : function()
		{
			var ct = '#media-controls-'+this.id;
			this.player = new MediaPlayer.Views.Player({
				model:this,
				control_mode : 'editor',
				media_target : '#layer-visual-'+this.id,
				controls_target : ct
			});
		},
		
		initPlayerPlayer : function()
		{
			console.log('init player player')
			this.player = new MediaPlayer.Views.Player({
				model:this,
				control_mode : 'none',
				media_target : '#layer-visual-'+ this.id
			});
		}

	});

	Layer.Video.Visual = _Layer.Visual.extend({
		
		template : 'plugins/video',

		onPlay : function()
		{
			this.model.player.play();
		},

		onPause : function()
		{
			this.model.player.pause();
		},
		
		onExit : function()
		{
			this.model.player.pause();
		},
		
		verifyReady : function()
		{
			var _this = this;
			
			if( !this.model.player_loaded )
			{
				var _this = this;
				this.model.initPlayerPlayer();
				this.$el.html( this.model.player.render().el );
				this.model.player.placePlayer();
				this.model.player.popcorn.listen('timeupdate',function(){ _this.onTimeUpdate(); })
				this.model.player_loaded = true;
			}
			else
			{
				this.model.player.pause();
			}
		}
		
	});

	return Layer;

});

/*

(function(Layer){


	Layer.Views.Visual.Video = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			
			var img = $('<img>')
				.attr('id', 'video-player-'+ this.model.id)
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			$(this.el).html( img ).css('height', this.attr.height+'%');
			
			return this;
		},
		
		onLayerEnter : function(){},
		
		onLayerExit : function()
		{
			console.log('@@@		on layer exit')
			if( this.model.player_loaded ) this.model.player.destroy();
			this.model.player_loaded = false;
			
			//must call this if you extend onLayerExit
			this.model.trigger('editor_readyToRemove')
		},
		
		onControlsOpen : function()
		{
			console.log('video controls open : visual')
			var _this = this;
			if( !this.model.player_loaded )
			{
				this.model.initPlayer();
				this.$el.html(this.model.player.render().el);
				this.model.player.placePlayer();
				console.log('on controls open',this, this.model.player)
				
				this.model.player_loaded = true;
			}
			else
			{
				this.model.player.pause();
			}
			
		
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			this.model.player.pause();
		},
		
		
		onEnded : function()
		{
		
		
		},
		
		onTimeUpdate : function()
		{
			//Fades
			
			if(this.model.get('attr').cue_out==0) var out = this.model.player.getDuration();
			else var out = this.model.get('attr').cue_out;
			var t = this.model.player.getCurrentTime();
			var f = parseFloat(this.model.get('attr').cue_in)+parseFloat(this.model.get('attr').fade_in);
			var g = out-parseFloat(this.model.get('attr').fade_out);
			
			
			if(this.model.get('attr').fade_in>0 && t<f)
			{
				var vol =this.model.get('attr').volume*(1.0-((f-t)/this.model.get('attr').fade_in)*((f-t)/this.model.get('attr').fade_in));
				this.model.player.setVolume(vol);
			}
			
			else if(this.model.get('attr').fade_out>0 && t>g)
			{
				var vol =this.model.get('attr').volume*(1.0-((t-g)/this.model.get('attr').fade_out))*(1.0-((t-g)/this.model.get('attr').fade_out));
				this.model.player.setVolume(vol);
			}
			else if(Math.abs(this.model.get('attr').volume-this.model.player.getVolume())>.01)
			{
				this.model.player.setVolume(this.model.get('attr').volume);
			}

			
			
			
		},
		
		
		
		onUnrender : function()
		{
			
			this.model.player.pause();
			this.model.destroy();	
		}
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Views.Controls.Youtube = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Youtube = Layer.Views.Visual.Video.extend();
	
	Layer.Vimeo = Layer.Video.extend();
	Layer.Views.Controls.Vimeo = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Vimeo = Layer.Views.Visual.Video.extend();

})(zeega.module("layer"));

*/



