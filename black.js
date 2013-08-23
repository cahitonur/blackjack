function Deck () {
	var suits = ['H', 'S', 'D', 'C'];
	var ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	var deck = [];
	function zero_deck () {
		for (var i = 0; i < suits.length; i++) {
			for (var j = 0; j < ranks.length; j++) {
				deck.push(new Card(suits[i], ranks[j]));
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
		return deck.length;
	}
	this.show_cards = function () {
		var results = [];
		for (var i = 0; i < deck.length; i++) {
			results.push(deck[i]._name())
		};
		return results;
	}
	this.dealCard = function () {
		if (deck.length < 12) {
			this.reset();
		}
		var card = deck[deck.length - 1];
		deck.pop();
		return card;
	}
	return zero_deck();
}

function Card (suit, rank) {
	this.suit = suit;
	this._number = rank;
	this.show_face = true;
	this._name = function () {
		return ""+this.suit+this._number;
	}
	this.hideFace = function () {
		return this.show_face = false;
	}
}

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

var player_cards = [], computer_cards = [];
var new_deck = new Deck();

function start_game () {
	player_cards.length = 0;
	computer_cards.length = 0;
	computer_cards.push(new_deck.dealCard());
	computer_cards.push(new_deck.dealCard());
	player_cards.push(new_deck.dealCard());
	player_cards.push(new_deck.dealCard());
	var playerTotal = handValue(player_cards)
	var dealerTotal = handValue(computer_cards)
	if (playerTotal == 21) {
		console.log("You have Blackjack. Let's see dealer\'s cards.");
		stand();
	}
	else if (playerTotal > 21) {
		console.log("You have"  + playerTotal + "Busted!");
	}
	else {
		console.log("Dealer have: " + computer_cards[1]._name());
		console.log("You have " + playerTotal +".  Hit or Stand?");
	}
}

function hit () {
	player_cards.push(new_deck.dealCard());
	var playerTotal = handValue(player_cards);
	if (playerTotal == 21) {
		console.log("You have Blackjack. You win!");
	}
	else if (playerTotal > 21) {
		console.log("You have"  + playerTotal + "Busted!");
	}
	else {
		console.log("You have " + playerTotal + " Hit or Stand?");
	}
}

function stand () {
	var takeNextCardOrFinish = function() {
		var dealerTotal = handValue(computer_cards);
		var playerTotal = handValue(player_cards);
		if (computer_cards.length <= 5 && dealerTotal <= 17) {
			computer_cards.push(new_deck.dealCard());
            takeNextCardOrFinish();
        }
        else if (dealerTotal == 21) {
            console.log("Dealer have Blackjack, you lost!");
        }
        else if (dealerTotal > 21) {
            console.log("Dealer have " + dealerTotal + ". You win!");
        }
        else {
        	if (playerTotal > dealerTotal)
                console.log("You have " + playerTotal + ". Dealer has " + dealerTotal + ". You win!");
            else if (playerTotal < dealerTotal)
                console.log("You have " + playerTotal + ". Dealer has " + dealerTotal + ". Dealer win!");
            else
                console.log("You and the dealer are tied at " + playerTotal + ". Dealer win!");
        }
	}
	takeNextCardOrFinish();
}
