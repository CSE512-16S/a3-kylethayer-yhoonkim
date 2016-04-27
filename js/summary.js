function vl_spec(data, x_title, key, value) {
  return {
    "data": {"values": data},
    "mark": "bar",
    "encoding": {
      "x": {"field":key, "type":"nominal", "sort":"unsort", "axis":{"title":x_title}},
      "y": {"field":value, "type":"quantitative", "axis":{"title":"Number of Records"}}
    }
  };
}

function draw(query, func, args) {
	$.get(query, function(data) { 
		args.push(data);
		func.apply(this, args);
	});
}

function histogram(svg, total, x_title, key, value, data) {
    $(total).html(data.length);
    data = data.sort(function(a,b){return -a[value] + b[value];}).slice(0, 15);
    var vg_spec = vl.compile(vl_spec(data, x_title, key, value)).spec;
    vg.parse.spec(vg_spec, function(chart) {
        chart({el: svg, renderer: 'svg'}).update();
    });
}

function sort_color(a, b) {
    return (a.h * 100 + a.s) * 100 + a.v - ((b.h * 100 + b.s) * 100 + b.v);
}

function color_wheel(svg, data) {
    for (var i = 0; i < data.length; ++i) {
        var hsv = RGBtoHSV(data[i].r, data[i].g, data[i].b);
        data[i].h = hsv.h;
        data[i].s = hsv.s;
        data[i].v = hsv.v;
    }
    data.sort(sort_color);
    for (var i = 0; i < data.length; ++i) {
        var rgb_string = data[i].r + "," + data[i].g + "," + data[i].b;
        var colorDiv = $('<div class="col-xs-2" style="background:rgb(' + rgb_string + ');"></div>').html("<span style=\"visibility:hidden\">x</span>");
        var nameDiv = $('<div class="col-xs-10"></div>').html(data[i].names);
        var row = $('<div class="row row-eq-height"></div>').append(colorDiv).append(nameDiv);
        $(svg).append(row);
    }     
}      

$(document).on('ready page:load', function() {
	$('#nav-summary').addClass('active');
    draw(num_answers_by_lang, histogram, ['#language-n', '#total-languages', 'Languages', "language", "num_answers"]);
    draw(num_answers_by_color_name, histogram, ['#colorname-n', '#total-colornames', 'Color Names', "color_name", "num_answers"]);
    draw(num_answers, function(data){$('#total-answers').html(data[0]["count"])}, []);
    draw(distinct_color_names_by_rgb, color_wheel, ['#colorwheel']);
});
