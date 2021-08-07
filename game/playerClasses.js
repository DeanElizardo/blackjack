"use strict";

const CARD = require('./cardClasses.js');

class Player {
  constructor(shoe, bustValue) {
    this.bankroll = 100;
    this.shoe = shoe;
    this.hand = new (CARD.Hand)(bustValue);
    this.header = this.writeHeader("You");
  }

  writeHeader(label) {
    return label.padStart(label.length + ((24 - label.length) / 2), ' ').padEnd(24, ' ');
  }

  hit() {
    this.hand.addCard(this.shoe.draw());
  }

  // TODO Add betting/bankroll methods here

  reset() {
    this.hand.resetHand();
    this.dealIn();
    this.score = 0;
  }
}

class MachinePlayer extends Player {
  constructor(shoe, bustValue) {
    super(shoe, bustValue);
    this.header = this.writeHeader('Machine Player');

    delete this.bankroll;
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
    this.header = this.writeHeader("Dealer");
  }

  hit() {
    if (this.hand.points < this.hand.bustValue) {
      while (this.hand.points < this.pushValue) {
        this.hand.addCard(this.shoe.draw());
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

module.exports = { Player, MachinePlayer, Dealer };