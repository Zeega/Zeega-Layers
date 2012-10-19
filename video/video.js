define([
	"zeega",
	'zeega_dir/plugins/layers/_layer/_layer',

	'zeega_dir/plugins/media-player/media-player'
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
			'citation':true
		}

	});

	Layer.Video.Visual = _Layer.Visual.extend({
		
		template : 'plugins/video',

		init : function()
		{
			//this.mediaPlayer = new MediaPlayer.Views.Player({
			//	model:this.model,
			//	control_mode : 'editor',
			//	media_target : '#layer-visual-'+this.id,
			//	controls_target : '#media-controls-'+this.id
			//})
		},

		onPlay : function()
		{
			this.mediaPlayer.play();
		},

		onPause : function()
		{
			this.mediaPlayer.pause();
		},
		
		onExit : function()
		{
			this.mediaPlayer.pause();
		},
		
		verifyReady : function()
		{
			if( this.mediaPlayer_loaded !== true )
			{
				var _this = this;
				this.mediaPlayer = new MediaPlayer.Views.Player({
					model:this.model,
					control_mode : 'none',
					media_target : '#layer-visual-'+ this.id
				});
				this.mediaPlayer.render();
				this.$el.append( this.mediaPlayer.el );
				this.mediaPlayer.placePlayer();
				this.mediaPlayer.popcorn.listen('timeupdate', function(){ _this.onTimeUpdate(); });
				this.mediaPlayer_loaded = true;
			}
			else
			{
				this.mediaPlayer.pause();
			}
		},

		onTimeUpdate : function()
		{
			//Fades
			var out,vol;
			if( this.getAttr('cue_out') === 0 ) out = this.model.player.getDuration();
			else out = this.getAttr('cue_out');
			var t = this.mediaPlayer.getCurrentTime();
			var f = parseFloat(this.getAttr('cue_in'))+parseFloat(this.getAttr('fade_in'));
			var g = out - parseFloat(this.getAttr('fade_out'));

			if(this.getAttr('fade_in') > 0 && t < f )
			{
				vol = this.getAttr('volume') *(1.0-((f-t)/this.getAttr('fade_in')) * ((f-t) / this.getAttr('fade_in')));
				this.mediaPlayer.setVolume(vol);
			}
			else if(this.getAttr('fade_out') > 0 && t > g )
			{
				vol = this.getAttr('volume') * (1.0-((t-g) / this.getAttr('fade_out') ))*(1.0-((t-g)/this.getAttr('fade_out') ));
				this.mediaPlayer.setVolume(vol);
			}
			else if(Math.abs(this.getAttr('volume') - this.mediaPlayer.getVolume())>0.01)
			{
				this.mediaPlayer.setVolume(this.getAttr('volume'));
			}
			// send updates to the player. must include the layer info incase there are > 1 media layers on a single frame
			var info = {
				id : this.model.id,
				media_type : this.getAttr('media_type'),
				layer_type : this.getAttr('layer_type'),
				current_time : this.mediaPlayer.getCurrentTime()
			};
			this.model.trigger('media_timeupdate', info);
		}

	});

	Layer.Youtube = Layer.Video.extend();
	Layer.Youtube.Visual = Layer.Video.Visual.extend();

	Layer.Vimeo = Layer.Video.extend();
	Layer.Vimeo.Visual = Layer.Video.Visual.extend();

	return Layer;

});