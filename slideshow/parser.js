/*

    generates a valid slideshow layer from a set of images

    pass in an array of image layers and it outputs a valid layer object

*/
define([
    "lodash"
],

function( _ ) {

    var Slideshow = {};

    Slideshow.parse = function( layers, options ) {
        var defaults, slides;

        defaults = {
            keyboard: false,
            width: 100,
            top: 0,
            left: 0
        };
        
        slides = _.filter( layers, function( layer ) {
            if ( layer.layer_type == "Image" ) {
                _.extend( layer, {
                    attr: layer,
                    type: layer.layer_type,
                    id: layer.id
                });
                return true;
            }
            return false;
        });

        return {
            attr: _.defaults({ slides: slides }, defaults ),
            start_slide: parseInt( options.slideshow.start, 10 ) || 0,
            start_slide_id: parseInt( options.slideshow.start_id, 10 ) || null,
            slides_bleed: options.slideshow.bleed,
            transition: options.slideshow.transition,
            speed: options.slideshow.speed,
            type: "SlideShow",
            id: 1
        };
    };

    return Slideshow;
});
