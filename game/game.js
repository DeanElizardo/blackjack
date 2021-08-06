"use strict";

const readline = require('readline-sync');
const CARD = require('./cardClasses.js');
const PARTICIPANT = require('./playerClasses.js');


class Game {
  constructor() {
    this.bustValue = 21;
    this.pushValue = 17;
    this.shoe = new (CARD.Shoe)();
    this.reshuffleLimit = this.shoe.length() * (0.17);
    this.seats = [];
    this.fillSeats();
  }

  fillSeats() {
    let humanSeat = Math.floor(Math.random() * 7);
    for (let idx = 0; idx < 7; idx++) {
      if (idx === humanSeat) {
        this.seats[idx] = new (PARTICIPANT.Player)(this.shoe, this.bustValue);
      } else {
        this.seats[idx] =
          new (PARTICIPANT.MachinePlayer)(this.shoe, this.bustValue);
      }
    }

    this.seats
      .push(
        new (PARTICIPANT.Dealer)(this.shoe, this.bustValue, this.pushValue)
      );
  }

  deal() {
    for (let count = 0; count < 2; count++) {
      this.seats.forEach(participant => {
        participant.hand.addCard(this.shoe.draw());
      });
    }
  }

  reshuffle() {
    this.shoe.reshuffle();
  }

  prettyPrintHeaders() {
    let headerString = '|';
    this.seats.forEach(participant => {
      if (participant.constructor.name !== 'Dealer') {
        headerString += (participant.header + '|');
      }
    });

    console.log(headerString);
    console.log(('|' + '='.repeat(this.seats[0].header.length)).repeat(7) + '|');
  }

  prettyPrintHands(cardNumber = 0) {
    let cardString = '|';
    let stopString = (('|' + ' '.repeat(24)).repeat(7)) + '|';
    this.seats.forEach(participant => {
      if (participant.hand.cards.length > cardNumber && participant.constructor.name !== 'Dealer') {
        cardString += ((participant.hand.cards[cardNumber].rank
          + " of "
          + participant.hand.cards[cardNumber].suit).padEnd(24, ' ')
          + '|');
      } else if (participant.constructor.name !== 'Dealer') {
        cardString += (' '.repeat(24) + '|');
      }
    });

    if (cardString === stopString) {
      console.log(('|' + '_'.repeat(24)).repeat(7) + '|');
    } else {
      console.log(cardString);
      this.prettyPrintHands(cardNumber + 1);
    }
  }

  showPlayerHands() {
    this.prettyPrintHeaders();
    this.prettyPrintHands();
  }

  showDealerUpcard() {
    // TODO
  }

  showDealerHand() {
    // TODO
  }

  hitOrStay(player) {
    let choice;
    do {
      choice = readline.question('(H)it or (S)tay: ').toLowerCase();
    } while (!['s', 'h'].includes(choice));

    switch (choice) {
      case 'h':
        player.hit();
        return true;
      case 's':
        return false;
      default:
        return false;
    }
  }

  playerBusted(player) {
    if (player.hand.points > this.bustValue) {
      console.log(player.constructor.name + " busts!");
      return true;
    }

    return false;
  }

  detectTie() {
    if (this.player.hand.points > this.bustValue) {
      if (this.dealer.hand.points > this.bustValue) {
        readline.question("Tie! (Press `Enter` to continue)");
      } else {
        readline.question("Dealer Won! (Press `Enter` to continue)");
        this.dealer.incrementScore();
      }

      return true;
    }

    return false;
  }

  determineWinner() {
    debugger;
    if (!this.detectTie()) {
      if (this.player.hand.points > this.dealer.hand.points) {
        readline.question("Player Won! (Press `Enter` to continue)");
        this.player.incrementScore();
      }
      if (this.dealer.hand.points >= this.player.hand.points) {
        if (this.dealer.hand.points > this.bustValue) {
          readline.question("Player Won! (Press `Enter` to continue)");
          this.player.incrementScore();
        } else {
          readline.question("Dealer Won! (Press `Enter` to continue)");
          this.dealer.incrementScore();
        }
      }
    }
  }

  showScores() {
    console.clear();
    console.log(`Dealer: ${this.dealer.score}` + '<|>'.padStart(10, ' ') + `        Player: ${this.player.score}`);
  }

  playRound() {
    // TODO
  }

  playMatch() {
    while (this.player.score < this.matchScoreLimit
      && this.dealer.score < this.matchScoreLimit) {
      this.playRound();
      this.player.hand.resetHand();
      this.dealer.hand.resetHand();
      this.reshuffle();
      this.player.dealIn();
      this.dealer.dealIn();
    }
  }

  displayMatchWinner() {
    this.showScores();
    if (this.player.score === this.matchScoreLimit) {
      console.log("Player wins the match!");
    } else {
      console.log("Dealer wins the match!");
    }
  }

  playAgain() {
    let choice;
    do {
      choice = readline.question("Would you like to play again? (Y/N): ").toLowerCase();
    } while (!['y', 'n'].includes(choice));

    return choice === 'y';
  }

  play() {
    console.log("Welcome to the game of 21!");
    readline.question("First player to win 5 hands wins the match. Press `Enter` when ready.");
    do {
      this.playMatch();
      this.displayMatchWinner();
      this.player.reset();
      this.dealer.reset();
    } while (this.playAgain());

    console.log("Goodbye!");
  }
}

// test client
let game = new Game();
game.deal();
game.showPlayerHands();