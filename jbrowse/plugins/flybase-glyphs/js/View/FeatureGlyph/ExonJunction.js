define(['dojo/_base/declare',
          'dojo/_base/lang',
          'JBrowse/View/FeatureGlyph/Box'
					],
       function(declare,
           lang,
           Box,
           BoxGlyph
					 ) {

return declare(Box, {



    _expandRectangleWithLabels: function( viewArgs, feature, fRect ) {
        // maybe get the feature's name, and update the layout box
        // accordingly
        if( viewArgs.showLabels ) {
            var label = this.makeFeatureLabel( feature, fRect );
            if( label ) {
                fRect.h += label.h;
                fRect.w = Math.max( label.w, fRect.w );
                fRect.label = label;
                label.yOffset = fRect.rect.h + label.h;
            }
        }

        // maybe get the feature's description if available, and
        // update the layout box accordingly
        if( viewArgs.showDescriptions ) {
            var description = this.makeFeatureDescriptionLabel( feature, fRect );
            if( description ) {
                fRect.description = description;
                fRect.h += description.h;
                fRect.w = Math.max( description.w, fRect.w );
                description.yOffset = fRect.h-(this.getStyle( feature, 'marginBottom' ) || 0);
            }
        }
				
				// Following is to provide bumping for glyph extending beyond formal feature range
				fRect.w += 20;
    },


    renderBox: function( context, viewInfo, feature, top, overallHeight, parentFeature, style ) {

        var center_on_left = false;
        var left  = viewInfo.block.bpToX( feature.get('start') );
        var right = viewInfo.block.bpToX( feature.get('end') );
        var id    = feature.get('id');
				var intronstart = viewInfo.block.bpToX( id.split('_')[1] ); 
				var intronend   = viewInfo.block.bpToX( id.split('_')[2] );
				var width = intronend - intronstart + 1;
				var half_width = Math.round( width/2 );

        var height = this._getFeatureHeight( viewInfo, feature );
        if( ! height )
            return;
				var half_height = Math.round( height/2 );
        if( height != overallHeight )
            top += Math.round( (overallHeight - height)/2 );

        style = style || lang.hitch( this, 'getStyle' );
        var bgcolor = style( feature, 'color' );

				var strand = feature.get('Strand');

				if( !bgcolor ) bgcolor = 'blue';
        if( bgcolor ) {

            context.fillStyle = 'black';
						context.fillRect( intronstart, top+half_height, intronend-intronstart+1, 1 );

                context.fillStyle = bgcolor; // which is 'color' in config
                context.beginPath();
                context.moveTo(left,top+2);
                context.lineTo(left,top+height-2);
                context.lineTo(intronstart-1,top+height-2);
                context.lineTo(intronstart-1,top+2);
                context.lineTo(left,top+2);
                context.closePath();
                context.fill();

                context.fillStyle = bgcolor; // which is 'color' in config
                context.beginPath();
                context.moveTo(intronend+1,top+2);
                context.lineTo(intronend+1,top+height-2);
                context.lineTo(right,top+height-2);
                context.lineTo(right,top+2);
                context.lineTo(intronend+1,top+2);
                context.closePath();
                context.fill();

            context.fillStyle = 'black';
						// exon stops
						context.fillRect( intronstart-1,top, 1, height );
						context.fillRect( intronend+1,top, 1, height );
						// continuators
						context.fillRect( left-4, top+3, 3, 1 ); context.fillRect( left-9, top+3, 3, 1 );
						context.fillRect( left-4, top+height-3, 3, 1 ); context.fillRect( left-9, top+height-3, 3, 1 );
						context.fillRect( right+1, top+3, 3, 1 ); context.fillRect( right+5, top+3, 3, 1 );
						context.fillRect( right+1, top+height-3, 3, 1 ); context.fillRect( right+5, top+height-3, 3, 1 );
						// strand arrow
						if( width>8 ) {
              context.beginPath();
						  if( strand>0 ) {
            	  context.moveTo(intronend-half_width+2,top+half_height);
                context.lineTo(intronend-half_width+2-3,top+half_height-3);
                context.lineTo(intronend-half_width+2-3,top+half_height+3);
            	  context.moveTo(intronend-half_width+2,top+half_height);
						  }
						  else {
            	  context.moveTo(intronstart+half_width-2,top+half_height);
                context.lineTo(intronstart+half_width-2+3,top+half_height-3);
                context.lineTo(intronstart+half_width-2+3,top+half_height+3);
            	  context.moveTo(intronstart+half_width-2,top+half_height);
						  }
              context.fill();
              context.closePath();
						}
						

        }
    }




});
});
