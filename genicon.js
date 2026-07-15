var PNG = require('pngjs').PNG;
var fs = require('fs');
var SZ=192,R=16,pad=8;

function makeIcon(name, bgR, bgG, bgB) {
  var png = new PNG({width:SZ, height:SZ});
  for(var y=0;y<SZ;y++) for(var x=0;x<SZ;x++) {
    var i = (y*SZ+x)*4;
    // rounded rect background
    var dx = x-pad, dy = y-pad, w=SZ-2*pad, h=SZ-2*pad;
    var round = R;
    var isCorner = (dx<round && dy<round) ? (dx-round)*(dx-round)+(dy-round)*(dy-round)>round*round :
                   (dx<round && dy>h-round) ? (dx-round)*(dx-round)+(dy-(h-round))*(dx-round)*(dx-round)+(dy-(h-round))*(dy-(h-round))>round*round :
                   (dx>w-round && dy<round) ? (dx-(w-round))*(dx-(w-round))+(dy-round)*(dy-round)>round*round :
                   (dx>w-round && dy>h-round) ? (dx-(w-round))*(dx-(w-round))+(dy-(h-round))*(dy-(h-round))>round*round : false;
    var inside = dx>=0 && dy>=0 && dx<=w && dy<=h && !isCorner;
    if(inside) { png.data[i]=bgR; png.data[i+1]=bgG; png.data[i+2]=bgB; png.data[i+3]=255; }
    else { png.data[i]=255; png.data[i+1]=255; png.data[i+2]=255; png.data[i+3]=0; }
  }
  // white snake path (simplified pixel line)
  var pts=[
    [40,140],[52,110],[72,90],[92,110],[110,70],[130,60],[140,80],[150,70],[160,85]
  ];
  for(var p=0;p<pts.length-1;p++){
    var x1=pts[p][0],y1=pts[p][1],x2=pts[p+1][0],y2=pts[p+1][1];
    var steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
    for(var s=0;s<=steps;s++){
      var xx=Math.round(x1+(x2-x1)*s/steps),yy=Math.round(y1+(y2-y1)*s/steps);
      for(var ox=-4;ox<=4;ox++) for(var oy=-4;oy<=4;oy++){
        if(ox*ox+oy*oy<=16){
          var px=xx+ox,py=yy+oy;
          if(px>=0&&px<SZ&&py>=0&&py<SZ){
            var idx=(py*SZ+px)*4;
            png.data[idx]=255;png.data[idx+1]=255;png.data[idx+2]=255;png.data[idx+3]=255;
          }
        }
      }
    }
  }
  // snake head eye
  var ex=pts[pts.length-1][0],ey=pts[pts.length-1][1];
  for(var ox=-3;ox<=3;ox++) for(var oy=-3;oy<=3;oy++){
    if(ox*ox+oy*oy<=5){var px=ex+ox+3,py=ey+oy-3;if(px>=0&&px<SZ&&py>=0&&py<SZ){var idx=(py*SZ+px)*4;png.data[idx]=bgR;png.data[idx+1]=bgG;png.data[idx+2]=bgB;png.data[idx+3]=255;}}
  }

  var buf=PNG.sync.write(png);
  fs.writeFileSync(name, buf);
  console.log('Created ' + name + ' (' + buf.length + ' bytes)');
}

makeIcon('icon-192.png', 26, 115, 232);
makeIcon('icon-512.png', 26, 115, 232);
