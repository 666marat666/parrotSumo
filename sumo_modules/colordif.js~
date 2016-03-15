var cd        =  require('color-difference');
var tabColor  = ["#82DA93", "#F5A39C", "#A9C092", "#D07CAF"];
var array = {
    "#82DA93" : "VERT",
    "#F5A39C" : "ORANGE",
    "#A9C092" : "JAUNE",
    "#D07CAF" : "ROSE"
}

var chooseColor = function(currentColor) {
    var tabDiff   = [];
    cd = require('color-difference');
    for (var i=0; i < tabColor.length; i++) {
	tabDiff.push({color: tabColor[i], percentDiff: cd.compare(currentColor, tabColor[i], "EuclideanDistance")});
    }
    tabDiff.sort(compare1);
//    return array[tabDiff[0].color];
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
