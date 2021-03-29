define(['dojo/_base/declare',
           'dojo/_base/lang',
           'JBrowse/View/FeatureGlyph/Box'],
       function(declare,
           lang,
           Box) {

return declare(Box, {

    renderBox: function( context, viewInfo, feature, top, overallHeight, parentFeature, style ) {

        var center_on_left = false;
        var fixedwidth = 8;
        var left  = viewInfo.block.bpToX( feature.get('start') );
        var width = viewInfo.block.bpToX( feature.get('end') ) - left + 1;
        if (width < fixedwidth) {
            width = fixedwidth;
            //center_on_left = true;
        }
				var half_width = Math.round(width/2);
				var centerx = left + half_width;

        var height = this._getFeatureHeight( viewInfo, feature );
        if( ! height )
            return;
				var half_height = Math.round( height/2 );
        if( height != overallHeight )
            top += Math.round( (overallHeight - height)/2 );

        style = style || lang.hitch( this, 'getStyle' );
        var bgcolor = style( feature, 'color' );
        var borderColor = style( feature, 'borderColor' );
				var lineWidth = style( feature, 'borderWidth');

        //left = Math.round( left );
        //width = Math.round( width );
				
				var strand = feature.get('Strand');

				if( width > fixedwidth ) {
        	context.lineWidth = 0;
        	context.strokeStyle = 'black';
          	context.beginPath();
          	context.moveTo(left,top+1);
						context.setLineDash([2,3]); 
          	context.lineTo(left+width,top+2);
          	context.closePath();
          	context.stroke();
						context.setLineDash([0]); 
				}
				if( strand ) {
        	context.lineWidth = 1;
        	context.strokeStyle = 'black';
					if( strand > 0 ) {
          	context.beginPath();
          	context.moveTo(centerx-4,top+half_height);
          	context.lineTo(centerx-10,top+half_height);
          	context.lineTo(centerx-8,top+half_height+2);
          	context.lineTo(centerx-8,top+half_height-2);
          	context.lineTo(centerx-10,top+half_height);
          	context.closePath();
          	context.stroke();
					}
					else {
          	context.beginPath();
          	context.moveTo(centerx+4,top+half_height);
          	context.lineTo(centerx+10,top+half_height);
          	context.lineTo(centerx+8,top+half_height+2);
          	context.lineTo(centerx+8,top+half_height-2);
          	context.lineTo(centerx+10,top+half_height);
          	context.closePath();
          	context.stroke();
					}
				}

        // background
        if (center_on_left) {
            if (bgcolor) {
                context.fillStyle = bgcolor;
                context.beginPath();
                context.moveTo(centerx-4,top+half_height);
                context.lineTo(left,top);
                context.lineTo(centerx+4,top+half_height);
                context.lineTo(left,top+height);
                context.closePath();
                context.fill();
            }
            else {
                context.clearRect( centerx-4, top, centerx+4, height );
            }
        }
        else {
            if( bgcolor ) {
                context.fillStyle = bgcolor;
                context.beginPath();
                context.moveTo(centerx-4,top+half_height);
                context.lineTo(centerx,top);
                context.lineTo(centerx+4,top+half_height);
                context.lineTo(centerx,top+height);
                context.closePath();
                context.fill();
            }
            else {
                context.clearRect( left, top, 8, height );
            }
        }

        // foreground border
        if( borderColor && lineWidth ) {
            if (center_on_left) {
                context.lineWidth = lineWidth;
                context.strokeStyle = borderColor;

                context.beginPath();
                context.moveTo(centerx-4,top+half_height);
                context.lineTo(left,top);
                context.lineTo(centerx+4,top+half_height);
                context.lineTo(left,top+height);
                context.closePath();
                context.stroke();
            }
            else {
                context.lineWidth = lineWidth;
                context.strokeStyle = borderColor;

                context.beginPath();
                context.moveTo(centerx-4,top+half_height);
                context.lineTo(centerx,top);
                context.lineTo(centerx+4,top+half_height);
                context.lineTo(centerx,top+height);
                context.closePath();
                context.stroke();
            }

        }
    }

});
});
