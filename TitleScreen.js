import ui.View as View;
import ui.TextView as TextView;
import device;

var boundsWidth = 576;
var boundsHeight = 1024;
var baseWidth = boundsWidth;
var baseHeight =  device.screen.height * (boundsWidth / device.screen.width);

exports = Class(View, function (supr){
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight,
			backgroundColor: '#a9cf88'
		});

		supr(this, 'init', [opts]);
		this.build();
	};
	this.build = function () {

		this.welcome_bar = new TextView ({
			superview: this,
			x: (baseWidth / 2) - 150,
			y: (baseHeight / 2),
			width: 300,
			height: 100,
			size: 42,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: true,
			color: '#FFFFFF',
			text: 'BlackJack!'
		});
		this.start_button = new TextView ({
			superview: this,
			x: (baseWidth / 2) - 150,
			y: (baseHeight / 2) + 50,
			width: 300,
			height: 100,
			size: 42,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: 'FFFFFF',
			text: 'Tap to Start'
		});
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