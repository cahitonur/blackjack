import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import device;
import animate;
import AudioManager;

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
		this._sound = new AudioManager({
			path: "resources/audio/",

			files: {
				shuffle_sound: {
					volume: 0.8
				}
			}
		});
		this.build();
	};
	this.build = function () {
		var welcome = new TextView ({
			superview: this,
			x: baseWidth / 2 - 200,
			y: baseHeight / 2 - 50,
			width: 400,
			height: 100,
			fontFamily: "King Richard",
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: '#FFFFFF',
			size: 36,
			text: "Welcome to BlackJack",
			opacity: 0
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
			this._sound.play('shuffle_sound');
		}));
		setTimeout(function () {
			animate(welcome).now({opacity: 1}, 1000)
				.then({opacity: 0}, 1500)
				.then(function () {welcome.setText("v0.1cb")})
				.then({opacity: 1})
				.then({opacity: 0}, 1500)
				.then(function () {welcome.setText("Tap to Start")})
				.then({opacity: 1});
		}, 500);
	};
});