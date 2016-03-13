function sumoColor() {
    this.cd         = require('color-difference');

    var color       = require('color-thief');
    this.colorThief = new color();
 
    this.tabColor   = ["#82DA93", "#F5A39C", "#A9C092", "#D07CAF"];
    this.colorName  = {
	"#82DA93" : "VERT",
	"#F5A39C" : "ORANGE",
	"#A9C092" : "JAUNE",
	"#D07CAF" : "ROSE"
    };

    this.rgbToHex = function (tabRGB) {
	var str="#", tmp, tmp2, i;
	for (i=0; i < tabRGB.length; i++) {
	    tmp = tabRGB[i].toString(16).toUpperCase();
	    tmp2 = tmp.length < 2 ? tmp + ""+tmp : tmp;
            str+=tmp2;
	}
	
	return str;
    }

    this.compareColor = function(a,b) {
	if (a.percentDiff < b.percentDiff)
	    return -1;
	else if (a.percentDiff > b.percentDiff)
	    return 1;
	else 
	    return 0;
    }
}

sumoColor.prototype.getMainColor = function(img) {
    var colorMax = this.colorThief.getColor(img.toBuffer());
    var similar  = this.chooseColor(this.rgbToHex(colorMax));
  
    return (similar);
}

sumoColor.prototype.chooseColor = function(currentColor) {
    var tabDiff   = [], i, tabColor = this.tabColor;
    for (i=0; i < tabColor.length; i++) {
	tabDiff.push({color: tabColor[i], percentDiff: this.cd.compare(currentColor, tabColor[i], "EuclideanDistance")});
    }
    tabDiff.sort(this.compareColor);
    return tabDiff[0].color;
}


module.exports = sumoColor;
