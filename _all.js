/*

plugin/layer manifest file

this should be auto generated probably!!

*/

define([
	'zeega_layers/image/image',
	'zeega_layers/link/link',
	'zeega_layers/slideshow/slideshow'
],
	function(
		image,
		link,
		slideshow
	)
	{
		var Plugins = {};
		_.extend( Plugins, image, link, slideshow ); // extend the plugin object with all the layers
		return Plugins;
	}
);