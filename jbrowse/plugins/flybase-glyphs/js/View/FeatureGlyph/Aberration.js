define(['dojo/_base/declare',
           'dojo/_base/lang',
           'JBrowse/View/FeatureGlyph/Segments'],
       function(declare,
           lang,
           Box) {

return declare(Box, {

    renderBox: function( context, viewInfo, feature, top, overallHeight, parentFeature, style ) {

        var center_on_left = false;
        var left  = viewInfo.block.bpToX( feature.get('start') );
				var start = left;
				var right = viewInfo.block.bpToX( feature.get('end') );
				var stop = right;
        var width = right - left + 1;

        var height = this._getFeatureHeight( viewInfo, feature );
        if( ! height ) height = 7;
				var half_height = Math.round( height/2 );
        if( height != overallHeight )
            top += Math.round( (overallHeight - height)/2 );

        style = style || lang.hitch( this, 'getStyle' );
        var bgcolor = style( feature, 'color' );
        var borderColor = style( feature, 'borderColor' );
				if( ! borderColor ) borderColor = 'black';
				var lineWidth = style( feature, 'borderWidth');

        // background
        if( bgcolor ) {
                context.fillStyle = bgcolor; // which is 'color' in config
                //context.fillStyle = 'sienna';
                context.beginPath();
                context.moveTo(start,top);
                context.lineTo(start,top+height);
                context.lineTo(stop,top+height);
                context.lineTo(stop,top);
                context.lineTo(start,top);
                context.closePath();
                context.fill();
        }

    },


  renderConnector: function( context, fRect ) {
		const feature = fRect.f;
    // connector
    var connectorColor = this.getStyle( fRect.f, 'connectorColor' );
    var connectorThickness = this.getStyle( fRect.f, 'connectorThickness' );
    if( 0 && connectorColor ) {
        context.fillStyle = connectorColor;
        context.fillRect(
            fRect.rect.l, // left
            Math.round(fRect.rect.t+(fRect.rect.h-connectorThickness)/2), // top
            fRect.rect.w, // width
            connectorThickness
        );
    }
		if( connectorColor ) {
					
        	context.fillStyle = connectorColor;
        	context.strokeStyle = connectorColor;
					var left = fRect.rect.l;
					var width = fRect.rect.w;
					var top = Math.round(fRect.rect.t+(fRect.rect.h-1)/2);
					var height = fRect.rect.h;
					
						// line stops
          	context.beginPath();
						context.lineWidth = 1;
          	context.moveTo(left,top-4);
          	context.lineTo(left,top+4);
          	context.stroke();
          	context.beginPath();
						context.lineWidth = 1;
          	context.moveTo(left+width,top-4);
          	context.lineTo(left+width,top+4);
          	context.stroke();

						// range line
						//context.fillRect( left, top, width, 1 );
          	//context.stroke();
						context.lineWidth = 1;
						context.connectorThickness = 1;
        		context.strokeStyle = 'black';
          	context.beginPath();
          	context.moveTo(left,top);
						context.setLineDash([2,2]); 
          	context.lineTo(left+width-1,top);
          	context.stroke();
						context.setLineDash([0]); 

          	//context.moveTo(left,top);
						//context.setLineDash([4,3]); 
          	//context.lineTo(left+width-1,top);
          	//context.stroke();
						//context.setLineDash([0]); 
		}
  }

});
});
