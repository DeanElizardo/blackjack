"use strict";

let { Deck } = require('./game/cardClasses.js');

let deck = new Deck();

function sleep(msDelay) {
  let currTime;
  let startTime = Date.now();
  do {
    currTime = Date.now();
  } while (currTime - startTime < msDelay)
}

function countdown() {
  let dealLimit = Math.ceil(Math.random() * deck.deck.length);
  let dealCount = 0;
  while (dealLimit > dealCount) {
    console.log(deck.draw());
    ++dealCount;
    sleep(900);
  }
  console.log("--------------------------------break");
}

do {
  countdown();
} while(deck.deck.length);