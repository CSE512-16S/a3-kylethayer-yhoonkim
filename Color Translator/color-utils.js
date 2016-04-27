var numberHues = 60;
var saturationValues = [1, .75, .5];
var valueValues = [1, .75, .5];
var allColors = [];

function getRandomColor(){
	// make sure colors have been filled in
	if(allColors.length == 0){
		fillInRandomColors();
	}
	//get random index from the allColors array
	var r = Math.floor(Math.random() * allColors.length);
	return  allColors[r];
}


function fillInRandomColors(){
	//first add the grays (saturation = 0)
	for(var i = 0; i < valueValues.length; i++){
		var h = 0;
		var s = 0;
		var v = valueValues[i];
		var rgb = HSVtoRGB(h, s, v);
		allColors.push({
			h: h,
			s: s,
			v: v,
			r: rgb.r,
			g: rgb.g,
			b: rgb.b
		});
	}
	//then add black
	var h = 0;
	var s = 0;
	var v = 0;
	var rgb = HSVtoRGB(h, s, v);
	allColors.push({
		h: h,
		s: s,
		v: v,
		r: rgb.r,
		g: rgb.g,
		b: rgb.b
	});

	//then add all the non-grays (saturation != 0)
	for(var i = 0; i <= numberHues; i++){
		for(var j = 0; j < saturationValues.length; j++){
			for(var k = 0; k < valueValues.length; k++){
				var h = 1.0 * i / numberHues;
				var s = saturationValues[j];
				var v = valueValues[k];
				var rgb = HSVtoRGB(h, s, v);
				allColors.push({
					h: h,
					s: s,
					v: v,
					r: rgb.r,
					g: rgb.g,
					b: rgb.b
				});
			}
		}
	}
}

// This code is from stackoverflow here:
// http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function RGBtoHSV () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}