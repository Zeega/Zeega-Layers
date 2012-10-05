/*

plugin/layer manifest file

this should be auto generated probably!!

*/

define([
	'zeega_layers/image/image',
	'zeega_layers/link/link'

],
	function(
		image,
		link
	)
	{
		var Plugins = {};
		_.extend( Plugins, image, link ); // extend the plugin object with all the layers
		return Plugins;
	}
);