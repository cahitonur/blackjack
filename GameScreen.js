import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import device;
import src.Deck as Deck;

var gameon = false;
var boundsWidth = 576;
var boundsHeight = 1024;
var baseWidth = boundsWidth;
var baseHeight =  device.screen.height * (boundsWidth / device.screen.width);
var card_width = 140;
var card_height = 195;
var pcard_y = baseHeight - 450;
var dcard_y = 50;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight,
			image: "resources/images/table.png"
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function () {
		this.on('app:start', start_game.bind(this));
		gameon = true;
		this.playerhand = new TextView({
			superview: this,
			x:(baseWidth / 2) - 25,
			y: pcard_y - 50,
			width: 50,
			height: 50,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: 'FFFFFF',
			size: 32
		});
		this.dealerhand = new TextView({
			superview: this,
			x:(baseWidth / 2) - 25,
			y: dcard_y + card_height,
			width: 50,
			height: 50,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: 'FFFFFF',
			size: 32
		});
		this.card_count = new TextView({
			superview: this,
			x:(baseWidth / 2) - 75,
			y: baseHeight - 70,
			width: 150,
			height: 50,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: 'FFFFFF',
			size: 30
		});
		this.backview = new ImageView({
			superview: this,
			x: (baseWidth / 2) - 150,
			y: dcard_y,
			width: card_width,
			height: card_height,
			image: "resources/images/back.png"
		});
		this.d1view = new ImageView({
			superview: this,
			x: 120,
			y: dcard_y,
			width: card_width,
			height: card_height
		});
		this.d2view = new ImageView({
			superview: this,
			x: 230,
			y: dcard_y,
			width: card_width,
			height: card_height
		});
		this.d3view = new ImageView({
			superview: this,
			x: 340,
			y: dcard_y,
			width: card_width,
			height: card_height
		});
		this.d4view = new ImageView({
			superview: this,
			x: 450,
			y: dcard_y,
			width: card_width,
			height: card_height
		});

		this.p1view = new ImageView({
			superview: this,
			x: 140,
			y: pcard_y,
			width: card_width,
			height: card_height
		});
		this.p2view = new ImageView({
			superview: this,
			x: 220,
			y: pcard_y,
			width: card_width,
			height: card_height
		});
		this.p3view = new ImageView({
			superview: this,
			x: 230,
			y: pcard_y,
			width: card_width,
			height: card_height
		});
		this.p4view = new ImageView({
			superview: this,
			x: 340,
			y: pcard_y,
			width: card_width,
			height: card_height
		});
		this.p5view = new ImageView({
			superview: this,
			x: 450,
			y: pcard_y,
			width: card_width,
			height: card_height
		});

		this._status = new TextView({
			superview: this,
			x: (baseWidth / 2) - 100,
			y: pcard_y - 100,
			width: 200,
			height: 50,
			autoSize: false,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: true,
			color: '#FFFFFF'
		});
		this._hit = new View({
			superview: this,
			width: baseWidth,
			height: baseHeight,
			x: 0,
			y: 0,
		});
		this._hit.on("InputSelect", hit.bind(this));

		this.splitview = new TextView({
			superview: this,
			x: - 200,
			y: pcard_y - 100,
			width: 100,
			height: 50,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			backgroundColor: '#949388',
			color: '#FFFFFF',
			text: "Split?"
		});

		this._stand = new View({
			superview: this,
			width: (baseWidth / 2),
			height: card_height,
			x: 300,
			y: pcard_y,
		});
		this._stand.on("InputSelect", stand.bind(this));

		this._deal = new View({
			superview: this,
			width: baseWidth,
			height: baseHeight,
			x: 0,
			y: 0,
		});
		this._deal.on("InputSelect", start_game.bind(this));
	};
	this._callstand = function () {
		stand.bind(this);
	}
});

function handValue (hand) {
   	var total = 0;
   	var ace = false;
   	for (var i = 0; i < hand.length; i++) {
    	total += Math.min(10, hand[i]._number);
       	if (hand[i]._number == 1)
        	ace = true;
   	}
   	if (total + 10 <= 21 && ace)
    	total += 10;
   	return total;
}

var player_cards = [], computer_cards = [], player_splits_1 = [], player_splits_2 = [];
var new_deck = new Deck();
var hit_c = 1;
function start_game () {
	var that = this;
	if (gameon == false) {
		gameon == true;
		animate(that.p1view).now({x: device.width + 200}, 500);
		animate(that.p2view).now({x: device.width + 200}, 500);
		animate(that.p3view).now({x: device.width + 200}, 500);
		animate(that.p4view).now({x: device.width + 200}, 500);
		animate(that.p5view).now({x: device.width + 200}, 500);
		animate(that.backview).now({x: device.width + 200}, 500);
		animate(that.d1view).now({x: device.width + 200}, 500);
		animate(that.d2view).now({x: device.width + 200}, 500);
		animate(that.d3view).now({x: device.width + 200}, 500);
		animate(that.d4view).now({x: device.width + 200}, 500);
	}
	that._deal.style.visible = false;
	that._hit.show();
	that._stand.show();
	player_cards.length = 0;
	computer_cards.length = 0;
	hit_c = 1;
	that.dealerhand.setText("");
	that.card_count.setText("Cards Left: " + new_deck.get_count())
	that._stand.style.x = (baseWidth / 2) - 150;
	that._stand.style.width = 300;
	computer_cards.push(new_deck.dealCard());
	that.card_count.setText("Cards Left: " + new_deck.get_count())
	that.backview.setImage(ImageMaker("back"));
	animate(that.backview).now({x: (baseWidth / 2) - 150}, 500);
	player_cards.push(new_deck.dealCard());
	that.card_count.setText("Cards Left: " + new_deck.get_count())
	computer_cards.push(new_deck.dealCard());
	that.card_count.setText("Cards Left: " + new_deck.get_count())
	player_cards.push(new_deck.dealCard());
	that.card_count.setText("Cards Left: " + new_deck.get_count())
	that.p1view.setImage(ImageMaker(player_cards[0]._name));
	animate(that.p1view).now({x: (baseWidth / 2) - 150}, 500);
	that.d1view.setImage(ImageMaker(computer_cards[1]._name));
	animate(that.d1view).now({x: (baseWidth / 2) - 50}, 500);
	that.p2view.setImage(ImageMaker(player_cards[1]._name));
	animate(that.p2view).now({x: (baseWidth / 2) - 50}, 500);
	that.playerhand.setText(handValue(player_cards).toString());
	var playerTotal = handValue(player_cards);
	var dealerTotal = handValue(computer_cards);
	if (playerTotal == 21) {
		that._status.setText("Blackjack!");
		that._hit.hide();
	}
	else if (playerTotal > 21) {
		that._status.setText("Busted!");
	}
	else if (player_cards[0].cvalue() == player_cards[1].cvalue()) {
		animate(that.splitview).now({x: 0}, 700);
	}
	else {
		that._status.setText("Hit or Stand?");
	}
}

function hit () {
	var that = this;
	animate(that.splitview).now({x: - 200}, 700);
	player_cards.push(new_deck.dealCard());
	var playerTotal = handValue(player_cards);
	if (hit_c == 1) {
		that.p3view.setImage(ImageMaker(player_cards[2]._name));
		animate(that.p1view).now({x: (baseWidth / 2) - 150}, 500);
		animate(that.p2view).now({x: (baseWidth / 2) - 100}, 500);
		animate(that.p3view).now({x: (baseWidth / 2) - 50}, 500);
		that._stand.style.x = (baseWidth / 2) - 150;
		that._stand.style.width = 300;
		that.playerhand.setText(playerTotal.toString());
		that.card_count.setText("Cards Left: " + new_deck.get_count())
		hit_c += 1;
	} else if (hit_c == 2) {
		that.p4view.setImage(ImageMaker(player_cards[3]._name));
		animate(that.p1view).now({x: (baseWidth / 2) - 175}, 500);
		animate(that.p2view).now({x: (baseWidth / 2) - 125}, 500);
		animate(that.p3view).now({x: (baseWidth / 2) - 75}, 500);
		animate(that.p4view).now({x: (baseWidth / 2) - 25}, 500);
		that._stand.style.x = (baseWidth / 2) - 175;
		that._stand.style.width = 350;
		that.playerhand.setText(playerTotal.toString());
		that.card_count.setText("Cards Left: " + new_deck.get_count())
		hit_c += 1;
	} else if (hit_c == 3) {
		that.p5view.setImage(ImageMaker(player_cards[4]._name));
		animate(that.p1view).now({x: (baseWidth / 2) - 200}, 500);
		animate(that.p2view).now({x: (baseWidth / 2) - 150}, 500);
		animate(that.p3view).now({x: (baseWidth / 2) - 100}, 500);
		animate(that.p4view).now({x: (baseWidth / 2) - 50}, 500);
		animate(that.p5view).now({x: baseWidth / 2}, 500);
		that._stand.style.x = (baseWidth / 2) - 200;
		that._stand.style.width = 400;
		that.playerhand.setText(playerTotal.toString());
		that.card_count.setText("Cards Left: " + new_deck.get_count())
		hit_c += 1;
	}
	if (playerTotal == 21) {
		that._hit.hide();
		that._status.setText("You have 21! \nTap your cards to go on.");
	}
	else if (playerTotal > 21) {
		that._status.setText("Busted!");
		gameon = false;
		that._hit.hide();
        that._stand.hide();
        that._deal.style.visible = true;
	}
	else {
		that._status.setText("Hit or Stand?");
	}
}

function stand () {
	var that = this;
	gameon = false;
	that.backview.setImage(ImageMaker(computer_cards[0]._name));
	var playerTotal = handValue(player_cards);
	var takeNextCardOrFinish = function() {
		var dealerTotal = handValue(computer_cards);
		that.dealerhand.setText(dealerTotal.toString());
		if (computer_cards.length <= 5 && dealerTotal < 17) {
			computer_cards.push(new_deck.dealCard());
			if (computer_cards.length == 3) {
				that.d2view.setImage(ImageMaker(computer_cards[2]._name));
				animate(that.backview).now({x: (baseWidth / 2) - 150}, 500);
				animate(that.d1view).now({x: (baseWidth / 2) - 100}, 500);
				animate(that.d2view).now({x: (baseWidth / 2) - 50}, 500);
				that.dealerhand.setText(dealerTotal.toString());
			}
			else if (computer_cards.length == 4) {
				that.d3view.setImage(ImageMaker(computer_cards[3]._name));
				animate(that.backview).now({x: (baseWidth / 2) - 175}, 500);
				animate(that.d1view).now({x: (baseWidth / 2) - 125}, 500);
				animate(that.d2view).now({x: (baseWidth / 2) - 75}, 500);
				animate(that.d3view).now({x: (baseWidth / 2) - 25}, 500);
				that.dealerhand.setText(dealerTotal.toString());
			}
			else if (computer_cards.length == 5) {
				that.d4view.setImage(ImageMaker(computer_cards[4]._name));
				animate(that.backview).now({x: (baseWidth / 2) - 200}, 500);
				animate(that.d1view).now({x: (baseWidth / 2) - 150}, 500);
				animate(that.d2view).now({x: (baseWidth / 2) - 100}, 500);
				animate(that.d3view).now({x: (baseWidth / 2) - 50}, 500);
				animate(that.d4view).now({x: baseWidth / 2}, 500);
				that.dealerhand.setText(dealerTotal.toString());
			}
			that.card_count.setText("Cards Left: " + new_deck.get_count())
            takeNextCardOrFinish();
        }
        else if (dealerTotal == 21) {
        	if (computer_cards.length == 2 && player_cards.length == 2 && playerTotal == 21) {
        		that._status.setText("PUSH!");
        	}
        	else if (computer_cards.length == 2) {
        		that._status.setText("Dealer have Blackjack!");
        	}
        	else {
        		that._status.setText("Dealer win!");
        	}
            gameon = false;
            that._hit.hide();
            that._stand.hide();
            that._deal.style.visible = true;
        }
        else if (dealerTotal > 21) {
            that._status.setText("You win!");
            gameon = false;
            that._hit.hide();
            that._stand.hide();
            that._deal.style.visible = true;
        }
        else {
        	if (playerTotal > dealerTotal) {
                that._status.setText("You win!");
                gameon = false;
            	that._hit.hide();
            	that._stand.hide();
            	that._deal.style.visible = true;
            }
            else if (playerTotal < dealerTotal) {
                that._status.setText("Dealer win!");
                gameon = false;
            	that._hit.hide();
            	that._stand.hide();
            	that._deal.style.visible = true;
            }
            else {
                that._status.setText("PUSH!");
                gameon = false;
            	that._hit.hide();
            	that._stand.hide();
            	that._deal.style.visible = true;
            }
        }
	}
	takeNextCardOrFinish();
}

function ImageMaker (cardname) {
	var card_image = new Image({url: "resources/images/"+cardname+".png"});
	return card_image;
}