
function drawSOM(testsom, divName){
  var div = document.getElementById(divName);
  var str = "";
  
  viewedColorNames = {};
  
  for(var i = 0; i < testsom.neurons.length; i++){
    for(var j = 0; j < testsom.neurons[0].length; j++){
      var color = testsom.neurons[i][j].weights;
      for(var k = 0; k < color.length; k++){
        color[k] = Math.round(color[k]);
      }
      
      var temp = reverseLookup({r: color[0], g: color[1], b: color[2]});
      var colorInfo = temp[0];
      var rgb_string = temp[1];
      
      //for now check if it is the selected color
      var currentColorCount = 0
      if(typeof colorInfo !== "undefined" && typeof colorInfo.names[currentLanguage] !== "undefined" 
        && typeof colorInfo.names[currentLanguage][currentColor] !== "undefined"){
        currentColorCount = colorInfo.names[currentLanguage][currentColor];
      }     
      
      str += "<DIV class='" + divName+ "-node som-node'"+
        "style='background-color:rgb("+
        color[0]+","+color[1]+","+color[2]+
        ");' " +
        "colorInfo='" + rgb_string + "' ";
      // add info on names in languages
      if(typeof colorInfo !== "undefined"){
        if(typeof colorInfo.names[currentLanguage] !== "undefined" ){
          str += "lang" + currentLanguage + "='" +
              Object.keys(colorInfo.names[currentLanguage]).join(",") +
              "' ";
          addViewedColorNames(colorInfo.id, currentLanguage, colorInfo.names[currentLanguage])
        }
        if(typeof colorInfo.names[currentOtherLanguage] !== "undefined" ){
          str += "lang" + currentOtherLanguage + "='" +
              Object.keys(colorInfo.names[currentOtherLanguage]).join(",") +
              "' ";
          addViewedColorNames(colorInfo.id, currentLanguage, colorInfo.names[currentLanguage])
        }
      } else {
        str += "color='color not loaded' ";
      }
      
      str +=  "'>"
      str += "</DIV>";
    }
    str += "<DIV style='clear:both;'></DIV>";
  }

  div.innerHTML = str;
  div.style.width = "400px";
}
