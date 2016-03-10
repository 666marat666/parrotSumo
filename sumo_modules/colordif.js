var cd        =  require('color-difference');
var tabColor  = ["#CC0000", "#FF33CC", "#FFFF00", "#3366FF", "#33CC00"];

var chooseColor = function(currentColor) {
    var tabDiff   = [];
    cd = require('color-difference');
    for (var i=0; i < tabColor.length; i++) {
	tabDiff.push({color: tabColor[i], percentDiff: cd.compare(currentColor, tabColor[i], "EuclideanDistance")});
    }
    tabDiff.sort(compare1);
    return tabDiff[0];
}


function compare1(a,b) {
  if (a.percentDiff < b.percentDiff)
    return -1;
  else if (a.percentDiff > b.percentDiff)
    return 1;
  else 
    return 0;
}

exports.chooseColor = chooseColor;
