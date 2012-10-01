/*

plugin/layer manifest file

this should be auto generated probably!!

*/

define([
	'zeega_layers/image/image'
],
	function(
		image
	)
	{
		var Plugins = {};
		_.extend( Plugins, image ); // extend the plugin object with all the layers
		return Plugins;
	}
);