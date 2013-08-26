import device;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

var boundsWidth = 1024;
var boundsHeight = 576;
var baseWidth = device.screen.width * (boundsHeight / device.screen.height);
var baseHeight = boundsHeight;
var scale = device.screen.height / baseHeight;

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