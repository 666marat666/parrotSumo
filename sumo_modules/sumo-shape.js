function sumoShape() {
    this.cv         = require('opencv');
    this.BLUE       = [0, 255, 0];
    this.RED        = [0, 0, 255];
    this.GREEN      = [0, 255, 0];
    this.WHITE      = [255, 255, 255];

    this.comparePoints = function(a,b) {
	if (a.x + a.y < b.x + b.y)
            return -1;
	else if (a.x + a.y > b.x + b.y)
            return 1;
	else
            return 0;
    }    

}

sumoShape.prototype.contours = null;
sumoShape.prototype.squareDeteced = false;
sumoShape.prototype.imgSquare = null;

sumoShape.prototype.detectPoints = function(im, obj) {

    var lowThresh, highThresh, nIters, minArea, precision;
    if (obj === undefined) {
	lowThresh  = 0;
	highThresh = 100;
	nIters     = 2;
	minArea    = 2000;
	precision  = 0.017;
    } else {
	lowThresh  = obj.lowThresh;
	highThresh = obj.highThresh;
	nIters     = obj.nIters;
	minArea    = obj.minArea;
	precision  = obj.precision;
    }


    var display = false, im_canny, validAreas, arcLength, points = [], tabPoints = [], i, j;

    im_canny = im.copy();
    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);
    
    this.contours = im_canny.findContours();
    
    validAreas = 0;
    for(i = 0; i < this.contours.size(); i++) {
	
	if(this.contours.area(i) < minArea) continue;
	validAreas++;
	arcLength = this.contours.arcLength(i, true);
	this.contours.approxPolyDP(i, precision * arcLength, true);


	if (this.contours.cornerCount(i) > 3 &&  this.contours.cornerCount(i) < 6) {
	    for (j=0; j < this.contours.cornerCount(i); j++) {
		points.push(this.contours.point(i, j));
	    }
	}
	tabPoints.push(points);
    }
    return (tabPoints);
}


sumoShape.prototype.detectSquare = function(img, tabPoints) {
    var points, tabSquare = [], imgSquare, wAll, wSquare, i;
    
    wAll = new this.cv.NamedWindow("Video", 0);
    wAll.show(img);
    wAll.blockingWaitKey(0,50);

    for (i=0; i < tabPoints.length; i++) {
	if (tabPoints[i].length == 4) {
	    tabPoints[i].sort(this.comparePoints);
	    points = tabPoints[i];

	    if (Math.abs(Math.abs(tabPoints[i][0].x - tabPoints[i][3].x) - Math.abs(tabPoints[i][0].y - tabPoints[i][3].y)) < 50) {
		tabSquare.push(tabPoints[i]);
		img.drawContour(this.contours, i, this.RED); 
	    }
	    for (j=0; j < tabSquare.length; j++)
		this.imgSquare = img.crop(points[0].x, points[0].y, (points[3].x - points[0].x), (points[3].y - points[0].y));
	}
    }
    this.squareDeteced = (tabSquare.length >= 1) ? true : false;
    return (tabSquare);
}

    


module.exports = sumoShape;
