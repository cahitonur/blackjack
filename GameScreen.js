import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import device;
import src.Deck as Deck;

var gameon = false;
var boundsWidth = 1024;
var boundsHeight = 576;
var baseWidth = device.screen.width * (boundsHeight / device.screen.height);
var baseHeight = boundsHeight;
var scale = device.screen.height / baseHeight;
var card_width = 140;
var card_height = 195;
var pcard_y = baseHeight - 250;
var dcard_y = 50;
var player_cards = [], computer_cards = [], player_split_1 = [], player_split_2 = [];
var new_deck = new Deck();
var hit_c = 1;
var split = false;
var split1 = false;
var split2 = false;
var pot = 0;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: baseWidth,
			height: baseHeight,
			image: "resources/images/onu212.png"
		});

		supr(this, 'init', [opts]);

		this.build();
	};
	this.build = function () {
		this.on('app:start', start_game.bind(this));
		gameon = true;
		this._status = new TextView({
			superview: this,
			x: (baseWidth / 2) - 100,
			y: 10,
			width: 200,
			height: 50,
			fontFamily: "Tahoma",
			autoSize: false,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: true,
			color: '#FFFFFF'
		});
		this.playerhand = new TextView({
			superview: this,
			x:(baseWidth / 2) - 25,
			y: pcard_y - 50,
			width: 50,
			height: 50,
			fontFamily: "Tahoma",
			verticalAlign: 'middle',
			horizontalAlign: 'right',
			color: 'FFFFFF',
			size: 32
		});
		this.dealerhand = new TextView({
			superview: this,
			x:(baseWidth / 6) - 55,
			y: 35,
			width: 50,
			height: 50,
			fontFamily: "Tahoma",
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: 'FFFFFF',
			size: 32
		});
		this.card_count = new TextView({
			superview: this,
			x: baseWidth - 180,
			y: 10,
			width: 150,
			height: 50,
			fontFamily: "Tahoma",
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: 'FFFFFF',
			size: 30
		});
		this._hit = new View({
			superview: this,
			width: baseWidth,
			height: baseHeight,
			x: 0,
			y: 0,
		});
		this._hit.on("InputSelect", hit.bind(this));

		this._splitview = new ImageView({
			superview: this,
			x: -200,
			y: pcard_y - 100,
			width: 100,
			height: 50,
			image: "resources/images/split.png"
		});
		this._splitview.on("InputSelect", SplitHand.bind(this));
		this._splitview.style.visible = false;

		this._stand = new View({
			superview: this,
			width: (baseWidth / 2),
			height: card_height,
			x: 300,
			y: pcard_y,
			zIndex: 2
		});
		this._stand.on("InputSelect", stand.bind(this));

		this._deal = new View({
			superview: this,
			width: baseWidth,
			height: baseHeight,
			x: 0,
			y: 0,
		});
		this._deal.style.visible = false;
		this._deal.on("InputSelect", start_game.bind(this));
	};
	this.game_reset = function () {
		this._deal.style.visible = false;
		this._hit.show();
		this._stand.show();
		player_cards.length = 0;
		computer_cards.length = 0;
		player_split_1.length = 0;
		player_split_2.length = 0;
		hit_c = 1;
		split = false;
		this.dealerhand.setText("");
		this.card_count.setText("Cards Left: " + new_deck.get_count())
		this._stand.style.x = 0;
		this._stand.style.y = pcard_y;
		this._stand.style.width = baseWidth;
		this._stand.style.height = card_height;
		this.playerhand.style.x = (baseWidth / 2) - 25;
	}
});

function start_game () {
	var that = this;
	if (gameon == false) {
		gameon = true;
		view_list = that.getSubviews().slice(7, -1);
		for (var i = view_list.length - 1; i >= 0; i--) {
			that.removeSubview(view_list[i]);
		};
	}
	that.game_reset();
	// Deal Cards
	computer_cards.push(new_deck.dealCard());
	player_cards.push(new_deck.dealCard());
	computer_cards.push(new_deck.dealCard());
	player_cards.push(new_deck.dealCard());
	// Add card views
	that.addSubview(CardMaker("back", baseWidth / 6, dcard_y));
	that.addSubview(computer_cards[1].image((baseWidth / 6) + 30, dcard_y));
	that.addSubview(player_cards[0].image(baseWidth / 4, pcard_y));
	that.addSubview(player_cards[1].image((baseWidth / 4) + 30, pcard_y));

	that.playerhand.setText(handValue(player_cards).toString());

	if (handValue(player_cards) == 21) {
		that._status.setText("Blackjack!");
		that._hit.hide();
		that._stand.style.x = 0;
		that._stand.style.y = 0;
		that._stand.style.width = baseWidth;
		that._stand.style.height = baseHeight;
	}
	else if (handValue(player_cards) > 21) {
		that._status.setText("Busted!");
		that._hit.hide();
		that._stand.hide();
		that._deal.style.visible = true;
	}
	else if (player_cards[0].cvalue() == player_cards[1].cvalue()) {
		that._splitview.style.visible = true;
		animate(that._splitview).now({x: 0}, 700);
		that._status.setText("Hit or Stand?");
	}
	else {
		that._status.setText("Hit or Stand?");
	}
}

function hit () {
	var that = this;
	if (split) {
		if (split1) {
			// add card to players first hand
			player_split_1.push(new_deck.dealCard());
			// show card
			that.addSubview(player_split_1.slice(-1)[0].image(baseWidth / 4 + (player_split_1.length - 1) * 30, pcard_y));
			// set playerhand indicator
			that.playerhand.setText(handValue(player_split_1).toString());
			// check if player have blackjack or busted
			if (handValue(player_split_1) == 21) {
				that._hit.hide();
				that._stand.style.x = 0;
				that._stand.style.y = 0;
				that._stand.style.width = baseWidth;
				that._stand.style.height = baseHeight;
				that._status.setText("You have 21! Tap to continue.");
			}
			else if (handValue(player_split_1) > 21) {
				that._status.setText("Busted! Tap to continue.");
				that._hit.hide();
        		that._stand.style.x = 0;
				that._stand.style.y = 0;
				that._stand.style.width = baseWidth;
				that._stand.style.height = baseHeight;
				// pul the cards out of screen
				first_card = that.getSubview(9);
        		busted_cards = that.getSubviews().slice(11, -1);
        		animate(first_card).now({x: 30}, 700);
        		for (var i = busted_cards.length - 1; i >= 0; i--) {
        			animate(busted_cards[i]).now({x: 30}, 700);
        		};
			}
			else {
				that._status.setText("Hit or Stand?");
			}
		}
		else if (split2) {
			// add card to the second group of cards
			player_split_2.push(new_deck.dealCard());
			p1_index = that.getSubview(10).getPosition();
			that.addSubview(player_split_2.slice(-1)[0].image(baseWidth /2 + (player_split_2.length - 1) * 30, pcard_y));
			that.playerhand.setText(handValue(player_split_2).toString());
			if (handValue(player_split_2) == 21) {
				that._hit.hide();
				that._stand.style.x = 0;
				that._stand.style.y = 0;
				that._stand.style.width = baseWidth;
				that._stand.style.height = baseHeight;
				that._status.setText("You have 21! Tap to continue.");
			}
			else if (handValue(player_split_2) > 21) {
				that._status.setText("Busted! Tap to continue.");
				that._hit.hide();
        		that._stand.style.x = 0;
				that._stand.style.y = 0;
				that._stand.style.width = baseWidth;
				that._stand.style.height = baseHeight;
			}
			else {
				that._status.setText("Hit or Stand?");
			}
		}
	}
	else {
		animate(that._splitview).now({x: - 200}, 700);
		player_cards.push(new_deck.dealCard());
		p1_index = that.getSubviews().slice(-2)[0].getPosition();
		that.addSubview(player_cards.slice(-1)[0].image(baseWidth / 4 + (player_cards.length - 1) * 30, pcard_y));
		that.playerhand.setText(handValue(player_cards).toString());
		if (handValue(player_cards) == 21) {
			that._hit.hide();
			that._stand.style.x = 0;
			that._stand.style.y = 0;
			that._stand.style.width = baseWidth;
			that._stand.style.height = baseHeight;
			that._status.setText("You have 21!");
		}
		else if (handValue(player_cards) > 21) {
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
}

function stand () {
	var that = this;
	if (split) {
		if (split1) {
			// pull the cards to the left of screen
			first_card = that.getSubview(9);
        	good_cards = that.getSubviews().slice(11, -1);
        	animate(first_card).now({x: 30}, 700);
        	for (var i = 0; i < good_cards.length; i++) {
        		animate(good_cards[i]).now({x: (i * 30) + 60}, 700);
        	};
        	that.playerhand.setText(handValue(player_split_2).toString());
        	// button arrangement
        	that._hit.show();
        	that._stand.style.x = (baseWidth / 2) - 150;
			that._stand.style.y = pcard_y;
			that._stand.style.width = 300;
			that._stand.style.height = card_height;
			// pull players second splits first card to the table
			animate(that.getSubview(10)).now({x: baseWidth / 2}, 700);
			split1 = false;
			split2 = true;
		}
		else if (split2) {
			if (player_split_2.length == 1) {
				that._hit.show();
        		that._stand.style.x = (baseWidth / 2) - 150;
				that._stand.style.y = pcard_y;
				that._stand.style.width = 300;
				that._stand.style.height = card_height;
			}
			else {
				split2 = false;
				that.getSubview(7).setImage(ImageMaker(computer_cards[0]._name));
				that.playerhand.setText("");
				var takeNextCardOrFinish = function() {
        			var split_status2 = new TextView({
        				x: baseWidth / 2 + 50,
						y: pcard_y - 50,
						width: 120,
						height: 50,
						fontFamily: "Tahoma",
						verticalAlign: 'middle',
						horizontalAlign: 'center',
						color: 'FFFFFF',
						size: 32
        			});
        			that.addSubview(split_status2);
					var dealerTotal = handValue(computer_cards);
					that.dealerhand.setText("");
					that._status.setText("");
					if (computer_cards.length < 5 && dealerTotal < 17) {
						computer_cards.push(new_deck.dealCard());
						that.addSubview(computer_cards.slice(-1)[0].image(baseWidth / 6 + (computer_cards.length -1) * 30, dcard_y));
						takeNextCardOrFinish();
					}
					else if (dealerTotal == 21) {
        				if (computer_cards.length == 2 && player_split_2.length == 2 && handValue(player_split_2) == 21) {
        					split_status2.setText("PUSH!");
        				}
        				else if (computer_cards.length == 2) {
        					that._status.setText("Dealer have Blackjack!");
        					split_status2.setText(handValue(player_split_2));
        				}
        				else if (computer_cards.length > 2 && player_split_2.length == 2 && handValue(player_split_2) == 21) {
        					split_status2.setText("WIN!");
        				}
        				else if (computer_cards.length > 2 && player_split_2.length > 2 && handValue(player_split_2) == 21) {
        					split_status2.setText("PUSH!");
        				}
        				else {
        					split_status2.setText("LOSE!");
        				}
            			gameon = false;
            			that._hit.hide();
            			that._stand.hide();
            			that._deal.style.visible = true;
            			checkSecondGroup();
        			}
        			else if (handValue(player_split_2) > 21) {
                		split_status2.setText("Busted!");
                		gameon = false;
            			that._hit.hide();
            			that._stand.hide();
            			that._deal.style.visible = true;
            			checkSecondGroup();
            		}
        			else if (dealerTotal > 21) {
		            	split_status2.setText("WIN!");
		            	gameon = false;
            			that._hit.hide();
            			that._stand.hide();
            			that._deal.style.visible = true;
            			checkSecondGroup();
        			}
        			else {
        				if (handValue(player_split_2) > dealerTotal) {
                			split_status2.setText("WIN!");
                			gameon = false;
            				that._hit.hide();
            				that._stand.hide();
            				that._deal.style.visible = true;
            				checkSecondGroup();
            			}
            			else if (handValue(player_split_2) < dealerTotal) {
                			split_status2.setText("LOSE!");
                			gameon = false;
            				that._hit.hide();
            				that._stand.hide();
            				that._deal.style.visible = true;
            				checkSecondGroup();
            			}
            			else {
               				split_status2.setText("PUSH!");
                			gameon = false;
            				that._hit.hide();
            				that._stand.hide();
            				that._deal.style.visible = true;
            				checkSecondGroup();
            			}
        			}
        		}
        		var checkSecondGroup = function () {
        			var dealerTotal = handValue(computer_cards);
        			var split_status1 = new TextView({
        				x: 80,
						y: pcard_y - 50,
						width: 120,
						height: 50,
						fontFamily: "Tahoma",
						verticalAlign: 'middle',
						horizontalAlign: 'center',
						color: 'FFFFFF',
						size: 32
        			});
        			that.addSubview(split_status1);
					that.dealerhand.setText(dealerTotal.toString());
					if (handValue(player_split_1) > 21) {
						split_status1.setText("Busted");
					}
        			else if (dealerTotal == 21) {
        				if (computer_cards.length == 2 && player_split_1.length == 2 && handValue(player_split_1) == 21) {
        					split_status1.setText("PUSH!");
        				}
        				else if (computer_cards.length == 2) {
        					that._status.setText("Dealer have Blackjack!");
        					split_status1.setText(handValue(player_split_1).toString());
        				}
        				else if (computer_cards.length > 2 && player_split_1.length == 2 && handValue(player_split_1) == 21) {
        					split_status1.setText("WIN!");
        				}
        				else if (computer_cards.length > 2 && player_split_1.length > 2 && handValue(player_split_1) == 21) {
        					split_status1.setText("PUSH!");
        				}
        				else {
        					split_status1.setText("LOSE!");
        				}
        			}
        			else if (dealerTotal > 21) {
		            	split_status1.setText("WIN!");
        			}
        			else {
        				if (handValue(player_split_1) > dealerTotal) {
                			split_status1.setText("WIN!");
            			}
            			else if (handValue(player_split_1) < dealerTotal) {
                			split_status1.setText("LOSE!");
            			}
            			else {
               				split_status1.setText("PUSH!");
            			}
        			}
        		}
				takeNextCardOrFinish();
			}
		}
	}
	else {
		gameon = false;
		animate(that._splitview).now({x: - 200}, 700);
		that.getSubview(7).setImage(ImageMaker(computer_cards[0]._name));
		var playerTotal = handValue(player_cards);
		var takeNextCardOrFinish = function() {
			var dealerTotal = handValue(computer_cards);
			that.dealerhand.setText(dealerTotal.toString());
			if (computer_cards.length < 5 && dealerTotal < 17) {
				computer_cards.push(new_deck.dealCard());
				that.addSubview(computer_cards.slice(-1)[0].image(baseWidth / 6 + (computer_cards.length -1) * 30, dcard_y));
				takeNextCardOrFinish();
			}
			else if (dealerTotal == 21) {
        		if (computer_cards.length == 2 && player_cards.length == 2 && playerTotal == 21) {
        			that._status.setText("PUSH!");
        		}
        		else if (computer_cards.length == 2) {
        			that._status.setText("Dealer have Blackjack!");
        		}
        		else if (computer_cards.length > 2 && player_cards.length == 2 && playerTotal == 21) {
        			that._status.setText("You win!");
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

function CardMaker (cardname, cardx, cardy) {
	var card_view = new ImageView({
		x: cardx,
		y: cardy,
		width: card_width,
		height: card_height,
		image: "resources/images/" + cardname + ".png"
		// zIndex: 0
	});
	return card_view;
}

function ImageMaker (cardname) {
	var card_image = new Image({url: "resources/images/"+cardname+".png"});
	return card_image;
}

function SplitHand () {
	var that = this;
	split = true;
	split1 = true;
	player_split_1.push(player_cards[0]);
	player_split_2.push(player_cards[1]);
	animate(that._splitview).now({x: -200}, 700);
	animate(that.getSubviews().slice(-2)[0]).now({x: baseWidth - (card_width / 2)}, 500);
	that._status.setText("Hit or Stand?");
	that.playerhand.setText(handValue(player_split_1).toString());
}