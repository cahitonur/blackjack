import ui.View as View;
import ui.ImageView as ImageView;
import device;

var boundsWidth = 576;
var boundsHeight = 1024;
var baseWidth = boundsWidth;
var baseHeight =  device.screen.height * (boundsWidth / device.screen.width);
var card_width = 140;
var card_height = 195;
var pcard_y = baseHeight - 450;
var dcard_y = 50;

exports = Class(function() {
	var suits = ['h', 's', 'd', 'c'];
	var ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	var deck = [];
	function zero_deck () {
		for (var i = 0; i < suits.length; i++) {
			for (var j = 0; j < ranks.length; j++) {
				for (var k = 0; k < 6; k++) {
					deck.push(new Card(suits[i], ranks[j]));
				};
			};
		};

		var counter = deck.length, temp, index;

    	while (counter--) {
        	index = (Math.random() * counter) | 0;
        	temp = deck[counter];
        	deck[counter] = deck[index];
        	deck[index] = temp;
    	};
	}
	this.reset = function () {
		deck = []
		return zero_deck();
	}
	this.get_count = function () {
		return deck.length.toString();
	}
	this.dealCard = function () {
		if (deck.length < 120) {
			this.reset();
		}
		var card = deck[deck.length - 1];
		deck.pop();
		return card;
	}
	return zero_deck();
});

function Card (suit, rank) {
	this.suit = suit;
	this._number = rank;
	this.show_face = true;
	this._name = ""+this.suit+this._number.toString();
	this.cvalue = function () {
		var card_value;
		if (this._number == 1) {
			card_value = 10
		}
		else {
			card_value = Math.min(10, this._number);
		}
		return card_value;
	}
	this.image = function (cardx, cardy) {
		var image_view = new ImageView ({
			x: cardx,
			y: cardy,
			width: card_width,
			height: card_height,
			image: "resources/images/" + this._name + ".png",
			zIndex: 1
		});
		return image_view;
	}
}