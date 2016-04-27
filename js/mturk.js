$(document).on('ready page:load', function () {
  var numberHues = 60;
  var saturationValues = [1, .75, .5];
  var valueValues = [1, .75, .5];
  var allColors = [];

  function createPage(){
    drawRandomBox();
    //drawAllColors();
  }

  function drawRandomBox(){
    var body = document.getElementsByTagName("BODY")[0];
    var str = "";
    var color = getRandomColor();
    str += "<DIV style='background-color:rgb("+color.r+","+color.g+","+color.b+");margin:100px;width:100px;height:20px;border-style:solid;border-width:1px'></DIV>"
    body.innerHTML = str;
  }

  function drawAllColors(){
    var body = document.getElementsByTagName("BODY")[0];
    var str = "";
    fillInRandomColors();
    for(var i = 0; i < allColors.length; i++){
      var c = allColors[i];
      str += "<DIV style='background-color:rgb("+c.r+","+c.g+","+c.b+");margin-bottom:1px;width:300px;height:20px'>";
      str += i+" - hsv:" + (Math.round(c.h * 1000)/1000) + "," + c.s + "," + c.v + " - rgb: "+c.r+","+c.g+","+c.b;
      str += "</DIV>";
    }
    body.innerHTML = str;
  }

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


  /*********************************
  Color Naming Area functions
  **********************************/
  var cn_maxColors = 20; // max number of colors each person will name in a task
  var cn_currColor = 1; //which color, out of maxColors, user is currently naming

  //call this function after switching from demographics to color naming section
  function cn_switchedToColorNaming(){

    document.getElementById("cn-maxColorsSpan").innerHTML = cn_maxColors;
    document.getElementById("cn-currColorSpan").innerHTML = cn_currColor;
    var holder = document.getElementById("cn-colornames-holder");

    // Generate hidden inputs all at once
    for (var x = 1; x <= cn_maxColors; x++){
      // get a random color
      var color = getRandomColor();
      var colorstr = color.r+","+color.g+","+color.b;

      // hidden input box with color value info
      var colorval = document.createElement("input");
        colorval.setAttribute("type", "hidden");
        colorval.setAttribute("name", "cn-colorval"+x);
        colorval.setAttribute("id", "cn-colorval"+x);
        colorval.value = colorstr;

      // box for user to input color name
      var colorname = document.createElement("input");
        colorname.setAttribute("type", "text");
        colorname.setAttribute("class", "cn-colorname form-control");
        colorname.setAttribute("name", "cn-colorname"+x);
        colorname.setAttribute("id", "cn-colorname"+x);
        if(x != 1)
          colorname.setAttribute("style", "display:none");

      holder.appendChild(colorval);
      holder.appendChild(colorname);
    }

    //Set color box with the first color
    var firstColor = document.getElementById("cn-colorval1").value;
    document.getElementById("cn-colorbox").style.backgroundColor = "rgb(" + firstColor + ")";
  }


  // user clicked Previous or Next buttons - switch to another color
  $('#cn-prev').on('click', function(){
    cn_navigate(-1);
  });
  $('#cn-next').on('click', function(){
    cn_navigate(1);
  });

  function cn_navigate(direction){
    var cn_currColor_before = cn_currColor;


    // switch to new color
    if(direction == -1){
      // prev
      if(cn_currColor > 1)
        cn_currColor--;
      else
        return;
        // cn_currColor = cn_maxColors;
    }
    else{
      // next
      if( $("#cn-colorname"+cn_currColor).val().trim() === ""){
        $("#cn-colorname"+cn_currColor).parents('.form-group').addClass('has-error');
        alert("Please enter a name for this color.");
        return;
      }
      $("#cn-colorname"+cn_currColor).parents('.form-group').removeClass('has-error');

      if(cn_currColor < cn_maxColors)
        cn_currColor++;
      else
        cn_currColor = 1;
    }

    // hide current text box
    document.getElementById("cn-colorname"+cn_currColor_before).style.display = "none";

    // show new textbox
    document.getElementById("cn-colorname"+cn_currColor).style.display = "";

    // update current color counter
    document.getElementById("cn-currColorSpan").innerHTML = cn_currColor;

    // change color box to new color
    var newColor = document.getElementById("cn-colorval"+cn_currColor).value;
    document.getElementById("cn-colorbox").style.backgroundColor = "rgb(" + newColor + ")";
  }

  document.getElementById("i-agree").addEventListener("click", function() {
    viewPage("page-survey");
  }, false);

  document.getElementById("done-survey").addEventListener("click", function() {
    var validationResult = validateDS();
    if (!validationResult.result)
      alert(validationResult.message);
    else {
      cn_switchedToColorNaming();
      viewPage("page-color-naming");
    }
  }, false);


  populateCountries("ds-country", "ds-state");
  populateLanguages("ds-language");

  function validateDS(){
    var message = "";
    var result = true;
    var inputNames = [ "language", "state", "country", "proficiency", "gender" ];

    inputNames.map(function(inputName){
      var inputValue = $('#ds-' + inputName).val();
      if (  inputValue === "-1" || inputValue === "default") {
        $('#ds-' + inputName).parents('.form-group').addClass('has-error');
        message =  "You didn't choose your " + inputName + ".";
        result = false;
      }
      else
        $('#ds-' + inputName).parents('.form-group').removeClass('has-error');

      return inputName;
    });


    if ( isNaN(parseInt($('#ds-age').val())) ) {
      $('#ds-age').parents('.form-group').addClass('has-error');
      message =  "Age should be a number";
      result = false;
    }
    else
      $('#ds-age').parents('.form-group').removeClass('has-error');

    return { "result": result, "message": message };

  }

  function viewPage(pageID) {
    $(".page").hide();
    $("#"+pageID).show();
    window.scrollTo(0,0);
  }

  function init() {
    viewPage("page-consent");
  }
  window.onload = init;
});