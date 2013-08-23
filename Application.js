import device;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

var boundsWidth = 576;
var boundsHeight = 1024;
var baseWidth = boundsWidth;
var baseHeight =  device.screen.height * (boundsWidth / device.screen.width);
var scale = device.screen.width / baseWidth;

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var titlescreen = new TitleScreen(),
		gamescreen = new GameScreen();

		this.view.style.scale = scale;

		var rootView = new StackView({
			superview: this,
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight,
			backgroundColor: '#2dae51'
		});

		rootView.push(titlescreen);

		titlescreen.on('titlescreen:start', function () {
			rootView.push(gamescreen);
			gamescreen.emit('app:start');
		});

		gamescreen.on('gamescreen:end', function () {
			rootView.pop();
		});
	};

	this.launchUI = function () {};
});