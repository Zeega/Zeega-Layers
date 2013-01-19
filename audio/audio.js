define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer",
    "zeega_parser/plugins/layers/video/video"
],

function( Zeega, _Layer, VideoLayer ){

    var Layer = Zeega.module();

    Layer.Audio = _Layer.extend({

        layerType: "Audio",

        attr: {
            "title": "Audio Layer",
            "url": "none",
            "left": 0,
            "top": 0,
            "height": 0,
            "width": 0,
            "volume": 0.5,
            "cue_in": 0,
            "cue_out": null,
            "fade_in": 0,
            "fade_out": 0,
            "opacity": 0,
            "citation": true
        }
    });

    Layer.Audio.Visual = VideoLayer.Video.Visual.extend({
        template: "plugins/audio"
    });

    return Layer;
});
