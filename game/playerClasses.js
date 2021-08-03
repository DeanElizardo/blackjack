class Player {
  constructor(deck, bustValue) {
    this.score = 0;
    this.deck = deck;
    this.hand = new Hand(bustValue);
    this.dealIn();
  }

  dealIn() {
    this.hand.addCard(this.deck.draw());
    this.hand.addCard(this.deck.draw());
  }

  hit() {
    this.hand.addCard(this.deck.draw());
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

class Dealer extends Player {
  constructor(deck, bustValue, pushValue) {
    super(deck, bustValue);
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