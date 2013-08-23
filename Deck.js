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
		var card_value = Math.min(10, this._number);
		return card_value;
	}
}