define([
  "zeega",
  "zeega_parser/plugins/layers/_layer/_layer",
  "zeega_parser/plugins/media-player/media-player"
],

function( Zeega, _Layer, MediaPlayer ) {

    var Layer = Zeega.module();

    Layer.Video = _Layer.extend({

        layerType: "Video",

        attr: {
            "title": "Video Layer",
            "url": "none",
            "left": 0,
            "top": 0,
            "height": 100,
            "width": 100,
            "volume": 0.5,
            "cue_in": 0,
            "cue_out": null,
            "fade_in": 0,
            "fade_out": 0,
            "dissolve": false,
            "loop": false,
            "opacity": 1,
            "dimension": 1.5,
            "citation": true
        }
    });

    Layer.Video.Visual = _Layer.Visual.extend({

        template: "plugins/video",

        ended: false,
        playbackCount: 0,

        init: function() {
          //this.mediaPlayer = new MediaPlayer.Views.Player({
          //  model:this.model,
          //  control_mode : "editor",
          //  media_target : "#layer-visual-"+this.id,
          //  controls_target : "#media-controls-"+this.id
          //})
        },

        onPlay: function() {
            this.ended = false;
            this.mediaPlayer.play();
        },

        onPause: function() {
            this.mediaPlayer.pause();
        },

        onExit: function() {

            this.mediaPlayer.pause();
        },

        verifyReady: function() {
            if ( this.mediaPlayer_loaded !== true ) {
                var _this = this;

                this.mediaPlayer = new MediaPlayer.Views.Player({
                    model: this.model,
                    control_mode: "none",
                    media_target: "#visual-element-" + this.id
                });
                this.$el.append( this.mediaPlayer.el );
                this.mediaPlayer.render();
                this.mediaPlayer.placePlayer();
                this.mediaPlayer.popcorn.on("timeupdate", function() {
                  _this.onTimeUpdate();
                });
                this.model.on("media_ended", function() {
                  _this.onEnded();
                });

                this.mediaPlayer_loaded = true;
            } else {
                this.mediaPlayer.pause();
            }
        },

        onTimeUpdate: function() {
            if ( !this.ended ) {
                //Fades
                var cueIn, cueOut, fadeIn, fadeOut, volume, out;

                cueIn = this.getAttr("cue_in");
                cueOut = this.getAttr("cue_out");
                fadeIn = this.getAttr("fade_in");
                fadeOut = this.getAttr("fade_out");
                volume = this.getAttr("volume");

                // TODO: will cueOut ever be false or undefined?
                if ( cueOut === 0 || cueOut === null ) {
                    out = this.mediaPlayer.getDuration();
                } else {
                    out = cueOut;
                }

                var t = this.mediaPlayer.getCurrentTime(),
                    f = parseFloat( cueIn ) + parseFloat( fadeIn ),
                    g = out - parseFloat( fadeOut );

                if ( fadeIn > 0 && t < f ) {

                    this.mediaPlayer.setVolume(
                        volume * ( 1.0-((f-t)/fadeIn) * ((f-t) / fadeIn) )
                    );

                } else if ( fadeIn > 0 && t > g ) {
                    //vol = this.getAttr("volume") * (1.0-((t-g) / this.getAttr("fade_out") ))*(1.0-((t-g)/this.getAttr("fade_out") ));
                    //this.mediaPlayer.setVolume(vol);
                } else if ( Math.abs( volume - this.mediaPlayer.getVolume() ) > 0.01 ) {
                    this.mediaPlayer.setVolume( volume );
                }

                // TODO: the missing else statement leads me to believe
                // that this entire condition tree could be refactored

                // send updates to the player. must include the layer
                // info incase there are > 1 media layers on a single frame
                var info = {
                    cue_in: this.getAttr("cue_in"),
                    cue_out: this.getAttr("cue_out"),
                    id: this.model.id,
                    media_type: this.getAttr("media_type"),
                    layer_type: this.getAttr("layer_type"),
                    current_time: this.mediaPlayer.getCurrentTime(),
                    duration: this.mediaPlayer.getDuration()
                };
                this.model.status.emit("media_timeupdate", info );
                if ( info.current_time >= out - 1 ) {
                    this.onEnded();
                }
            }
        },

        onEnded: function() {
            this.playbackCount++;
            //this.model.trigger("playback_ended", this.model.toJSON() );
            this.model.status.emit( "ended", this.model.toJSON() );
            if ( this.getAttr("loop") ) {
                this.mediaPlayer.setCurrentTime( this.getAttr("cue_in") );
                this.mediaPlayer.play();
            } else {
                this.ended = true;
            }
        }
    });

    Layer.Youtube = Layer.Video.extend();
    Layer.Youtube.Visual = Layer.Video.Visual.extend();

    Layer.Vimeo = Layer.Video.extend();
    Layer.Vimeo.Visual = Layer.Video.Visual.extend();

    return Layer;
});
