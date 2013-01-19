define([
    "zeega",
    "zeega_parser/plugins/layers/_layer/_layer"
],

function( Zeega, _Layer ) {

    var Metadata = {};

    Metadata.View = _Layer.LayoutView.extend({

        className: 'slide-metadata',
        template: "plugins/slideshow-metadata",

        initialize: function() {
            this.model.on("slideshow_update", this.onUpdate, this );
            this.slideInfo = this.model.get('attr').slides[0].attr;
        },

        onUpdate: function( info ) {
            this.slideInfo = info.data.attr;
            this.render();
        },

        serialize: function() {
            return _.extend({ title: '', description: ''}, this.slideInfo );
        }

    });

  return Metadata;
});
