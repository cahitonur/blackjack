import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import device;

var boundsWidth = 1024;
var boundsHeight = 576;
var baseWidth = device.screen.width * (boundsHeight / device.screen.height);
var baseHeight = boundsHeight;
var scale = device.screen.height / baseHeight;

exports = Class(ImageView, function (supr){
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight,
			image: 'resources/images/onu211.png'
		});

		supr(this, 'init', [opts]);
		this.build();
	};
	this.build = function () {
		var start = new View ({
			superview: this,
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight
		});
		start.on('InputStart', bind(this, function () {
			this.emit('titlescreen:start');
		}));
	};
});