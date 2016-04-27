$(document).on('ready page:load', function() {
  $('#nav-atlas').addClass('active');

  function draw(query, lang, func) {
	$.get(query(lang), function(data) {
		language_color_map[lang] = data.map(function(row){
      var hsv = RGBtoHSV(row.r, row.g, row.b);
      row.h = hsv.h;
      row.s = hsv.s;
      row.v = hsv.v;
      return row;
    });
		console.log(language_color_map);
		if(func != undefined) func();
	});
  }

var allLanguages = new Array();
  //var default_lang = "English (United States) - English";
  var default_lang = "english (united states)";
  draw(distinct_names_by_color_in_lang, default_lang, renderNewWheel);

  //Set up Values
  var intervalV = 4, wheels = [0,1,2,3];
  var isInspect = false;
  var smoothing = 3;
  var unknownThreshold = 5;
  // Storing current state
  var currValue = 0;
  var currColorRGB;

  var language_color_map = {};

  // Load English by default
  $('#add-circle').on('click', renderNewWheel);
  $('#rem-circle').on('click', removeLastWheel); //weird bug where function doesn't trigger if it's not wrapped in func()??


  /*******************************
  Drawing and updating wheel(s)
  ********************************/

  // Generate range of Value values
  var generateVs = function(){
    var allVs = [];
    for (var v = 0; v <= intervalV; v++) {
      allVs.push(v/intervalV);
    }
    return allVs
  };
  var Vs = generateVs();

  // What to do when you change language of dropdown wheel
  var changedDropdown = function(dropdown){
    var lang = get_lang(dropdown);
    if(!language_color_map.hasOwnProperty(lang)){
      draw(distinct_names_by_color_in_lang, lang, null);
    }
  }

  //Extract wheel's currently selected language
  var get_lang = function(dropdown){
    var lang = dropdown.val();
    /*if(lang === '-1'){
        return lang;
    }
    var dash = lang.indexOf('-');
    lang = lang.substring(0, dash-1);*/
    return lang.toLowerCase();
  }
  // What to do when you move mouse over a color wheel
  var mouseOnWheel = function(wheel){
    var currColorRGB = getColor(wheel);
    $(".color-preview").css('background-color', 'rgb(' + currColorRGB.r + ',' + currColorRGB.g + ',' + currColorRGB.b + ')');
    drawCursor(wheel, currColorRGB);

    $(".color-wheel").each(function(){
      var lang = get_lang($(this).siblings(".language-dropdown"));
      var cname_div = $(this).parents(".wheel-outer").find(".current-color-name");
      var cname_alternative_div = $(this).parents(".wheel-outer").find(".current-color-alternative-name");

      if (!(lang === '-1') && language_color_map.hasOwnProperty(lang) && language_color_map[lang].length != 0) {
        var namesPerColor = language_color_map[lang];
        var topNames = nameColor(currColorRGB, namesPerColor);

        if (topNames[0].weight < unknownThreshold) {
          cname_div.html("Unknown");
          cname_alternative_div.html("&nbsp;");
        }
        else{
          var alternativeNames = topNames.splice(1,2)
                                         .map(function(name,i){
                                           if (i!==0) {
                                             return "<span class='other-names'>" + name.name + "</span>";
                                           }
                                           return name.name;
                                          }).join(", ");

          cname_div.html(topNames[0].name);
          cname_alternative_div.html(alternativeNames || "&nbsp;");
        }


      }
      else {
        cname_div.html("...");
        cname_alternative_div.html("&nbsp;");
      }
    })
  }

  var sliderHeight, margin, gap, width, height, rectWidth;
  var moveLock = false;

  function renderNewWheel(){
    //Append new div for Bootstrap column
    var col = $('<div/>').addClass("col-xs-6 col-md-3 wheel-outer");
    $('#wheels-holder').append(col);

    sliderHeight = 20;
    margin = { left: 10, right: 10, top: 10, bottom: 10 };
    gap = 30;
    width = col[0].getBoundingClientRect().width - 30 //30 for padding of col
    height = width + sliderHeight + margin.bottom + margin.top + gap;
    rectWidth = (width - margin.left - margin.right) / (intervalV+1);


    //Append dropdown for languages
    var dropdown = $('<select />').addClass('form-control language-dropdown');
    dropdown.change(function(){
      changedDropdown($(this));
    });
    var name = $('<div></div>').attr("class", "text-center");
    var currentColorName = $("<p class='lead current-color-name'>...</p>");
    var currentColorAlternativeName = $("<p class='lead current-color-alternative-name'>&nbsp;</p>");

    var colorPreview = $("<div></div>").attr("class", "color-preview");
    name.append(colorPreview);
    name.append(currentColorName);
    name.append(currentColorAlternativeName);

    $(col).append(name);
    $(col).append(dropdown);
    populateLanguages(dropdown);

    //Append new div for wheel
    var wheel = $('<div/>').addClass("color-wheel");
    $(col).append(wheel);

    var wheelDiv = $("#wheels-holder div:last");
    var vis = d3.select(wheelDiv[0])
                .append("svg:svg");
    vis.attr("class", "wheel-container")
       .attr("width", width)
       .attr("height", height)
    $(".wheel-container").css("overflow","overlay")

    var wheel = vis.append("g");
    wheel.append("svg:image")
        .attr("xlink:href", "./wheel.png")
        .attr("width", width)
        .attr("height", width)
        .attr("x", 0)
        .attr("y", 0);
    wheel.append("circle")
        .attr("class", "overlay")
        .attr("cx", width/2)
        .attr("cy", width/2)
        .attr("r", width/2)
        .attr("opacity", 0);
    wheel.append("circle")
        .attr("class", "cursor")
        .attr("cx", -10 )
        .attr("cy", -10 )
        .attr("r", 0)
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    wheel.append("circle")
        .attr("class", "mousePad")
        .attr("cx", width/2)
        .attr("cy", width/2)
        .attr("r", width/2)
        .attr("opacity", 0)
        .on('mousemove', function(){
          if(!moveLock){
	          mouseOnWheel(this);
          }
        })
        .on('click', function(){
        	moveLock = !moveLock;
        });

    var records = vis.append("g")
                     .attr("class","records-container");

    function drawRecords(lang, isInspection){
      if(isInspection) {
        var recordsData = language_color_map[lang].filter(function(nlsPerColor){
                        return nlsPerColor.v === (1-currValue)*100;
                       });
        records.selectAll("circle").remove();
        records.selectAll("circle")
            .data(recordsData)
            .enter()
              .append("circle")
              .attr("cx", function(d){ return Math.cos(d.h / 180 * Math.PI) * d.s / 100 * width/2 + width/2; } )
              .attr("cy", function(d){ return Math.sin(d.h / 180 * Math.PI) * d.s / 100 * width/2 + width/2; } )
              .attr("r", 3)
              .style("fill","black");
      }
    }
    drawRecords(default_lang, isInspect);

    // Value slider
    var valueSlider = vis.append("g")
      .attr("class","value-slider");

    valueSlider.selectAll("rect")
      .data(Vs)
      .enter()
        .append("rect")
        .attr("x", function(d){ return margin.left + rectWidth * d * intervalV; })
        .attr("y", height - margin.bottom - sliderHeight )
        .attr("width", rectWidth*1.1 )
        .attr("stroke-width", 0)
        .attr("height", sliderHeight )
        .attr("fill", function(d){
            var grayScale = 255 - Math.ceil(255 * d);
            return 'rgb(' + grayScale + ',' + grayScale + ',' + grayScale + ')';
        })
        .on('click',function(d){
          d3.selectAll("div.color-wheel").each(function(data, i){
              currValue = d;
              changeValueOverlay(d, this);
          });
          console.log((1-d)*100);
          drawRecords(get_lang(dropdown),isInspect);
        });

    valueSlider.append("circle")
      .attr("cx", margin.left + rectWidth * (0 * intervalV+0.5)  )
      .attr("cy", height - margin.bottom - sliderHeight*0.5 )
      .attr("r", sliderHeight/2*0.6)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 3);
  }

  // Draw cursor on wheels
  var drawCursor = function(elem, currColorRGB) {
    var coordinate = [];
    coordinate = d3.mouse(elem);
    d3.selectAll(".cursor")
      .style("fill", 'rgb(' + currColorRGB.r + ',' + currColorRGB.g + ',' + currColorRGB.b + ')' )
      .attr("cx", coordinate[0] )
      .attr("cy", coordinate[1] )
      .attr("r", 10);
  }

  var getColor = function(elem){
    var dim = $(elem).parent().children('image')[0];

    var w = dim.getAttribute('width');
    var h =  dim.getAttribute('height');

    var mid = {x: w/2, y: h/2};

    var c = [];
    c = d3.mouse(elem);
    var mousePos = {x: c[0], y: c[1]};

    var angle = angleDeg(mousePos, mid)+180;
    var dist = distance(mousePos, mid);

    var color = {h: 360 - angle, s: dist/mid.x * 100, v: (1-currValue)*100}
    var rgb = HSVtoRGB(color.h/360, color.s/100, color.v/100);
    color.r = rgb.r;
    color.g = rgb.g;
    color.b = rgb.b;
    return color;
  }

  //Update overlay on wheels + move slider
  var changeValueOverlay = function(val, elem) {
    //Change overlay
    var overlay = $(elem).children('.wheel-container').children('g').first().children('.overlay')[0];
    $(overlay).attr("opacity", val);

    //Change handle position
    var sliderHandle = $(elem).children('.wheel-container').children('g').last().children("circle")[0];
    $(sliderHandle).attr("cx", margin.left + rectWidth * (val * intervalV+0.5)  )
                   .attr("cy", height - margin.bottom - sliderHeight*0.5 )
  }

  //Remove the last wheel, unless there is only one wheel left
  function removeLastWheel() {
    var wheels = $('#wheels-holder > div');
    if(wheels.length == 1) return;
    wheels.last().remove();
  }

  //Populate languages in dropdown
  var populateLanguages = function(elem){
  	if(allLanguages.length == 0){
  		$.get(languages, function(data) {
			allLanguages = data.map(function(row){
	      		return row.name;
	    	});
			makeLanguageDropdown(elem);
		});
  	}
  	else{
  		makeLanguageDropdown(elem);
  	}
  }

  function makeLanguageDropdown(elem){
    // lang_array is defined in lang_array.js
    var langElement = $(elem)[0];
    langElement.length=0;
    langElement.options[0] = new Option('Select Language','-1');
    langElement.selectedIndex = 0;
    for (var i=0; i<allLanguages.length; i++) {
      //langElement.options[langElement.length] = new Option(lang_arr[i] + " - " + lang_arr[i+1]);
      langElement.options[langElement.length] = new Option(allLanguages[i]);
    }
  }



  var distanceColor = function(color1, color2, space){
    if (color1.r === color2.r && color1.g === color2.g && color1.b === color2.b)
      return 0;

    if (space === "rgb") {
      return L2([color1.r,color1.g,color1.b],[color2.r,color2.g,color2.b]);
    }
    else if (space === "hsv") {
      var x1 = Math.cos( color1.h / 180 * Math.PI ) * color1.s;
      var x2 = Math.cos( color2.h / 180 * Math.PI ) * color2.s;
      var y1 = Math.sin( color1.h / 180 * Math.PI ) * color1.s;
      var y2 = Math.sin( color2.h / 180 * Math.PI ) * color2.s;
      var z1 = color1.v;
      var z2 = color2.v;
      return L2([x1,y1,z1],[x2,y2,z2]);
    }
    else if (space === "lab"){
      var colorspaceColor1 = $.colorspaces.make_color('sRGB', [color1.r/256, color1.g/256, color1.b/256]);
      var colorspaceColor2 = $.colorspaces.make_color('sRGB', [color2.r/256, color2.g/256, color2.b/256]);
      return L2(colorspaceColor1.as("CIELAB"),colorspaceColor2.as("CIELAB"))
    }

  }
  var L2 = function(X,Y) {
    if (X.length !== Y.length) {
      return -1;
    }

    var sum = 0;
    for (var i = 0; i < X.length; i++) {
      sum += Math.pow((X[i]-Y[i]),2);
    }

    return Math.sqrt(sum);
  }

  var nameColor = function(queryColor, namesPerColors){
    var topN = [1,2,3,4,5].map(function(i){ return {d: 999999999}; });
    var d = 0;
    for (var i = 0; i < namesPerColors.length; i++) {
      d = distanceColor({"r":namesPerColors[i].r, "g":namesPerColors[i].g, "b":namesPerColors[i].b}, queryColor, "lab");
      for (var j = 0; j < topN.length; j++) {
        if (topN[j].d > d ) {
          for (var k = topN.length-1; k >= j+1; k--) {
            topN[k] = JSON.parse(JSON.stringify(topN[k-1]));
          }
          topN[j].d = d;
          topN[j].names = namesPerColors[i].names.split(",");
          break;
        }
      }
    }

    function distance2weight(distance){
      return 100 / (distance + smoothing)
    }

    var nameWeights = topN.reduce(function(nameWeights,top){
      if (!top.names)
        return nameWeights;
      for (var i = 0; i < top.names.length; i++) {
        var nameWeight = nameWeights.find(function(nameWeight){
          return nameWeight.name === top.names[i]
        });
        if (nameWeight) {
          nameWeight.weight += distance2weight(top.d);
        }
        else {
          nameWeights.push( { weight: distance2weight(top.d), name: top.names[i] });
        }
      }
      return nameWeights;
    },[]);

    nameWeights = nameWeights.sort(function(a,b){
      return - a.weight + b.weight;
    });

    return nameWeights
  }

});
