import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import device;
import AudioManager;
import src.Deck as Deck;

var gameon = false,
boundsWidth = 1024,
boundsHeight = 576,
baseWidth = device.screen.width * (boundsHeight / device.screen.height),
baseHeight = boundsHeight,
scale = device.screen.height / baseHeight,
card_width = 140,
card_height = 195,
pcard_y = baseHeight - 250,
dcard_y = 50,
player_cards = [], computer_cards = [], player_split_1 = [], player_split_2 = [],
new_deck = new Deck(),
split = false,
split1 = false,
split2 = false,
bet = 0,
bankroll = 1000,
p1_x = (baseWidth / 2) - (card_width / 2);

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

		this._sound = new AudioManager({
			path: "resources/audio/",

			files: {
				card_sound: {
					volume: 0.8
				},
				shuffle_sound: {
					volume: 0.8
				},
				chip: {
					volume: 0.8
				}
			}
		});

		this.build();
	};
	this.build = function () {
		gameon = true;
		this.on("Stand", stand.bind(this));
		this.on("betzero", betreset.bind(this));
		this._status = new TextView({
			superview: this,
			x: (baseWidth / 2) - 100,
			y: baseHeight / 2 - 100,
			width: 200,
			height: 50,
			fontFamily: "King Richard",
			autoSize: false,
			size: 34,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: true,
			color: '#FFFFFF',
			text: "Place Your Bet"
		});
		this._bet = new TextView({
			superview: this,
			x: (baseWidth / 2) - 50,
			y: 60,
			width: 100,
			height: 50,
			fontFamily: "King Richard",
			autoSize: false,
			size: 30,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: true,
			color: '#FFFFFF'
		});
		this._bet_reset = new View ({
			superview: this,
			x: (baseWidth / 2) - 50,
			y: 60,
			width: 100,
			height: 50,
			zIndex: 4
		});
		this._bet_reset.on("InputSelect", betreset.bind(this));

		this._doubleview = new ImageView({
			superview: this,
			x: -200,
			y: pcard_y - 20,
			width: 100,
			height: 50,
			image: "resources/images/double.png",
			zIndex: 1
		});
		this._doubleview.on("InputSelect", DoubleDown.bind(this));
		this._doubleview.style.visible = false;

		this._bankroll = new TextView({
			superview: this,
			x: baseWidth - 180,
			y: 60,
			width: 150,
			height: 50,
			fontFamily: "King Richard",
			verticalAlign: 'middle',
			horizontalAlign: 'right',
			color: '#FFFFFF',
			size: 30
		});
		this._bankroll.setText("$ " + bankroll);
		this._chip5 = new ImageView({
			superview: this,
			x: baseWidth - 104,
			y: baseHeight - 460,
			width: 72,
			height: 72,
			image: "resources/images/5.png"
		});
		this._chip5.on("InputSelect", set_bet.bind(this, 5));

		this._chip10 = new ImageView({
			superview: this,
			x: baseWidth - 104,
			y: baseHeight - 378,
			width: 72,
			height: 72,
			image: "resources/images/10.png"
		});
		this._chip10.on("InputSelect", set_bet.bind(this, 10));

		this._chip50 = new ImageView({
			superview: this,
			x: baseWidth - 104,
			y: baseHeight - 296,
			width: 72,
			height: 72,
			image: "resources/images/50.png"
		});
		this._chip50.on("InputSelect", set_bet.bind(this, 50));

		this._chip100 = new ImageView({
			superview: this,
			x: baseWidth - 102,
			y: baseHeight - 214,
			width: 72,
			height: 72,
			image: "resources/images/100.png"
		});
		this._chip100.on("InputSelect", set_bet.bind(this, 100));

		this._chip500 = new ImageView({
			superview: this,
			x: baseWidth - 102,
			y: baseHeight - 132,
			width: 72,
			height: 72,
			image: "resources/images/500.png"
		});
		this._chip500.on("InputSelect", set_bet.bind(this, 500));

		this.playerhand = new TextView({
			superview: this,
			x:(baseWidth / 2) - 25,
			y: pcard_y - 50,
			width: 50,
			height: 50,
			fontFamily: "King Richard",
			verticalAlign: 'middle',
			horizontalAlign: 'right',
			color: '#FFFFFF',
			size: 32
		});
		this.dealerhand = new TextView({
			superview: this,
			x:(baseWidth / 6) - 55,
			y: 35,
			width: 50,
			height: 50,
			fontFamily: "King Richard",
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			color: '#FFFFFF',
			size: 32
		});
		this.card_count = new TextView({
			superview: this,
			x: baseWidth - 180,
			y: 10,
			width: 150,
			height: 50,
			fontFamily: "King Richard",
			verticalAlign: 'middle',
			horizontalAlign: 'right',
			color: '#FFFFFF',
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
		this._hit.style.visible = false;

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
			zIndex: 2
		});
		this._stand.on("InputSelect", stand.bind(this));

		this._deal = new View({
			superview: this,
			width: baseWidth,
			height: baseHeight,
			x: 0,
			y: 0
		});
		this._deal.hide();
		this._deal.on("InputSelect", start_game.bind(this));
	};
	this.game_reset = function () {
		this._deal.style.visible = false;
		this._hit.style.width = baseWidth;
		this._hit.style.visible = true;
		this._stand.show();
		player_cards.length = 0;
		computer_cards.length = 0;
		player_split_1.length = 0;
		player_split_2.length = 0;
		bankroll -= bet;
		split = false;
		this.dealerhand.setText("");
		this.playerhand.setText("");
		this._status.setText("");
		this.card_count.setText("Cards Left: " + new_deck.get_count());
		this.stand_adapt();
		this.playerhand.style.x = (baseWidth / 2) - 25;
	}
	this.stand_adapt = function () {
		this._stand.updateOpts({x: p1_x, y: pcard_y, width: card_width + 30, height: card_height});
	}
	this.bring_stand_front = function () {
		this._hit.hide();
		this._stand.updateOpts({x: 0, y: 0, width: baseWidth, height: baseHeight, zIndex: 999});
	}
	this.bring_deal_front = function () {
		gameon = false;
        this._hit.hide();
        this._stand.hide();
        this._deal.style.visible = true;
	}
});

function betreset () {
	var that = this;
	bet = 0;
	that._bet.setText("$ " + bet);
}

function set_bet (amount) {
	var that = this;
	that._bet_reset.show();
	if (bankroll >= bet + amount) {
		bet += amount;
		that._bet.setText("$ " + bet);
		that._sound.play('chip');
		that._status.setText("Tap Desk to Deal");
		that._deal.show();
		that._deal.style.width = baseWidth - 114;
	}
	else {
		that._status.setText("Not Enough Chips!");
	}
}

function start_game () {
	var that = this;
	if (bankroll > 0 && bankroll >= bet) {
		if (bet > 0) {
			if (gameon == false) {
				gameon = true;
				view_list = that.getSubviews().slice(15, -2);
				for (var i = view_list.length - 1; i >= 0; i--) {
					that.removeSubview(view_list[i]);
				};
			}
			that.game_reset();
			that._bet_reset.hide();
			that._bankroll.setText("$ " + bankroll);
			// Deal Cards
			computer_cards.push(new_deck.dealCard());
			player_cards.push(new_deck.dealCard());
			computer_cards.push(new_deck.dealCard());
			player_cards.push(new_deck.dealCard());
			that._sound.play('card_sound');
			setTimeout(function() {that._sound.play('card_sound')}, 600);
			setTimeout(function() {that._sound.play('card_sound')}, 1100);
			setTimeout(function() {that._sound.play('card_sound')}, 1600);
			// Add card views
			that.addSubview(CardMaker("back", baseWidth / 2, -200));
			that.addSubview(computer_cards[1].image(baseWidth / 2, -200));
			that.addSubview(player_cards[0].image(baseWidth / 2, -200));
			that.addSubview(player_cards[1].image(baseWidth / 2, -200));
			setTimeout(function () {
				first_cards = that.getSubviews().slice(-6, -2);
				animate(first_cards[0]).now({x: baseWidth / 6, y: dcard_y}, 300, animate.easeIn);
				animate(first_cards[2]).wait(500)
					.then({x: p1_x, y: pcard_y}, 300, animate.easeIn);
				animate(first_cards[1]).wait(1000)
					.then({x: baseWidth / 6 + 30, y: dcard_y}, 300, animate.easeIn);
				animate(first_cards[3]).wait(1500)
					.then({x: p1_x + 30, y: pcard_y}, 300, animate.easeIn);
			}, 100);
			that.card_count.setText("Cards Left: " + new_deck.get_count());
			setTimeout(function () {that.playerhand.setText(handValue(player_cards).toString())}, 1500);
			// check player hand against blackjack and over
			// and split situation & double situation
			if (handValue(player_cards) == 21) {
				setTimeout(function () {
					that._status.setText("Blackjack!");
					that._hit.hide();
					setTimeout(function () {
						that.emit("Stand");
					}, 500);
				}, 1500);
			}
			else if (player_cards[0].cvalue() == player_cards[1].cvalue()) {
				that._splitview.style.visible = true;
				animate(that._splitview).wait(500)
					.then({x: 0}, 700);
				that._status.setText("Hit or Stand?");
			}
			else {
				setTimeout(function () {
					that._status.setText("Hit or Stand?");
				}, 1500);
			}
			if (handValue(player_cards) < 18) {
				that._doubleview.style.visible = true;
				animate(that._doubleview).wait(500)
					.then({x: 0}, 700);
			}
		}
		else {
			that._status.setText("Place Your Bet!");
			animate(that._status).now({y: 100 }, 300)
				.then({y: baseHeight / 2 - 100}, 400);
		}
	}
	else {
		that._status.setText("Sorry Not Enough Chips!");
	}
}

function hit () {
	var that = this;
	if (split) {
		if (split1) {
			// add card to players first hand
			player_split_1.push(new_deck.dealCard());
			that.card_count.setText("Cards Left: " + new_deck.get_count());
			// show card
			that.addSubview(player_split_1.slice(-1)[0].image(baseWidth/2, -80));
			setTimeout(function () {
				last_card = that.getSubviews().slice(-3)[0];
				animate(last_card).now({x: p1_x + (player_split_1.length - 1) * 30, y: pcard_y}, 300, animate.easeIn);
			}, 100);
			that._sound.play('card_sound');
			// set playerhand indicator
			that.playerhand.setText(handValue(player_split_1).toString());
			that._stand.style.width += 30;
			// check if player have blackjack or busted
			if (handValue(player_split_1) == 21) {
				that._status.setText("You have 21!");
				setTimeout(function () {
					that.emit("Stand");
				}, 500);
			}
			else if (handValue(player_split_1) > 21) {
				that._status.setText("Busted!");
				setTimeout(function () {
					that.emit("Stand");
				}, 500);
			}
			else {
				that._status.setText("Hit or Stand?");
			}
		}
		else if (split2) {
			// add card to the second group of cards
			player_split_2.push(new_deck.dealCard());
			that.card_count.setText("Cards Left: " + new_deck.get_count());
			that.addSubview(player_split_2.slice(-1)[0].image(baseWidth/2, -80));
			setTimeout(function () {
				last_card = that.getSubviews().slice(-3)[0];
				animate(last_card).now({x: p1_x + (player_split_2.length - 1) * 30, y: pcard_y}, 300, animate.easeIn);
			}, 100);
			that._sound.play('card_sound');
			that._stand.style.width += 30;
			that.playerhand.setText(handValue(player_split_2).toString());
			// check if player have 21 or more
			if (handValue(player_split_2) == 21) {
				setTimeout(function () {
					that.emit("Stand");
				}, 500);
			}
			else if (handValue(player_split_2) > 21) {
				that._status.setText("Busted!");
				// that._bet_reset.show();
				setTimeout(function () {
					that.emit("Stand");
				}, 500);
			}
			else {
				that._status.setText("Hit or Stand?");
			}
		}
	}
	else {
		animate(that._splitview).now({x: - 200}, 700);
		animate(that._doubleview).now({x: - 200}, 700);
		player_cards.push(new_deck.dealCard());
		that.card_count.setText("Cards Left: " + new_deck.get_count());
		that.addSubview(player_cards.slice(-1)[0].image(baseWidth/2, -80));
		setTimeout(function () {
			last_card = that.getSubviews().slice(-3)[0];
			animate(last_card).now({x: p1_x + (player_cards.length - 1) * 30, y: pcard_y}, 300, animate.easeIn);
		},100);
		that._sound.play('card_sound');
		that._stand.style.width += 30;
		that.playerhand.setText(handValue(player_cards).toString());
		if (handValue(player_cards) == 21) {
			that._status.setText("You have 21!");
			setTimeout(function () {
					that.emit("Stand");
				}, 500);
		}
		else if (handValue(player_cards) > 21) {
			that._status.setText("Busted!");
			gameon = false;
			that._hit.hide();
        	that._stand.hide();
        	that.emit("betzero");
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
			first_card = that.getSubview(17);
        	good_cards = that.getSubviews().slice(19, -2);
        	animate(first_card).now({x: 30}, 700, animate.easeOut);
        	for (var i = 0; i < good_cards.length; i++) {
        		animate(good_cards[i]).now({x: (i * 30) + 60}, 700, animate.easeOut);
        	};
        	that.playerhand.setText(handValue(player_split_2).toString());
        	// button arrangement
        	that._hit.show();
        	that.stand_adapt();
			// pull players second splits first card to the table
			animate(that.getSubview(18)).wait(500)
				.then({x: p1_x, y: pcard_y}, 400, animate.easeIn);
			split1 = false;
			split2 = true;
		}
		else if (split2) {
			if (player_split_2.length == 1) {
				that._hit.show();
        		that.stand_adapt();
			}
			else {
				split2 = false;
				that.getSubview(15).setImage(ImageMaker(computer_cards[0]._name));
				that.playerhand.setText("");
				var takeNextCardOrFinish = function() {
        			var split_status2 = new TextView({
        				x: baseWidth / 2 - 60,
						y: pcard_y - 50,
						width: 120,
						height: 50,
						fontFamily: "King Richard",
						verticalAlign: 'middle',
						horizontalAlign: 'center',
						color: '#FFFFFF',
						size: 32,
						zIndex: 1
        			});
        			that.addSubview(split_status2);
					var dealerTotal = handValue(computer_cards);
					that.dealerhand.setText(dealerTotal.toString());
					that._status.setText("");
					if (handValue(player_split_2) > 21) {
                		split_status2.setText("Busted!");
                		end_game();
            		}
					else if (computer_cards.length < 5 && dealerTotal < 17) {
						computer_cards.push(new_deck.dealCard());
						that.card_count.setText("Cards Left: " + new_deck.get_count());
						setTimeout(function () {
							that._sound.play('card_sound');
							that.addSubview(computer_cards.slice(-1)[0].image(baseWidth / 6 + (computer_cards.length -1) * 30, dcard_y));
							takeNextCardOrFinish();
						}, 1000);
					}
					else if (dealerTotal == 21) {
        				if (handValue(player_split_2) == 21) {
        					if (computer_cards.length == player_split_2.length) {
        						split_status2.setText("PUSH!");
        						bankroll += bet;
        					}
        					else if (computer_cards.length > player_split_2.length) {
        						split_status2.setText("WIN!");
        						bankroll += bet * 2;
        					}
        					else {
        						split_status2.setText("LOSE!");
        					}
        				}
        				else {
        					split_status2.setText("LOSE!");
        				}
        				that._bankroll.setText("$ " + bankroll);
            			end_game();
        			}
        			else if (dealerTotal > 21) {
		            	split_status2.setText("WIN!");
		            	bankroll += bet * 2;
		            	that._bankroll.setText("$ " + bankroll);
		            	end_game();
        			}
        			else {
        				if (handValue(player_split_2) > dealerTotal) {
                			split_status2.setText("WIN!");
                			bankroll += bet * 2;
                			end_game();
            			}
            			else if (handValue(player_split_2) < dealerTotal) {
                			split_status2.setText("LOSE!");
                			end_game();
            			}
            			else {
               				split_status2.setText("PUSH!");
               				bankroll += bet;
                			end_game();
            			}
            			that._bankroll.setText("$ " + bankroll);
        			}
        		}
        		var end_game = function () {
        			gameon = false;
            		that._hit.hide();
            		that._stand.hide();
            		that._deal.style.visible = true;
            		checkSecondGroup();
        		}
        		var checkSecondGroup = function () {
        			var dealerTotal = handValue(computer_cards);
        			var split_status1 = new TextView({
        				x: 60,
						y: pcard_y - 50,
						width: 120,
						height: 50,
						fontFamily: "King Richard",
						verticalAlign: 'middle',
						horizontalAlign: 'center',
						color: '#FFFFFF',
						size: 32,
						zIndex: 1
        			});
        			that.addSubview(split_status1);
					that.dealerhand.setText(dealerTotal.toString());
					that.card_count.setText("Cards Left: " + new_deck.get_count());
					if (handValue(player_split_1) > 21) {
						split_status1.setText("Busted");
						that.emit("betzero");
					}
        			else if (dealerTotal == 21) {
        				if (handValue(player_split_1) == 21) {
        					if (computer_cards.length == player_split_1.length) {
        						split_status1.setText("PUSH!");
        						bankroll += bet;
        						that.emit("betzero");
        					}
        					else if (computer_cards.length > player_split_1.length) {
        						split_status1.setText("WIN!");
        						bankroll += bet * 2;
        						that.emit("betzero");
        					}
        					else {
        						split_status1.setText("LOSE!");
        						that.emit("betzero");
        					}
        				}
        				else {
        					split_status1.setText("LOSE!");
        					that.emit("betzero");
        				}
        				that._bankroll.setText("$ " + bankroll);
        				//that._status.setText("Tap to Contiue!");
        			}
        			else if (dealerTotal > 21) {
		            	split_status1.setText("WIN!");
		            	bankroll += bet * 2;
		            	that.emit("betzero");
		            	that._bankroll.setText("$ " + bankroll);
        			}
        			else {
        				if (handValue(player_split_1) > dealerTotal) {
                			split_status1.setText("WIN!");
                			bankroll += bet * 2;
                			that.emit("betzero");
            			}
            			else if (handValue(player_split_1) < dealerTotal) {
                			split_status1.setText("LOSE!");
                			that.emit("betzero");
            			}
            			else {
               				split_status1.setText("PUSH!");
               				bankroll += bet;
               				that.emit("betzero");
            			}
            			that._bankroll.setText("$ " + bankroll);
        			}
        		}
        		//that._bet_reset.show();
				takeNextCardOrFinish();
			}
		}
	}
	else {
		gameon = false;
		that._status.setText("Dealer\'s Turn");
		animate(that._splitview).now({x: - 200}, 700, animate.easeOut);
		animate(that._doubleview).now({x: - 200}, 700, animate.easeOut);
		that.getSubview(15).setImage(ImageMaker(computer_cards[0]._name));
		var playerTotal = handValue(player_cards);
		var takeNextCardOrFinish = function() {
			var dealerTotal = handValue(computer_cards);
			that.dealerhand.setText(dealerTotal.toString());
			if (computer_cards.length < 5 && dealerTotal < 17) {
				computer_cards.push(new_deck.dealCard());
				that.card_count.setText("Cards Left: " + new_deck.get_count());
				setTimeout(function() {
					that.addSubview(computer_cards.slice(-1)[0].image(baseWidth / 6 + (computer_cards.length -1) * 30, dcard_y));
					that._sound.play('card_sound');
					takeNextCardOrFinish();
				}, 700);
			}
			else if (dealerTotal == 21) {
        		if (playerTotal == 21) {
        			if (computer_cards.length == player_cards.length){
        				that._status.setText("PUSH!");
        				bankroll += bet;
        				that.emit("betzero");
        			}
        			else if (player_cards.length == 2) {
        				that._status.setText("WIN!");
        				bankroll += bet + (bet * 1.5);
        				that.emit("betzero");
        			}
        			else if (player_cards.length > computer_cards.length) {
        				that._status.setText("WIN!");
        				bankroll += bet * 2;
        				that.emit("betzero");
        			}
        			else {
        				that._status.setText("LOSE!");
        				that.emit("betzero");
        			}
        		}
        		else {
        			that._status.setText('Dealer Win!');
        			that.emit("betzero");
        		}
            	that.bring_deal_front();
            	that._bankroll.setText("$ " + bankroll);
            	that.card_count.setText("Cards Left: " + new_deck.get_count());
        	}
        	else if (dealerTotal > 21) {
            	that._status.setText("You win!");
            	if (playerTotal == 21) {
                	bankroll += bet + (bet * 1.5);
                	that.emit("betzero");
                }
                else {
            		bankroll += bet * 2;
            		that.emit("betzero");
            	}
            	that._bankroll.setText("$ " + bankroll);
            	that.card_count.setText("Cards Left: " + new_deck.get_count());
            	that.bring_deal_front();
        	}
        	else {
        		if (playerTotal > dealerTotal) {
                	that._status.setText("You win!");
                	if (playerTotal == 21 && player_cards.length == 2) {
                		bankroll += bet + (bet * 1.5);
                		that.emit("betzero");
                	}
                	else {
                		bankroll += bet * 2;
                		that.emit("betzero");
                	}
                	that.bring_deal_front();
            	}
            	else if (playerTotal < dealerTotal) {
                	that._status.setText("Dealer win!");
                	that.emit("betzero");
                	that.bring_deal_front();
            	}
            	else {
                	that._status.setText("PUSH!");
                	that.bring_deal_front();
                	bankroll += bet;
                	that.emit("betzero");
            	}
            	that._bankroll.setText("$ " + bankroll);
            	that.card_count.setText("Cards Left: " + new_deck.get_count());
        	}
		}
		takeNextCardOrFinish();
		that._hit.hide();
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
		image: "resources/images/" + cardname + ".png",
		zIndex: 1
	});
	return card_view;
}

function ImageMaker (cardname) {
	var card_image = new Image({url: "resources/images/"+cardname+".png"});
	return card_image;
}

function SplitHand () {
	var that = this;
	if (bankroll >= bet) {
		split = true;
		split1 = true;
		bankroll -= bet;
		that._bankroll.setText("$ " + bankroll);
		player_split_1.push(player_cards[0]);
		player_split_2.push(player_cards[1]);
		animate(that._splitview).now({x: -200}, 700);
		animate(that._doubleview).now({x: - 200}, 700);
		animate(that.getSubviews().slice(-3)[0]).now({x: baseWidth / 2 + card_width + 60, y: baseHeight / 4 + 20}, 500, animate.easeOut);
		that._status.setText("Hit or Stand?");
		that.playerhand.setText(handValue(player_split_1).toString());
	}
	else {
		that._status.setText("Not Enough Chips!");
		setTimeout(function () {that._status.setText("Hit or Stand?")}, 1000);
	}
}

function DoubleDown () {
	var that = this;
	if (bankroll >= bet) {
		bankroll -= bet;
		that._bankroll.setText("$ " + bankroll);
		bet = bet * 2
		that._bet.setText("$ " + bet);
		animate(that._doubleview).now({x: - 200}, 700);
		player_cards.push(new_deck.dealCard());
		that.card_count.setText("Cards Left: " + new_deck.get_count());
		that.addSubview(player_cards.slice(-1)[0].image(baseWidth/2, -80));
		setTimeout(function () {
			last_card = that.getSubviews().slice(-3)[0];
			animate(last_card).now({x: p1_x + (player_cards.length - 1) * 30, y: pcard_y}, 300, animate.easeIn);
		},100);
		that._sound.play('card_sound');
		that.playerhand.setText(handValue(player_cards).toString());
		if (handValue(player_cards) > 21) {
			setTimeout(function () {
				gameon = false;
				that.emit("betzero");
				that._status.setText("Busted!");
				that._hit.hide();
				that._stand.hide();
				that._deal.style.visible = true;
			}, 500);
		}
		else {
			that.emit("Stand");
		}
	}
}