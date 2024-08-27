// Global Variables
let PC_DECK = [];
let PLAYER_DECK = [];
const NUMBER_OF_CARDS_TO_DRAW_ON_WAR = 3;

function Card(suit, card, value) {
  this.suit = suit;
  this.card = card;
  this.value = value;
  this.color =
    suit.includes("club") || suit.includes("spade") ? "black" : "red";
}

const getRandomCard = function (deck) {
  return deck[Math.floor(Math.random() * deck.length)];
};

const removeCardFromDeck = function (deck, card) {
  const index = deck.indexOf(card);
  deck.splice(index, 1);
  return card;
};

const createPlayerDeckWithCardsFromDeck = function (cardDeck, amount) {
  const deck = [];
  for (let i = 0; i < amount; i += 1) {
    deck.push(removeCardFromDeck(cardDeck, getRandomCard(cardDeck)));
  }
  return deck;
  // return {
  //   deck: deck,
  //   cardDeck: cardDeck,
  // };
};

// const fillPcDeck = function () {
//   for (let i = 0; i < 26; i += 1) {
//     PC_DECK.push(removeCardFromDeck(cardDeck, getRandomCard(cardDeck)));
//   }
// };

// const fillPlayerDeck = function () {
//   for (let i = 0; i < 26; i += 1) {
//     PLAYER_DECK.push(removeCardFromDeck(cardDeck, getRandomCard(cardDeck)));
//   }
// };

const generateGameDeck = function () {
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
};

const getBackCard = function (text) {
  if (text === undefined) {
    text = "&Wopf;&Aopf;&Ropf;";
  }
  const cardHtml = `
      <div class="card">
        <div class="card-top small-letter-suit flipped-text card-background-text">&Wopf;&Aopf;&Ropf;</div>
        <div class="card-body">
          <span class="card-back-1"></span>
          <p class="small-letter-suit">${text}</p>
        </div>
        <div class="card-bottom small-letter-suit flipped-text card-background-text">&Gopf;&Aopf;&Mopf;&Eopf;</div>
      </div>
    `;
  return cardHtml;
};

const createCardHtml = function (newCard) {
  const { suit, card, value, color } = newCard;
  let cardHtmlBody = "";

  switch (card) {
    case "2":
      cardHtmlBody = `<div class="card-body">
          <span class="double-letter-suit">${suit}</span>
          <span class="double-letter-suit flipped">${suit}</span>
        </div>`;
      break;
    case "3":
      cardHtmlBody = `<div class="card-body">
          <span class="default-letter-suit">${suit}</span>
          <span class="default-letter-suit">${suit}</span>
          <span class="default-letter-suit flipped">${suit}</span>
        </div>`;
      break;
    case "4":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>

          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
      </div>`;
      break;
    case "5":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
        </div>`;
      break;
    case "6":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
        </div>`;
      break;
    case "7":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
        </div>`;
      break;
    case "8":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
        </div>`;
      break;
    case "9":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
        </div>`;
      break;
    case "10":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">${suit}</span>
            <span class="default-letter-suit">${suit}</span>
          </div>
        </div>`;
      break;

    case "J":
      cardHtmlBody = `<div class="card-body">
          <div class="suit-group">
            <span class="default-letter-suit">&Jopf;</span>
          </div>
          <div class="suit-group">
            <span class="double-letter-suit">${suit}</span>
          </div>
          <div class="suit-group flipped">
            <span class="default-letter-suit">&Jopf;</span>
          </div>
        </div>`;
      break;
    case "Q":
      cardHtmlBody = `<div class="card-body">
            <div class="suit-group">
              <span class="default-letter-suit">&Qopf;</span>
            </div>
            <div class="suit-group">
              <span class="double-letter-suit">${suit}</span>
            </div>
            <div class="suit-group flipped">
              <span class="default-letter-suit">&Qopf;</span>
            </div>
          </div>`;
      break;
    case "K":
      cardHtmlBody = `<div class="card-body">
              <div class="suit-group">
                <span class="default-letter-suit">&Kopf;</span>
              </div>
              <div class="suit-group">
                <span class="double-letter-suit">${suit}</span>
              </div>
              <div class="suit-group flipped">
                <span class="default-letter-suit">&Kopf;</span>
              </div>
            </div>`;
      break;
    default:
      cardHtmlBody = `<div class="card-body">
          <span class="single-letter-suit">${suit}</span>
        </div>`;
      break;
  }

  const cardHtml = `
      <div class="card ${color}">
        <div class="card-top align-items-center">
          <span class="small-letter-suit bold">${card}</span>
          <span class="small-letter-suit">${suit}</span>
        </div>
        ${cardHtmlBody}
        <div class="card-bottom align-items-center">
          <span class="small-letter-suit bold">${card}</span>
          <span class="small-letter-suit">${suit}</span>
        </div>
      </div>
    `;

  return cardHtml;
};

const getCard = function (newCard) {
  return createCardHtml(newCard);
};

const generateCard = function () {
  document.getElementById("game-container").classList.remove("warbg");
  document.getElementById("current-card-pc").classList.remove("outline-win");
  document
    .getElementById("current-card-player")
    .classList.remove("outline-win");

  document.getElementById("current-deck-pc").innerHTML = getBackCard(
    PC_DECK.length
  );
  document.getElementById("current-deck-player").innerHTML = getBackCard(
    PLAYER_DECK.length
  );

  if (PC_DECK.length === 0) {
    document.getElementById("current-card-pc").innerHTML =
      "<div class='card red'>PC LOSES</div>";
    console.log("PC LOSES");
    document.getElementById("play-button").disabled = true;
    return;
  }

  if (PLAYER_DECK.length === 0) {
    document.getElementById("current-card-player").innerHTML =
      "<div class='card red'>PLAYER LOSES</div>";
    console.log("PLAYER LOSES");
    document.getElementById("play-button").disabled = true;
    return;
  }

  let pcCard = PC_DECK.pop();
  let playerCard = PLAYER_DECK.pop();

  let pcCardElement = document.getElementById("current-card-pc");
  let playerCardElement = document.getElementById("current-card-player");

  pcCardElement.innerHTML = getCard(pcCard);
  playerCardElement.innerHTML = getCard(playerCard);

  pcCardElement.classList.add("card-flip");
  playerCardElement.classList.add("card-flip");

  setTimeout(() => {
    pcCardElement.classList.remove("card-flip");
    playerCardElement.classList.remove("card-flip");
  }, 600);

  if (compareCardsValues(pcCard, playerCard) === 0) {
    let warDeck = [];
    console.log("WAR");
    document.getElementById("game-container").classList.add("warbg");
    while (true) {
      warDeck.push(pcCard);
      for (let i = 0; i < NUMBER_OF_CARDS_TO_DRAW_ON_WAR; i = i + 1) {
        warDeck.push(PC_DECK.pop());
      }

      warDeck.push(playerCard);
      for (let i = 0; i < NUMBER_OF_CARDS_TO_DRAW_ON_WAR; i = i + 1) {
        warDeck.push(PLAYER_DECK.pop());
      }

      pcCard = PC_DECK.pop();
      playerCard = PLAYER_DECK.pop();

      document.getElementById("current-card-pc").innerHTML = getCard(pcCard);
      document.getElementById("current-card-player").innerHTML =
        getCard(playerCard);

      if (compareCardsValues(pcCard, playerCard) === 1) {
        document.getElementById("current-card-pc").classList.add("outline-win");
        warDeck.push(pcCard);
        warDeck.push(playerCard);

        PC_DECK.unshift(...warDeck);
        console.log("PC won the WAR");
        alert(
          "Ohh noo! You just lost the war! The enemy got " +
            warDeck.length +
            " more cards!"
        );
        warDeck.splice(0, warDeck.length);
        return;
      }
      if (compareCardsValues(pcCard, playerCard) === -1) {
        document
          .getElementById("current-card-player")
          .classList.add("outline-win");

        warDeck.push(pcCard);
        warDeck.push(playerCard);

        PLAYER_DECK.unshift(...warDeck);
        console.log("Player won the WAR");
        alert("You won the war! You got " + warDeck.length + " more cards!");
        warDeck.splice(0, warDeck.length);
        return;
      }

      console.log("DRAW, MORE WAR");
      alert("IT'S A DRAW, MORE WAR INCOMING!");
    }
  }

  if (compareCardsValues(pcCard, playerCard) === 1) {
    document.getElementById("current-card-pc").classList.add("outline-win");
    PC_DECK.unshift(playerCard);
    PC_DECK.unshift(pcCard);
    console.log("PC WINS");

    return;
  }

  if (compareCardsValues(pcCard, playerCard) === -1) {
    document.getElementById("current-card-player").classList.add("outline-win");
    PLAYER_DECK.unshift(pcCard);
    PLAYER_DECK.unshift(playerCard);
    console.log("PLAYER WINS");
    return;
  }
};

const compareCardsValues = function (card1, card2) {
  if (card1.value > card2.value) {
    return 1;
  }
  if (card1.value < card2.value) {
    return -1;
  }
  return 0;
};

function initGame() {
  console.log("INIT GAME");
  const cardDeck = generateGameDeck();

  //let r = createPlayerDeckWithCardsFromDeck(cardDeck, 26);
  // const pcDeck = createPlayerDeckWithCardsFromDeck(cardDeck, 26).deck;
  // const playerDeck = createPlayerDeckWithCardsFromDeck(cardDeck, 26).deck;
  //r = createPlayerDeckWithCardsFromDeck(r.cardDeck, 26);
  //const playerDeck = r.deck;

  PC_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, 26);
  PLAYER_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, 26);

  document.getElementById("current-deck-pc").innerHTML = getBackCard(
    PC_DECK.length
  );
  document.getElementById("current-deck-player").innerHTML = getBackCard(
    PLAYER_DECK.length
  );

  document.getElementById("current-card-pc").innerHTML = getBackCard();
  document.getElementById("current-card-player").innerHTML = getBackCard();
}
