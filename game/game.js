"use strict";

const readline = require('readline-sync');
const CARD = require('./cardClasses.js');
const PARTICIPANT = require('./playerClasses.js');


class Game {
  constructor() {
    this.bustValue = 21;
    this.pushValue = 17;
    this.matchScoreLimit = 5;
    this.shoe = new (CARD.Shoe)();
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

  showHand(player) {
    console.log("====================================");
    console.log(player.constructor.name.padStart(21, ' '));
    console.log("====================================");
    switch (player.constructor.name) {
      case 'Player':
        player.hand.cards.forEach(card => console.log(`${card.rank} of ${card.suit}`));
        console.log("------------------------------------\n" + `Points: ${player.hand.points}`.padStart(36, ' ') + "\n------------------------------------");
        break;
      case 'Dealer':
        console.log(player.hand.cards[0].rank + " of " + player.hand.cards[0].suit);
        console.log("------------------------------------\n" + `Points: ${player.hand.cards[0].value}`.padStart(36, ' ') + "\n------------------------------------\n\n");
        break;
      default:
        console.log("Object error in Game -> showHand()");
        break;
    }
  }

  showHands() {
    console.clear();
    this.showScores();
    this.showHand(this.dealer);
    this.showHand(this.player);
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
    this.showHands();
    // while (this.hitOrStay(this.player)) {
    //   this.showHands();
    //   if (this.playerBusted(this.player)) {
    //     break;
    //   }
    // }
    // this.dealer.hit();
    // this.showScores();
    // this.dealer.showFullHand();
    // this.showHand(this.player);
    // this.determineWinner();
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
game.seats.forEach(participant => {
  console.log(participant.shoe === game.shoe);
});