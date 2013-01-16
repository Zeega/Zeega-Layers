/*

plugin/layer manifest file

this should be auto generated probably!!

*/

define([
    "zeega_dir/plugins/layers/image/image",
    "zeega_dir/plugins/layers/link/link",
    "zeega_dir/plugins/layers/slideshow/slideshow",
    "zeega_dir/plugins/layers/video/video",
    "zeega_dir/plugins/layers/audio/audio",
    "zeega_dir/plugins/layers/rectangle/rectangle",
    "zeega_dir/plugins/layers/text/text",
    "zeega_dir/plugins/layers/popup/popup",
    "zeega_dir/plugins/layers/geo/geo"
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
