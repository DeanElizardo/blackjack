class Card {
  constructor(identity) {
    Card.setSuit(this, identity);
    Card.setRank(this, identity);
    Card.setValue(this);
  }

  static setSuit(card, identity) {
    switch (identity.split('.')[0]) {
      case 'H':
        card.suit = 'Hearts';
        break;
      case 'D':
        card.suit = 'Diamonds';
        break;
      case 'C':
        card.suit = 'Clubs';
        break;
      case 'S':
        card.suit = 'Spades';
        break;
      default:
    }
  }

  static setRank(card, identity) {
    switch (identity.split('.')[1]) {
      case 'A':
        card.rank = 'Ace';
        break;
      case 'J':
        card.rank = 'Jack';
        break;
      case 'Q':
        card.rank = 'Queen';
        break;
      case 'K':
        card.rank = 'King';
        break;
      default:
        card.rank = identity.split('.')[1];
    }
  }

  static setValue(card) {
    if (card.rank.match(/(J|Q|K)/)) {
      card.value = 10;
    } else if (card.rank.match(/A/)) {
      card.value = 11;
    } else {
      card.value = Number(card.rank);
    }
  }

  static demoteAceValue(card) {
    card.value = 1;
  }
}

class Deck {
  constructor() {
    this.deck = Deck.createDeck();
  }

  static createDeck() {
    let suits = [ 'H.', 'S.', 'C.', 'D.' ];
    let ranks = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];
    let deck = [];

    suits.map(suit => ranks.map(rank => suit + rank)).flat().forEach(card => {
      deck.push(new Card(card));
    });

    return deck;
  }

  draw() {
    let idx = Math.floor(Math.random() * this.deck.length);
    let card = this.deck.splice(idx, 1)[0];

    return card;
  }

  reshuffle() {
    this.deck = Deck.createDeck();
  }
}

class Shoe {
  constructor() {
    this.shoe = [];
    this.buildShoe();
  }

  length() {
    return this.shoe.length;
  }

  buildShoe() {
    for (let i = 0; i < 6; i++) {
      this.shoe.push((new Deck()).deck);
    }

    this.shoe = this.shoe.flat();
  }

  reshuffle() {
    this.shoe = [];
    this.buildShoe();
  }

  draw() {
    let idx = Math.floor(Math.random() * this.length());
    let card = this.shoe.splice(idx, 1)[0];

    return card;
  }
}

class Hand {
  constructor(bustValue) {
    this.cards = [];
    this.aces = [];
    this.points = 0;
    this.bustValue = bustValue;
  }

  addCard(card) {
    this.cards.push(card);
    if (card.rank === 'Ace') {
      this.aces.push(card);
    }

    this.points += card.value;

    if (this.points > this.bustValue) {
      this.rectifyAces();
    }
  }

  rectifyAces() {
    if (this.aces.length > 0 && this.points > this.bustValue) {
      let card = this.aces.shift();
      Card.demoteAceValue(card);
      this.updatePoints();
      this.rectifyAces();
    }
  }

  updatePoints() {
    this.points = this.cards.reduce((points, card) => points + card.value, 0);
  }

  resetHand() {
    this.cards = [];
    this.aces = [];
    this.points = 0;
  }
}

let testShoe = new Shoe();
let j = testShoe.length();
for (let i = 1 ; i < j; i++) { testShoe.draw() };
console.log(testShoe);
console.log(testShoe.length());
testShoe.reshuffle();
console.log(testShoe.length());