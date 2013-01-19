/*

plugin/layer manifest file

this should be auto generated probably!!

*/

define([
    "zeega_parser/plugins/layers/image/image",
    "zeega_parser/plugins/layers/link/link",
    "zeega_parser/plugins/layers/slideshow/slideshow",
    "zeega_parser/plugins/layers/video/video",
    "zeega_parser/plugins/layers/audio/audio",
    "zeega_parser/plugins/layers/rectangle/rectangle",
    "zeega_parser/plugins/layers/text/text",
    "zeega_parser/plugins/layers/popup/popup",
    "zeega_parser/plugins/layers/geo/geo"
],
function(
    image,
    link,
    slideshow,
    video,
    audio,
    rectangle,
    text,
    popup,
    geo
) {
    var Plugins = {};
    // extend the plugin object with all the layers
    return _.extend(
        Plugins,
        image,
        link,
        slideshow,
        video,
        audio,
        rectangle,
        text,
        popup,
        geo
    );
});
