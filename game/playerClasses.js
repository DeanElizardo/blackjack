"use strict";
const readline = require('readline-sync');

class Player {
  constructor(shoe, bustValue) {
    this.bankroll = 100;
    this.shoe = shoe;
    this.hand = new Hand(bustValue);
  }

  hit() {
    this.hand.addCard(this.shoe.draw());
  }

  incrementScore() {
    this.score++;
  }

  reset() {
    this.hand.resetHand();
    this.dealIn();
    this.score = 0;
  }
}

class MachinePlayer extends Player {
  constructor(shoe, bustValue) {
    super(shoe, bustValue);
  }

  isSoftTotal() {
    return this.hand.cards[0].rank === 'A' || this.hand.cards[1].rank === 'A';
  }

  hit(dealerUpcard) {
    // write basic strategy here
  }
}

class Dealer extends Player {
  constructor(shoe, bustValue, pushValue) {
    super(shoe, bustValue);
    this.pushValue = pushValue;
  }

  hit() {
    if (this.hand.points < this.hand.bustValue) {
      while (this.hand.points < this.pushValue) {
        this.hand.addCard(this.deck.draw());
        this.hit();
      }
    }
  }

  showFullHand() {
    console.clear();
    console.log("====================================");
    console.log(this.constructor.name.padStart(21, ' '));
    console.log("====================================");
    this.hand.cards.forEach(card => console.log(`${card.rank} of ${card.suit}`));
    console.log("------------------------------------\n" + `Points: ${this.hand.points}`.padStart(36, ' ') + "\n------------------------------------");
  }
}