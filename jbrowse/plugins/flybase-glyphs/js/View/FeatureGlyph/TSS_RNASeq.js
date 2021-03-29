define(['dojo/_base/declare',
           'dojo/_base/lang',
           'JBrowse/View/FeatureGlyph/Box'],
       function(declare,
           lang,
           Box) {

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
				
				// Following is to provide space for RNA-Seq profile on the top - STR
				fRect.h += 23;
				// Following is to provide bumping for glyph extending beyond formal feature range (strand arrow)
				fRect.w += 12;
    },


    renderBox: async function( context, viewInfo, feature, top, overallHeight, parentFeature, style ) {

				var seqftstart= feature.get('start');
        var left  = viewInfo.block.bpToX( seqftstart );
				var seqftend= feature.get('end');
				var right = viewInfo.block.bpToX( seqftend );
        var width = right - left + 1;

        var height = this._getFeatureHeight( viewInfo, feature );
        if( ! height ) height = 7;
				var half_height = Math.round( height/2 );
        if( height != overallHeight )
            top += Math.round( (overallHeight - height)/2 );
				const fttop= top + 23; // to account for space for RNA-Seq profile
				const pixperbase= Math.round((seqftend-seqftstart+1)/width);

        style = style || lang.hitch( this, 'getStyle' );
        var color = style( feature, 'color' ) || 'maroon';
				var lineWidth = style( feature, 'borderWidth') || 1;

				// line stops
          	context.beginPath();
						context.lineWidth = 1;
        		context.strokeStyle = 'black';
          	context.moveTo(left,fttop);
          	context.lineTo(left,fttop+height);
          	context.stroke();
          	context.beginPath();
						context.lineWidth = 1;
          	context.moveTo(left+width,fttop);
          	context.lineTo(left+width,fttop+height);
          	context.stroke();

				// range line
						//context.fillRect( left, top, width, 1 );
          	//context.stroke();
						context.lineWidth = 1;
        		context.strokeStyle = color;
          	context.beginPath();
          	context.moveTo(left,fttop+half_height);
						context.setLineDash([2,2]); 
          	context.lineTo(left+width-1,fttop+half_height);
          	context.stroke();
						context.setLineDash([0]);
						
				// strand arrow
				var strand = feature.get('Strand');
				if( strand ) {
        	context.lineWidth = 1;
          context.fillStyle = 'blue';
					if( strand > 0 ) {
          	context.beginPath();
          	//context.moveTo(right+4,fttop+half_height);
          	context.moveTo(right+9,fttop+half_height);
          	context.lineTo(right+4,fttop+half_height+5);
          	context.lineTo(right+4,fttop+half_height-5);
            context.closePath();
            context.fill();
					}
					else {
          	context.beginPath();
          	//context.moveTo(left-4,fttop+half_height);
          	context.moveTo(left-9,fttop+half_height);
          	context.lineTo(left-4,fttop+half_height+5);
          	context.lineTo(left-4,fttop+half_height-5);
            context.closePath();
            context.fill();
					}
				}

				// get signal data
				var fbid = feature.get('ID');
				var ftarray = await $.when( 
					$.ajax(
						{
        			url: '/cgi-bin/get_ft_data.pl?mode=tss_rnaseq&fbid='+fbid,
        			type: 'get',
        			dataType: 'json'
    				}
					)
				).then(
						function(response){
							var res= JSON.stringify(response);
      				//console.log("getAJAXData result: "+res);
      				return response;
  					}
					);
      	//console.log("getAJAXData fin.return: "+ftarray.length+" "+ftarray); 

				// paint signal
				var arrlength= ftarray.length;
				var signalgood= 4;
				for( var i= 0; i < arrlength; i++ ) {
          var signal= ftarray[i];
					if( signal>signalgood ) { signalgood= signal-1; }
					}
				for( var i= 0; i < arrlength; i++ ) {
            var signal= ftarray[i];
						if( signal>0 ) {
								var xcoord= viewInfo.block.bpToX( seqftstart + i );
								var color= 'darkred';
								if( signal>=signalgood ) { color= 'tomato'; }
       					context.beginPath();
          			context.moveTo(xcoord,fttop-2+half_height);
								var magnifiedsignal= signal * 3;
								if( pixperbase>2 ) {
									context.strokeStyle = color; 
          				context.lineTo(xcoord,fttop+half_height-2-magnifiedsignal);
          				context.lineTo(xcoord+1,fttop+half_height-2-magnifiedsignal);
          				context.lineTo(xcoord+1,fttop+half_height-2);
        					context.closePath();
        					context.stroke();
								}
								else {
									context.strokeStyle = color; 
        					context.lineWidth = 1;
          				context.lineTo(xcoord,fttop+half_height-2-magnifiedsignal);
        					context.closePath();
        					context.stroke();
								}
						}
        }



    },


});
});
