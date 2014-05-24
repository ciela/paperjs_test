// Create a raster item using the image
var targetFile = "tono.jpg"; var targetRect = new Rectangle(500, 30, 250, 250);
//var targetFile = "A12214.jpg"; var targetRect = new Rectangle(400, 200, 450, 250);
//var targetFile = "yukirin.jpg"; var targetRect = new Rectangle(500, 310, 250, 250);
var raster = new Raster(targetFile);
var loaded = false;
raster.on('load', function() {
	loaded = true;
	onResize();
});

var lastPos = view.center;
var pathContainer = [];
function moveHandler(event) {
	if (!loaded)
		return;
	if (lastPos.getDistance(event.point) < 10)
		return;
	lastPos = event.point;

	var size = this.bounds.size.clone();
	if (size.width < 2 || size.height < 2) {//TODO 解像度によって自由度持たせる
		for (var i = 0; i < pathContainer.length; i++) pathContainer[i].remove();
		return;
	}
	var isLandscape = size.width > size.height;

	// If the path is in landscape orientation, we're going to
	// split the path horizontally, otherwise vertically:

	size /= isLandscape ? [2, 1] : [1, 2];

	var path = new Path.Rectangle({
		point: this.bounds.topLeft.floor(),
		size: size.ceil(),
		onMouseMove: moveHandler
	});
	path.fillColor = raster.getAverageColor(path);
	pathContainer.push(path);

	var path = new Path.Rectangle({
		point: isLandscape
			? this.bounds.topCenter.ceil()
			: this.bounds.leftCenter.ceil(),
		size: size.floor(),
		onMouseMove: moveHandler
	});
	path.fillColor = raster.getAverageColor(path);
	pathContainer.push(path);
	
	this.remove();
}

function onResize(event) {
	if (!loaded)
		return;
	
	// Transform the raster so that it fills the bounding rectangle
	// of the view:
	raster.fitBounds(view.bounds);

	// Create a path that fills the view, and fill it with
	// the average color of the raster:
	var path = new Path.Rectangle({
		rectangle: targetRect,
		onMouseMove: moveHandler
	});
	path.fillColor = raster.getAverageColor(path);
}