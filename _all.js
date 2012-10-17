/*

plugin/layer manifest file

this should be auto generated probably!!

*/

define([
	'zeega_layers/image/image',
	'zeega_layers/link/link',
	'zeega_layers/slideshow/slideshow',
	'zeega_layers/video/video'
],
	function(
		image,
		link,
		slideshow,
		video
	)
	{
		var Plugins = {};
		_.extend( Plugins, image, link, slideshow, video ); // extend the plugin object with all the layers
		return Plugins;
	}
);