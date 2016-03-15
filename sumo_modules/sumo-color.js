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

}

sumoColor.prototype.currentColor = null;
sumoColor.prototype.similarColor0 = null;
sumoColor.prototype.similarColor1 = null;


sumoColor.prototype.rgbToHex = function (tabRGB) {
    var str="#", tmp, tmp2, i;
    for (i=0; i < tabRGB.length; i++) {
	tmp = tabRGB[i].toString(16).toUpperCase();
	tmp2 = tmp.length < 2 ? tmp + ""+tmp : tmp;
        str+=tmp2;
    }
    return (str);
}

sumoColor.prototype.getMainColor = function(img) {
    var colorMax  = this.colorThief.getColor(img.toBuffer());
    this.currentColor  = colorMax;

    var similar0  = this.chooseColor(0);
    var similar1  = this.chooseColor(1);


    this.similarColor0 = similar0;
    this.similarColor1 = similar1;

    if (similar0.color == similar1.color) {
	return (similar0);
    } else {
	if (similar0.colorDiff < 25)
	    return (similar0);
	else if (similar1.colorDiff < 50)
	    return (similar1);
	else
	    return (similar0)
    }
}

sumoColor.prototype.chooseColor = function(algo) {
    algo = (algo === 1) ? "CIE76Difference" : "EuclideanDistance";
    var tabDiff   = [], i, tabColor = this.tabColor, currentColor = this.currentColor;
    for (i=0; i < tabColor.length; i++)
	tabDiff.push({color: tabColor[i], percentDiff: this.cd.compare(currentColor, tabColor[i], algo)});
    tabDiff.sort(this.compareColor);
    return (tabDiff[0].color);
}


function compareColor(a,b) {
    if (a.percentDiff < b.percentDiff)
	return -1;
    else if (a.percentDiff > b.percentDiff)
	return 1;
    else 
	return 0;
}


module.exports = sumoColor;
