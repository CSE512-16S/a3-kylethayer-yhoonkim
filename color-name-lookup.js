var connString = "http://carlise.cs.washington.edu:3000"
var colorValues = {};
var rgbLookup = {};
var currentColorIds = [];
var viewedColorNames = {};
var colorsLoaded = [];

function draw(query, func) {
	$.get(query, function(data) {
		func.apply(this, [data]);
	});
}

function rgbString(r, g, b){
	return r + "_" + g + "_" + b;
}

function addCurrentColorValue(id, r, g, b){
	if(typeof colorValues[id] === "undefined"){
		colorValues[id] = {
			r: r,
			g: g,
			b: b,
			id: id,
			names: {}
		};
		rgbLookup[rgbString(r, g, b)] = id;
	}
}

function addColorName(id, langId, name){
	if(typeof colorValues[id].names[langId] === "undefined"){
		colorValues[id].names[langId] = {};
		colorValues[id].names[langId][name] = 1;
	}else{
		if(typeof colorValues[id].names[langId][name] === "undefined"){
			colorValues[id].names[langId][name] = 1;
		} else {
			colorValues[id].names[langId][name]++;
		}
	}
}

function loadAllColors(callbackFunction){
	
	var colorsToLoad = [];
	if(!colorsLoaded.includes(currentLanguages[currentSide])){
		colorsToLoad.push(currentLanguages[currentSide]);
		colorsLoaded.push(currentLanguages[currentSide]);
	}
	if(!colorsLoaded.includes(currentLanguages[1-currentSide])){
		colorsToLoad.push(currentLanguages[1-currentSide]);
		colorsLoaded.push(currentLanguages[1-currentSide]);
	}

	if(colorsToLoad.length > 0){
		$.ajax({
			url: connString + "/answers?",
			data: {
				select: "color_name,color{color_id,r,g,b},assignments{assignment_id,languages{language_id,language}}", 
				"assignments.languages.language": "in." + colorsToLoad.join()
			},
			success: function(data) {
				for (var i = 0; i < data.length; i++) {
					
					if(data[i].color === null || data[i].assignments.languages === null){
						continue;
					}
					var color_id = data[i].color.color_id;
					
					//add if needed
					addCurrentColorValue(
							color_id, 
							data[i].color.r, 
							data[i].color.g,
							data[i].color.b);
					
					langId = data[i].assignments.languages.language
					addColorName(
						color_id,
						langId,
						data[i].color_name);
				}
				callbackFunction();
			}
			
		});
	} else{
		callbackFunction();
	}
}

function prepareColor(){
	currentColorIds = [];
	viewedColorNames = {};
	
	for (var colorId in colorValues) {
		if(typeof colorValues[colorId].names[currentLanguages[0]] !== "undefined"){
			var thisColorNames = Object.keys(colorValues[colorId].names[currentLanguages[0]]);
			if(thisColorNames.includes(currentColors[0])){
				currentColorIds.push(colorId);
			}
		}
		if(typeof colorValues[colorId].names[currentLanguages[1]] !== "undefined"){
			var thisColorNames = Object.keys(colorValues[colorId].names[currentLanguages[1]]);
			if(thisColorNames.includes(currentColors[1])){
				currentColorIds.push(colorId);
			}
		}
	}
	
	findMatchingColors();
}

function findMatchingColors(){
	//get matching colors for the current color on each side of the display
	var matchColor1toLang1 = getColorNames(currentLanguages[0], currentColors[0], currentLanguages[0])[0];
	var matchColor1toLang2 = getColorNames(currentLanguages[1], currentColors[0], currentLanguages[0])[0];
	var matchColor2toLang2 = getColorNames(currentLanguages[1], currentColors[1], currentLanguages[1])[0];
	var matchColor2toLang1 = getColorNames(currentLanguages[0], currentColors[1], currentLanguages[1])[0];

	//restrict the size of both lists
	var numMatchingColors = 20;
	if(matchColor1toLang1.length > numMatchingColors){
		matchColor1toLang1 = matchColor1toLang1.slice(0, numMatchingColors);
	}
	if(matchColor1toLang2.length > numMatchingColors){
		matchColor1toLang2 = matchColor1toLang2.slice(0, numMatchingColors);
	}
	if(matchColor2toLang1.length > numMatchingColors){
		matchColor2toLang1 = matchColor2toLang1.slice(0, numMatchingColors);
	}
	if(matchColor2toLang2.length > numMatchingColors){
		matchColor2toLang2 = matchColor2toLang2.slice(0, numMatchingColors);
	}

	var lang1ColorNames = [];
	lang1ColorNames = lang1ColorNames.concat(matchColor1toLang1.map(function(c){return c.name}));
	lang1ColorNames = lang1ColorNames.concat(matchColor2toLang1.map(function(c){return c.name}));
	var lang2ColorNames = [];
	lang2ColorNames = lang2ColorNames.concat(matchColor1toLang2.map(function(c){return c.name}));
	lang2ColorNames = lang2ColorNames.concat(matchColor2toLang2.map(function(c){return c.name}));

	for (var colorId in colorValues) {
		if(typeof colorValues[colorId].names[currentLanguages[currentSide]] !== "undefined"){
			var thisColorNames = Object.keys(colorValues[colorId].names[currentLanguages[currentSide]]);
			for(var j = 0; j < thisColorNames.length; j++){
				if(lang1ColorNames.includes(thisColorNames[j])){
					if(!currentColorIds.includes(colorId)){ //if we haven't already seen this color, add it
						currentColorIds.push(colorId);
					}
				}
			}
		}
		if(typeof colorValues[colorId].names[currentLanguages[1-currentSide]] !== "undefined"){
			var thisColorNames = Object.keys(colorValues[colorId].names[currentLanguages[1-currentSide]]);
			for(var j = 0; j < thisColorNames.length; j++){
				if(lang2ColorNames.includes(thisColorNames[j])){
					if(!currentColorIds.includes(colorId)){ //if we haven't already seen this color, add it
						currentColorIds.push(colorId);
					}
				}
			}
		}
	}
}


function addViewedColorNames(id, langId, names){
	for (i in names){
		name = names[i];
		if(typeof viewedColorNames[id] === "undefined"){
			 viewedColorNames[id] = {}
		}
		if(typeof viewedColorNames[id][langId] === "undefined"){
			viewedColorNames[id][langId] = {};
			viewedColorNames[id][langId][name] = 1;
		}else{
			if(typeof viewedColorNames[id][langId][name] === "undefined"){
				viewedColorNames[id][langId][name] = 1;
			} else {
				viewedColorNames[id][langId][name]++;
			}
		}
	}
}

function getColorNames(destLangId, currentColorName, currentLanguage){
	var finalColorNames = {};
	for(var color_id in colorValues){
		var colorInfo = colorValues[color_id];
		if (typeof colorInfo.names[destLangId] !== undefined){
			for(var colorName in colorInfo.names[destLangId]){
				if(typeof finalColorNames[colorName] === "undefined"){
					finalColorNames[colorName] = colorInfo.names[destLangId][colorName];
				} else {
					finalColorNames[colorName] += colorInfo.names[destLangId][colorName];
				}
			}
		}
	}

	var colorScores = scoreColors(currentColorName, currentLanguage);
	
	//split into matching and not matching
	matchingColorNamesArray = [];
	unMatchingColorNamesArray = [];
	for(var colorName in finalColorNames){
		if(colorScores[destLangId][colorName].matchingColors > 0){
			matchingColorNamesArray.push({
				name: colorName,
				count: finalColorNames[colorName],
				score: colorScores[destLangId][colorName].score,
				matchingColors: colorScores[destLangId][colorName].matchingColors
			});
		}else{
			unMatchingColorNamesArray.push({
				name: colorName,
				count: finalColorNames[colorName],
			});
		}
	}
	
	matchingColorNamesArray.sort(function(a,b){
		if(a.score != b.score){
			return b.score - a.score;
		} else if(a.matchingColors != b.matchingColors) {
			return b.matchingColors - a.matchingColors;
		} else {
			return b.count - a.count;
		}
	});
	
	unMatchingColorNamesArray.sort(function(a,b){
		return b.count - a.count;
	});
	return [matchingColorNamesArray, unMatchingColorNamesArray];
}

function scoreColors(matchColorName, matchLangId){
	var colorScores = {};
	var totalMatchingColors = 0;
	for(var color_id in colorValues){
		var colorInfo = colorValues[color_id];
		isCurrentColorAMatch = false;
		if (typeof colorInfo.names[matchLangId] !== "undefined"){
			if(Object.keys(colorInfo.names[matchLangId]).includes(matchColorName)){
				isCurrentColorAMatch = true;
				totalMatchingColors += 1;
			}
		}
		for(var langId in colorInfo.names){
			for(var colorName in colorInfo.names[langId]){
				if(typeof colorScores[langId] === "undefined"){
					colorScores[langId] = {};
				}
				
				if(typeof colorScores[langId][colorName] === "undefined"){
					colorScores[langId][colorName] = {
						matchingColors: 0,
						totalColors: 0
					};
				}
				
				colorScores[langId][colorName].totalColors += 1;
				if(isCurrentColorAMatch){
					colorScores[langId][colorName].matchingColors += 1;
				}
			}
		}
	}
	
	//now compute score based on info (2 * intersect - xor)
	for(var langId in colorScores){
		for(var colorName in colorScores[langId]){
			var colorMatchInfo = colorScores[langId][colorName];
			colorMatchInfo.mainColorNotThis = totalMatchingColors - colorMatchInfo.matchingColors;
			colorMatchInfo.thisColorNotMain = colorMatchInfo.totalColors - colorMatchInfo.matchingColors;
			
			colorMatchInfo.score = 
				colorMatchInfo.matchingColors * 2 - colorMatchInfo.mainColorNotThis - colorMatchInfo.thisColorNotMain ;
		}
	}
	
	return colorScores;
}

function reverseLookup(rgbColor){
	var hsvColor = RGBtoHSV(rgbColor.r, rgbColor.g, rgbColor.b);

	var h = Math.round(hsvColor.h * numberHues / 360.0) * 1.0 / numberHues;
	
	var bestS = saturationValues[0];
	var bestSDist = Math.abs(saturationValues[0] - hsvColor.s / 100.0);
	for(var i = 1; i < saturationValues.length; i++){
		var currentDist = Math.abs(saturationValues[i] - hsvColor.s / 100.0);
		if(currentDist < bestSDist){
			bestS = saturationValues[i]
			bestSDist = currentDist;
		}
	}
	var s = bestS;
	
	var bestV = valueValues[0];
	var bestVDist = Math.abs(valueValues[0] - hsvColor.v / 100.0);
	for(var i = 1; i < valueValues.length; i++){
		var currentDist = Math.abs(valueValues[i] - hsvColor.v / 100.0);
		if(currentDist < bestVDist){
			bestV = valueValues[i]
			bestVDist = currentDist;
		}
	}
	var v = bestV;
	
	var rgb = HSVtoRGB(h, s, v);

	var color_id = rgbLookup[rgbString(rgb.r, rgb.g, rgb.b)];
	return [colorValues[color_id], rgbString(rgb.r, rgb.g, rgb.b)];
}
