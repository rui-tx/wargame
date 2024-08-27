const cardDeck = generateGameDeck();
const playerDeck = [];
let playerDeckCurrentIndex = 0;
const pcDeck = [];
let pcDeckCurrentIndex = 0;
const warDeck = [];

const getRandomCard = (deck) => {
  const randomCard = Math.floor(Math.random() * deck.length);
  return deck[randomCard];
};

const removeCard = (deck, card) => {
  const index = deck.indexOf(card);
  deck.splice(index, 1);
  return card;
};

function fillPlayerDeck() {
  for (let i = 0; i < 26; i += 1) {
    const newCard = getRandomCard(cardDeck);
    playerDeck.push(newCard);
    removeCard(cardDeck, newCard);
  }
}

function fillPcDeck() {
  for (let i = 0; i < 26; i += 1) {
    const newCard = getRandomCard(cardDeck);
    pcDeck.push(newCard);
    removeCard(cardDeck, newCard);
  }
}

function Card(suit, card, value) {
  this.suit = suit;
  this.card = card;
  this.value = value;
  this.color =
    suit.includes("club") || suit.includes("spade") ? "black" : "red";
}

function generateGameDeck() {
  const deckSize = 13 * 4;
  const suits = ["&clubsuit;", "&spadesuit;", "&heartsuit;", "&diamondsuit;"];
  const cards = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  let cardIndex = 0;
  const deck = [];

  for (let i = 0; i < suits.length; i += 1) {
    for (let j = 0; j < cards.length; j += 1) {
      let newCard = new Card(suits[i], cards[j], j + 1);
      deck.push(newCard);
      cardIndex += 1;
    }
  }

  return deck;
}

const getCard = (newCard) => {
  const { suit, card, value, color } = newCard;

  const cardHtml = `
      <div class="card ${color}">
        <div class="card-top align-items-center">
          <span class="small-letter-suit bold">${card}</span>
          <span class="small-letter-suit">${suit}</span>
        </div>
        <div class="card-body">
          <span class="single-letter-suit">${card}</span>
          <span class="single-letter-suit">${suit}</span>
        </div>
        <div class="card-bottom align-items-center">
          <span class="small-letter-suit bold">${card}</span>
          <span class="small-letter-suit">${suit}</span>
        </div>
      </div>
    `;
  return cardHtml;
};

const decreasePcDeckIndex = function () {
  // --index;
  // return index < 0 ? deck.length : index;
  if (pcDeckCurrentIndex === 0) {
    pcDeckCurrentIndex = pcDeck.length;
  }
  pcDeckCurrentIndex = pcDeckCurrentIndex - 1;
};

const decreasePlayerDeckIndex = function () {
  // --index;
  // return index < 0 ? deck.length : index;
  if (playerDeckCurrentIndex === 0) {
    playerDeckCurrentIndex = playerDeck.length;
  }
  playerDeckCurrentIndex = playerDeckCurrentIndex - 1;
};

function generateCard() {
  document.getElementById("game-container").classList.remove("warbg");

  if (playerDeck.length === 0) {
    document.getElementById("current-card-player").innerHTML =
      "<div class='card red'>PLAYER LOSES</div>";
    console.log("PLAYER LOSES");
    document.getElementById("play-button").disabled = true;
    return;
  }

  if (pcDeck.length === 0) {
    document.getElementById("current-card-pc").innerHTML =
      "<div class='card red'>PC LOSES</div>";
    console.log("PC LOSES");
    document.getElementById("play-button").disabled = true;
    return;
  }

  /*   if (playerDeckCurrentIndex === 0) {
    playerDeckCurrentIndex = playerDeck.length;
  }

  if (pcDeckCurrentIndex === 0) {
    pcDeckCurrentIndex = pcDeck.length;
  } */

  // playerDeckCurrentIndex -= 1;
  // pcDeckCurrentIndex -= 1;

  document.getElementById("current-card-pc").classList.remove("outline-win");
  document
    .getElementById("current-card-player")
    .classList.remove("outline-win");

  // playerDeckCurrentIndex = decreaseIndex(playerDeckCurrentIndex, playerDeck);
  //pcDeckCurrentIndex = decreaseIndex(pcDeckCurrentIndex, pcDeck);

  decreasePlayerDeckIndex();
  decreasePcDeckIndex();
  const playerCard = playerDeck[playerDeckCurrentIndex];
  const pcCard = pcDeck[pcDeckCurrentIndex];

  document.getElementById("current-card-pc").innerHTML = getCard(pcCard);
  document.getElementById("current-card-player").innerHTML =
    getCard(playerCard);

  console.log(pcDeck.length);
  console.log(pcDeck);
  console.log(playerDeck.length);
  console.log(playerDeck);
  console.log(pcDeckCurrentIndex + " " + playerDeckCurrentIndex);

  if (pcCard.value === playerCard.value) {
    console.log("WAR");
    document.getElementById("game-container").classList.add("warbg");

    warDeck.push(removeCard(playerDeck, playerCard));

    for (let i = 0; i < 3; i = i + 1) {
      warDeck.push(playerDeck.pop());
      decreasePlayerDeckIndex();
    }

    warDeck.push(removeCard(pcDeck, pcCard));
    for (let i = 0; i < 3; i = i + 1) {
      warDeck.push(pcDeck.pop());
      decreasePcDeckIndex();
    }

    if ((Math.random(0, 1) * 2) % 0) {
      document.getElementById("current-card-pc").classList.add("outline-win");
      // pcDeck.push(playerCard);
      // playerDeck.pop();
      pcDeck.push(...warDeck);
      console.log("PC won the WAR");
    } else {
      document
        .getElementById("current-card-player")
        .classList.add("outline-win");
      // playerDeck.push(pcCard);
      // pcDeck.pop();
      playerDeck.push(...warDeck);
      console.log("Player won the WAR");
    }

    warDeck.splice(0, warDeck.length);
  }

  if (pcCard.value > playerCard.value) {
    document.getElementById("current-card-pc").classList.add("outline-win");
    pcDeck.push(playerCard);
    playerDeck.pop();
    console.log("PC WINS");
    return;
  }

  if (pcCard.value < playerCard.value) {
    document.getElementById("current-card-player").classList.add("outline-win");
    playerDeck.push(pcCard);
    pcDeck.pop();
    console.log("PLAYER WINS");
    return;
  }
}

function initGame() {
  fillPcDeck();
  fillPlayerDeck();

  /*   console.log(cardDeck);
  console.log(playerDeck);
  console.log(playerDeck.length);
  console.log(pcDeck);
  console.log(pcDeck.length); */
}
