// Global Variables
const CARDS_PER_PLAYER = 26; // max is 26
const NUMBER_OF_CARDS_TO_DRAW_ON_WAR = 3;
const HINT_PLAYER_AFTER_MS = 10000;
const WINS = [0, 0, 0, 0]; // pc, player, pc war, player war

// TODO find another way to do this
let PC_DECK = [];
let PLAYER_DECK = [];

/* ************************************************************************** */
/* CARD FUNCTIONS */
/* ************************************************************************** */

function Card(suit, card, value) {
  this.suit = suit;
  this.card = card;
  this.value = value;
  this.color =
    suit.includes("club") || suit.includes("spade") ? "black" : "red";
}

const getCard = function (card) {
  return createCardHtml(card);
};

const getRandomCard = function (deck) {
  return deck[Math.floor(Math.random() * deck.length)];
};

const removeCardFromDeck = function (deck, card) {
  const index = deck.indexOf(card);
  deck.splice(index, 1);
  return card;
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

/* ************************************************************************** */
/* DECK FUNCTIONS */
/* ************************************************************************** */
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

/* ************************************************************************** */
/* GAME FUNCTIONS */
/* ************************************************************************** */
const war = async function (pcCard, playerCard) {
  console.log("WAR");
  let warDeck = [];

  warDeck.push(pcCard);
  warDeck.push(playerCard);

  let pcCardElement = document.getElementById("current-card-pc");
  let playerCardElement = document.getElementById("current-card-player");

  //let pcCard = PC_DECK.pop();
  //let playerCard = PLAYER_DECK.pop();

  let pcDeckElement = document.getElementById("current-deck-pc");
  let playerDeckElement = document.getElementById("current-deck-player");
  playerDeckElement.setAttribute("onClick", "");
  document.getElementById("play-button").disabled = true;

  while (true) {
    for (let i = 0; i < NUMBER_OF_CARDS_TO_DRAW_ON_WAR; i++) {
      if (PC_DECK.length > 0) {
        let warCard = PC_DECK.pop();
        warDeck.push(warCard);
        await animateWarCard("pc", warCard, -(i + 2));
      }
    }

    for (let i = 0; i < NUMBER_OF_CARDS_TO_DRAW_ON_WAR; i++) {
      if (PLAYER_DECK.length > 0) {
        let warCard = PLAYER_DECK.pop();
        warDeck.push(warCard);
        await animateWarCard("player", warCard, -(i + 2));
      }
      //await sleep(500); // Wait between each pair of cards
    }

    // TODO: Add a check for when both players have no more cards
    if (PC_DECK.length === 0 || PLAYER_DECK.length === 0) {
      roundEnd();
      return;
    }

    await animateCardPlay("pc");
    pcCardElement.innerHTML = getBackCard();
    await animateCardPlay("player");
    playerCardElement.innerHTML = getBackCard();

    pcCard = PC_DECK.pop();
    playerCard = PLAYER_DECK.pop();

    pcCardElement.innerHTML = getCard(pcCard);
    playerCardElement.innerHTML = getCard(playerCard);

    flipCard(pcCardElement);
    flipCard(playerCardElement);

    playerDeckElement.setAttribute("onClick", "");
    document.getElementById("play-button").disabled = true;

    if (compareCardsValues(pcCard, playerCard) === 1) {
      pcCardElement.classList.add("outline-win");
      pcDeckElement.classList.add("outline-win");
      playerDeckElement.classList.add("card-ready");
      warDeck.push(pcCard);
      warDeck.push(playerCard);

      PC_DECK.unshift(...warDeck);
      console.log("PC won the WAR");
      // alert(
      //   "Ohh noo! You just lost the war! The enemy got " +
      //     warDeck.length +
      //     " more cards!"
      // );
      warDeck.splice(0, warDeck.length);
      WINS[0]++;
      WINS[2]++;
      updateScoreboard();
      roundEnd();
      return;
    }
    if (compareCardsValues(pcCard, playerCard) === -1) {
      playerCardElement.classList.add("outline-win");
      playerDeckElement.classList.add("outline-win");
      playerDeckElement.classList.add("card-ready");
      warDeck.push(pcCard);
      warDeck.push(playerCard);

      PLAYER_DECK.unshift(...warDeck);
      console.log("Player won the WAR");
      //alert("You won the war! You got " + warDeck.length + " more cards!");
      warDeck.splice(0, warDeck.length);
      WINS[1]++;
      WINS[3]++;
      updateScoreboard();
      roundEnd();
      return;
    }

    warDeck.push(pcCard);
    warDeck.push(playerCard);
    console.log("DRAW, MORE WAR");
    //alert("IT'S A DRAW, MORE WAR INCOMING!");
  }
};

const removeWarCards = async function () {
  let warCards = Array.from(document.getElementsByClassName("war-card-pc"));
  if (warCards.length === 0) {
    return;
  }
  warCards.forEach((card) => card.remove());

  warCards = Array.from(document.getElementsByClassName("war-card-player"));
  warCards.forEach((card) => card.remove());

  document.getElementById("game-container").classList.add("wargb-reverse");
  await sleep(2000);
  document.getElementById("game-container").classList.remove("wargb-reverse");
};

const updateScoreboardFromLocalStorage = function (pcDeck, playerDeck) {
  const pcScore = document.getElementById("pc-score");
  const playerScore = document.getElementById("player-score");

  const pcWins = document.getElementById("pc-wins");
  const playerWins = document.getElementById("player-wins");

  const pcWarWins = document.getElementById("pc-war-wins");
  const playerWarWins = document.getElementById("player-war-wins");

  const pcDeckValue = document.getElementById("pc-deck-value");
  const playerDeckValue = document.getElementById("player-deck-value");

  pcScore.innerHTML = JSON.parse(pcDeck).length;
  playerScore.innerHTML = JSON.parse(playerDeck).length;

  pcWins.innerHTML = localStorage.getItem("pcWins");
  playerWins.innerHTML = localStorage.getItem("playerWins");

  pcWarWins.innerHTML = localStorage.getItem("pcWarWins");
  playerWarWins.innerHTML = localStorage.getItem("playerWarWins");

  pcDeckValue.innerHTML = JSON.parse(pcDeck).reduce(
    (acc, card) => acc + card.value,
    0
  );
  playerDeckValue.innerHTML = JSON.parse(playerDeck).reduce(
    (acc, card) => acc + card.value,
    0
  );
};

const updateScoreboard = function () {
  const pcScore = document.getElementById("pc-score");
  const playerScore = document.getElementById("player-score");

  const pcWins = document.getElementById("pc-wins");
  const playerWins = document.getElementById("player-wins");

  const pcWarWins = document.getElementById("pc-war-wins");
  const playerWarWins = document.getElementById("player-war-wins");

  const pcDeckValue = document.getElementById("pc-deck-value");
  const playerDeckValue = document.getElementById("player-deck-value");

  pcScore.innerHTML = PC_DECK.length;
  playerScore.innerHTML = PLAYER_DECK.length;

  pcWins.innerHTML = WINS[0];
  playerWins.innerHTML = WINS[1];

  pcWarWins.innerHTML = WINS[2];
  playerWarWins.innerHTML = WINS[3];

  pcDeckValue.innerHTML = PC_DECK.reduce((acc, card) => acc + card.value, 0);
  playerDeckValue.innerHTML = PLAYER_DECK.reduce(
    (acc, card) => acc + card.value,
    0
  );

  localStorage.setItem("pcWins", WINS[0]);
  localStorage.setItem("playerWins", WINS[1]);
  localStorage.setItem("pcWarWins", WINS[2]);
  localStorage.setItem("playerWarWins", WINS[3]);

  localStorage.setItem("pcDeck", JSON.stringify(PC_DECK));
  localStorage.setItem("playerDeck", JSON.stringify(PLAYER_DECK));
};

const roundEnd = function () {
  let pcCardElement = document.getElementById("current-card-pc");
  let playerCardElement = document.getElementById("current-card-player");

  let pcDeckElement = document.getElementById("current-deck-pc");
  let playerDeckElement = document.getElementById("current-deck-player");

  if (PC_DECK.length === 0) {
    let winner = "&Popf;&Lopf;&Aopf;&Yopf;&Eopf;&Ropf;";
    let playerName = localStorage.getItem("playerName");
    if (playerName) {
      // playerName.forEach((i) => {
      //   i.toUpperCase();
      //   i = "&" + i + "opf;";
      // });
      playerName = playerName
        .split("")
        .map((char) => {
          if (char === " ") {
            return "&nbsp;";
          }
          return "&" + char.toUpperCase() + "opf;";
        })
        .join("");

      winner = playerName;
    }

    endGame(winner);
    return;
  }

  if (PLAYER_DECK.length === 0) {
    const winner = "&Popf;&Copf;";
    endGame(winner);
    return;
  }
};

const endGame = function (winner) {
  updateScoreboard();
  let gameContainerElement = document.getElementById("game-container");
  gameContainerElement.classList.remove("warbg");

  gameContainerElement.innerHTML = `
  <div class="pyro">
    <div class="before"></div>
    <div class="after"></div>
  </div>
  <p>The winner is </p>
  <h1>${winner}</h1>
  <h3 class="button outline-win card-ready bounce" onClick="newGame();">Click here to start a new game</h3>
`;

  localStorage.removeItem("pcWins");
  localStorage.removeItem("playerWins");
  localStorage.removeItem("pcWarWins");
  localStorage.removeItem("playerWarWins");

  localStorage.removeItem("pcDeck");
  localStorage.removeItem("playerDeck");
  return;
};

const playRound = async function () {
  document.getElementById("play-button").disabled = true;

  // remove war cards if they exist
  removeWarCards();

  let pcCardElement = document.getElementById("current-card-pc");
  let playerCardElement = document.getElementById("current-card-player");

  let pcDeckElement = document.getElementById("current-deck-pc");
  let playerDeckElement = document.getElementById("current-deck-player");

  let pcScoreElement = document.getElementById("pc-score");
  let playerScoreElement = document.getElementById("player-score");

  document.getElementById("game-container").classList.remove("warbg");

  pcCardElement.classList.remove("outline-win");
  pcCardElement.classList.remove("outline-lost");
  playerCardElement.classList.remove("outline-win");
  playerCardElement.classList.remove("outline-lost");

  pcDeckElement.classList.remove("outline-win");
  playerDeckElement.classList.remove("outline-win");

  playerDeckElement.classList.remove("card-ready");
  playerDeckElement.classList.remove("bounce");

  pcCardElement.innerHTML = getEmptyCard();
  playerCardElement.innerHTML = getEmptyCard();

  pcDeckElement.innerHTML = getBackCard(PC_DECK.length);
  playerDeckElement.innerHTML = getBackCard(PLAYER_DECK.length);

  playerDeckElement.setAttribute("onClick", "");

  // TODO: Change win state to better place
  if (PC_DECK.length === 0 || PLAYER_DECK.length === 0) {
    roundEnd();
    return;
  }

  // animate card dealing
  await animateCardPlay("pc");
  pcCardElement.innerHTML = getBackCard();
  await animateCardPlay("player");
  playerCardElement.innerHTML = getBackCard();

  let pcCard = PC_DECK.pop();
  let playerCard = PLAYER_DECK.pop();

  pcCardElement.innerHTML = getCard(pcCard);
  playerCardElement.innerHTML = getCard(playerCard);

  // animate flipping the cards
  flipCard(pcCardElement);
  flipCard(playerCardElement);

  await sleep(600);

  // WAR Condition
  if (compareCardsValues(pcCard, playerCard) === 0) {
    document.getElementById("game-container").classList.add("warbg");
    war(pcCard, playerCard);
    return;
  }

  if (compareCardsValues(pcCard, playerCard) === 1) {
    pcCardElement.classList.add("outline-win");
    playerCardElement.classList.add("outline-lost");
    pcDeckElement.classList.add("outline-win");
    playerDeckElement.classList.add("card-ready");
    PC_DECK.unshift(playerCard);
    PC_DECK.unshift(pcCard);
    console.log("PC WINS");
    WINS[0]++;
    updateScoreboard();
    roundEnd();
    return;
  }

  if (compareCardsValues(pcCard, playerCard) === -1) {
    pcCardElement.classList.add("outline-lost");
    playerCardElement.classList.add("outline-win");
    playerDeckElement.classList.add("outline-win");
    playerDeckElement.classList.add("card-ready");
    PLAYER_DECK.unshift(pcCard);
    PLAYER_DECK.unshift(playerCard);
    console.log("PLAYER WINS");
    WINS[1]++;
    updateScoreboard();
    roundEnd();
    return;
  }
};

/* ************************************************************************** */
/* ANIMATION FUNCTIONS */
/* ************************************************************************** */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const dealAnimation = async function () {
  const pcDeckElement = document.getElementById("current-deck-pc");
  const playerDeckElement = document.getElementById("current-deck-player");
  const gameContainer = document.getElementById("game-container");

  const cardsPerPlayer = document.getElementById("cards-per-player").value;
  numberOfCardsToDeal = cardsPerPlayer ? cardsPerPlayer : CARDS_PER_PLAYER;

  for (let i = 0; i < numberOfCardsToDeal; i++) {
    let pcCard = document.createElement("div");
    pcCard.className = "dealing-card-pc";
    pcCard.innerHTML = getBackCard();
    gameContainer.appendChild(pcCard);

    let playerCard = document.createElement("div");
    playerCard.className = "dealing-card-player";
    playerCard.innerHTML = getBackCard();
    gameContainer.appendChild(playerCard);

    await sleep(100);

    pcCard.style.transform = "translate(0%, -100%)";
    playerCard.style.transform = "translate(0%, 100%)";

    await sleep(100);

    pcCard.remove();
    playerCard.remove();

    // Update deck counts
    pcDeckElement.innerHTML = getBackCard(i + 1);
    playerDeckElement.innerHTML = getBackCard(i + 1);
  }
};

const animateCardPlay = async function (player) {
  const gameContainer = document.getElementById("game-container");
  const startDeck = document.getElementById(`current-deck-${player}`);
  const endCard = document.getElementById(`current-card-${player}`);

  // Get the positions
  const startRect = startDeck.getBoundingClientRect();
  const endRect = endCard.getBoundingClientRect();

  // Create the animated card
  let animatedCard = document.createElement("div");
  animatedCard.className = `animated-card-${player}`;
  animatedCard.innerHTML = getBackCard();
  gameContainer.appendChild(animatedCard);

  // Set initial position
  animatedCard.style.top = `${startRect.top}px`;
  animatedCard.style.left = `${startRect.left}px`;

  // Trigger the animation
  await sleep(10); // Small delay to ensure the initial position is set
  animatedCard.style.top = `${endRect.top}px`;
  animatedCard.style.left = `${endRect.left}px`;

  await sleep(600);

  animatedCard.remove();
};

const animateWarCard = async function (player, card, offset) {
  let container = document.getElementById(`game-container`);
  let warCard = document.createElement("div");
  warCard.className = `war-card-${player}`;
  warCard.innerHTML = getBackCard();
  container.appendChild(warCard);

  await sleep(300);
  if (player === "pc") {
    warCard.style.transform = "translateX(-150%)";
    warCard.style.translate = `${offset}%`;
  } else {
    warCard.style.transform = "translateX(150%)";
    warCard.style.translate = `${offset}%`;
  }
  await sleep(500);
};

const flipCard = async function (cardElement) {
  let playerDeckElement = document.getElementById("current-deck-player");
  cardElement.classList.add("card-flip");
  playerDeckElement.setAttribute("onClick", "");
  document.getElementById("play-button").disabled = true;

  await sleep(600);

  cardElement.classList.remove("card-flip");
  playerDeckElement.setAttribute("onClick", "playRound()");
  document.getElementById("play-button").disabled = false;
};

/* ************************************************************************** */
/* CARD HTML GENERATION FUNCTIONS */
/* ************************************************************************** */
const getEmptyCard = function () {
  return `
      <div class="card">
      </div>
    `;
};

const getBackCard = function (text) {
  if (text === undefined) {
    text = "&Wopf;&Aopf;&Ropf;";
  }
  return `
      <div class="card">
        <div class="card-top small-letter-suit flipped-text card-background-text">&Wopf;&Aopf;&Ropf;</div>
        <div class="card-body">
          <span class="card-back-1"></span>
          <!-- <p class="small-letter-suit">${text}</p> -->
        </div>
        <div class="card-bottom small-letter-suit flipped-text card-background-text">&Gopf;&Aopf;&Mopf;&Eopf;</div>
      </div>
    `;
};

const createCardBody = function (newCard, buildArray) {
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const hasGroups = buildArray.filter((i) => i > 1).length > 0;

  if (hasGroups) {
    buildArray.forEach((i) => {
      const suitGroup = document.createElement("div");
      suitGroup.classList.add("suit-group");

      if (i > 0) {
        for (let j = 0; j < i; j++) {
          const suitItem = document.createElement("span");
          suitItem.classList.add("default-letter-suit");
          suitItem.innerHTML = newCard.suit;
          suitGroup.append(suitItem);
        }
      } else {
        suitGroup.classList.add("flipped");
        for (let j = 0; j < Math.abs(i); j++) {
          const suitItem = document.createElement("span");
          suitItem.classList.add("default-letter-suit");
          suitItem.innerHTML = newCard.suit;
          suitGroup.append(suitItem);
        }
      }
      cardBody.append(suitGroup);
    });
  } else {
    buildArray.forEach((i) => {
      const letterSuit = document.createElement("div");
      letterSuit.classList.add("default-letter-suit");
      if (i < 0) letterSuit.classList.add("flipped");
      letterSuit.innerHTML = newCard.suit;
      cardBody.append(letterSuit);
    });
  }

  return cardBody.outerHTML;
};

const createCardHtml = function (newCard) {
  const { suit, card, value, color } = newCard;
  let cardHtmlBody = "";

  switch (card) {
    case "2":
      cardHtmlBody = createCardBody(newCard, [1, -1]);
      break;
    case "3":
      cardHtmlBody = createCardBody(newCard, [1, 1, -1]);
      break;
    case "4":
      cardHtmlBody = createCardBody(newCard, [2, -2]);
      break;
    case "5":
      cardHtmlBody = createCardBody(newCard, [2, 1, -2]);
      break;
    case "6":
      cardHtmlBody = createCardBody(newCard, [2, 2, -2]);
      break;
    case "7":
      cardHtmlBody = createCardBody(newCard, [2, 1, 2, -2]);
      break;
    case "8":
      cardHtmlBody = createCardBody(newCard, [2, 1, 2, -1, -2]);
      break;
    case "9":
      cardHtmlBody = createCardBody(newCard, [2, 2, 1, -2, -2]);
      break;
    case "10":
      cardHtmlBody = createCardBody(newCard, [2, 1, 2, -2, -1, -2]);
      break;

    case "J":
      cardHtmlBody = createCardBody(newCard, [1, 1, -1]);
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

  return `
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
};

const recreateGameContainer = function () {
  const html = `<div class="list">
        <div id="current-deck-pc">
          <div class="card">pc deck</div>
        </div>
      </div>

      <div class="list">
        <div id="current-card-pc">
          <div class="card"></div>
        </div>

        <div id="current-card-player">
          <div class="card"></div>
        </div>
      </div>

      <div class="list">
        <div id="current-deck-player" class="" onclick="playRound()">
          <div class="card">player deck</div>
        </div>
      </div>

      <button id="play-button" class="hidden" onclick="playRound()">
        Play Card
      </button>`;

  document.getElementById("game-container").innerHTML = html;
};

/* ************************************************************************** */
/* GAME INIT FUNCTION */
/* ************************************************************************** */
function initGame() {
  console.log("INIT GAME");
  idleTimer();

  let pcCardElement = document.getElementById("current-card-pc");
  let playerCardElement = document.getElementById("current-card-player");

  let pcDeckElement = document.getElementById("current-deck-pc");
  let playerDeckElement = document.getElementById("current-deck-player");

  playerDeckElement.classList.add("card-ready");
  playerDeckElement.classList.add("bounce");

  // load settings
  const playerName = localStorage.getItem("playerName");
  let cardsPerPlayer = localStorage.getItem("cardsPerPlayer");
  const theme = localStorage.getItem("theme");

  // TODO Change this to a function
  // load game state from local storage
  const pcDeck = localStorage.getItem("pcDeck");
  const playerDeck = localStorage.getItem("playerDeck");
  if (pcDeck && playerDeck) {
    updateScoreboardFromLocalStorage(pcDeck, playerDeck);
  }

  const cardDeck = generateGameDeck();

  if (theme) {
    if (theme === null) {
      console.warn("Theme is null, defaulting to default");
      theme = "default";
      localStorage.setItem("theme", theme);
    }
    applyTheme(theme);
    document.getElementById("theme").value = theme;
  }

  if (playerName) {
    if (playerName === null) {
      console.warn("Player name is null, defaulting to Player");
      playerName = "Player";
      localStorage.setItem("playerName", playerName);
    }
    document.getElementById("player-name-cell").innerHTML = playerName;
    document.getElementById("player-name").value = playerName;
  } else {
    document.getElementById("player-name-cell").innerHTML = "Player";
  }

  if (cardsPerPlayer) {
    if (playerName === null) {
      console.warn(
        "Cards per player is null, defaulting to " + CARDS_PER_PLAYER
      );
      cardsPerPlayer = CARDS_PER_PLAYER;
      localStorage.setItem("cardsPerPlayer", cardsPerPlayer);
    }
    document.getElementById("cards-per-player").value = cardsPerPlayer;
    if (cardsPerPlayer > 26 || cardsPerPlayer < 1) {
      console.warn(
        "Invalid cards per player, defaulting to " + CARDS_PER_PLAYER
      );
      cardsPerPlayer = CARDS_PER_PLAYER;
    }

    PC_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, cardsPerPlayer);
    PLAYER_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, cardsPerPlayer);
  } else {
    if (CARDS_PER_PLAYER > 26) {
      PC_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, 26);
      PLAYER_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, 26);
    } else {
      PC_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, CARDS_PER_PLAYER);
      PLAYER_DECK = createPlayerDeckWithCardsFromDeck(
        cardDeck,
        CARDS_PER_PLAYER
      );
    }
  }

  // TODO THIS IS A MEGA HACK
  if (pcDeck && playerDeck) {
    PC_DECK = JSON.parse(pcDeck);
    PLAYER_DECK = JSON.parse(playerDeck);
    console.log("LOADED GAME STATE FROM LOCAL STORAGE");
  }

  pcDeckElement.innerHTML = getBackCard(PC_DECK.length);
  playerDeckElement.innerHTML = getBackCard(PLAYER_DECK.length);

  pcCardElement.innerHTML = getBackCard();
  playerCardElement.innerHTML = getBackCard();

  dealAnimation();
  console.log(PC_DECK);
  // dealAnimation().then(() => {
  //   pcDeckElement.innerHTML = getBackCard(PC_DECK.length);
  //   playerDeckElement.innerHTML = getBackCard(PLAYER_DECK.length);
  // });
}

// new game
const newGame = function () {
  const playerName = localStorage.getItem("playerName");
  const cardsPerPlayer = localStorage.getItem("cardsPerPlayer");

  localStorage.clear();

  localStorage.setItem("playerName", playerName);
  localStorage.setItem("cardsPerPlayer", cardsPerPlayer);
  recreateGameContainer();
  initGame();
};

// add sticky score board
document.addEventListener("DOMContentLoaded", () => {
  const scoreboard = document.getElementById("scoreboard");

  if (scoreboard) {
    const sticky = scoreboard.offsetTop;

    function handleScroll() {
      if (window.scrollY >= sticky) {
        scoreboard.classList.add("sticky");
      } else {
        scoreboard.classList.remove("sticky");
      }
    }

    window.addEventListener("scroll", handleScroll);
  }
});

// dectect idle
const idleTimer = function () {
  let time;
  window.onload = resetTimer;
  // DOM Events
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function hintPlayer() {
    let playerDeckElement = document.getElementById("current-deck-player");
    playerDeckElement.classList.add("bounce");
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(hintPlayer, HINT_PLAYER_AFTER_MS);
  }
};

const saveSettings = function () {
  const playerName = document.getElementById("player-name").value;
  const cardsPerPlayer = document.getElementById("cards-per-player").value;
  const themeName = document.getElementById("theme");

  if (cardsPerPlayer > 26 || cardsPerPlayer < 1) {
    console.warn("Invalid cards per player");
    alert("Invalid cards per player");
    return;
  }

  if (playerName.length > 255 || playerName.length < 1) {
    console.warn(
      "Invalid player name. Name must be between 1 and 255 characters"
    );
    alert("Invalid player name. Name must be between 1 and 255 characters");
    return;
  }

  document.getElementById("player-name-cell").innerHTML = playerName;

  localStorage.setItem("playerName", playerName);
  localStorage.setItem("cardsPerPlayer", cardsPerPlayer);
  localStorage.setItem("theme", theme.options[theme.selectedIndex].value);

  applyTheme(theme.value);

  alert("Settings saved!");
};

const deleteLocalStorate = function () {
  if (confirm("Are you sure you want to delete all local storage?")) {
    localStorage.clear();
    alert("Local storage deleted!");
  }
};

const applyTheme = function (theme) {
  // default color scheme
  let defaultFontColor = "#4a4a4a";
  let defaultFontShadow = "#ffffff";
  let background = "#f9f9f9";
  let white = "#ffffff";
  let black = "#000000";
  let red = "#ff0000";
  let green = "#008000";
  let blue = "#0000ff";
  let accent = "#000080";
  let accentShadow = "#00008042";
  let cardBackground = "#ffffff";
  let cardBackgroundText = "#ff0000";
  let hoverShadow = "#00800050";
  let warbgColor = "#008000";

  switch (theme) {
    case "materiallight":
      defaultFontColor = "#000000";
      defaultFontShadow = "#FFFFFF";
      background = "#FFFFFF";
      white = "#FFFFFF";
      black = "#000000";
      red = "#B00020";
      green = "#4CAF50";
      blue = "#2196F3";
      accent = "#6200EE";
      accentShadow = "#6200EE40";
      cardBackground = "#F5F5F5";
      cardBackgroundText = "#000000";
      hoverShadow = "#4CAF5050";
      warbgColor = "#03DAC6";
      break;
    case "materialdark":
      defaultFontColor = "#FFFFFF";
      defaultFontShadow = "#121212";
      background = "#121212";
      white = "#FFFFFF";
      black = "#000000";
      red = "#CF6679";
      green = "#4CAF50";
      blue = "#2196F3";
      accent = "#BB86FC";
      accentShadow = "#BB86FC40";
      cardBackground = "#1E1E1E";
      cardBackgroundText = "#FFFFFF";
      hoverShadow = "#4CAF5050";
      warbgColor = "#03DAC6";
      break;
    case "githublight":
      defaultFontColor = "#24292e"; // Very dark gray (almost black) for text
      defaultFontShadow = "#ffffff"; // White (background)
      background = "#ffffff"; // White
      white = "#ffffff"; // White
      black = "#24292e"; // Very dark gray (almost black)
      red = "#d73a49"; // Red
      green = "#28a745"; // Green
      blue = "#0366d6"; // Blue
      accent = "#6f42c1"; // Purple
      accentShadow = "#6f42c140"; // Purple with opacity
      cardBackground = "#f6f8fa"; // Very light gray for contrast
      cardBackgroundText = "#24292e"; // Very dark gray (almost black)
      hoverShadow = "#28a74550"; // Green with opacity
      warbgColor = "#e36209"; // Orange
      break;
    case "githubdark":
      defaultFontColor = "#c9d1d9"; // Light gray (text color)
      defaultFontShadow = "#0d1117"; // Very dark blue-gray (background)
      background = "#0d1117"; // Very dark blue-gray
      white = "#ffffff"; // White
      black = "#000000"; // Black
      red = "#ff7b72"; // Soft red
      green = "#7ee787"; // Soft green
      blue = "#79c0ff"; // Soft blue
      accent = "#d2a8ff"; // Soft purple
      accentShadow = "#d2a8ff40"; // Soft purple with opacity
      cardBackground = "#161b22"; // Slightly lighter background for contrast
      cardBackgroundText = "#c9d1d9"; // Light gray
      hoverShadow = "#7ee78750"; // Soft green with opacity
      warbgColor = "#ffa657"; // Soft orange
      break;
    case "vscodelight":
      defaultFontColor = "#000000"; // Black (text color)
      defaultFontShadow = "#FFFFFF"; // White (background)
      background = "#FFFFFF"; // White
      white = "#FFFFFF"; // White
      black = "#000000"; // Black
      red = "#CD3131"; // Red
      green = "#008000"; // Green
      blue = "#0000FF"; // Blue
      accent = "#795E26"; // Brown
      accentShadow = "#795E2640"; // Brown with opacity
      cardBackground = "#F3F3F3"; // Light gray for contrast
      cardBackgroundText = "#000000"; // Black
      hoverShadow = "#00800050"; // Green with opacity
      warbgColor = "#AF00DB"; // Purple
      break;
    case "vscodedark":
      defaultFontColor = "#D4D4D4"; // Light gray (text color)
      defaultFontShadow = "#1E1E1E"; // Very dark gray (background)
      background = "#1E1E1E"; // Very dark gray
      white = "#FFFFFF"; // White
      black = "#000000"; // Black
      red = "#F44747"; // Red
      green = "#6A9955"; // Green
      blue = "#569CD6"; // Blue
      accent = "#4EC9B0"; // Cyan
      accentShadow = "#4EC9B040"; // Cyan with opacity
      cardBackground = "#252526"; // Slightly lighter background for contrast
      cardBackgroundText = "#D4D4D4"; // Light gray
      hoverShadow = "#6A995550"; // Green with opacity
      warbgColor = "#CE9178"; // Orange
      break;
    case "gruvbox":
      defaultFontColor = "#ebdbb2"; // Light beige (text color)
      defaultFontShadow = "#282828"; // Dark background
      background = "#282828"; // Dark background
      white = "#fbf1c7"; // Light beige
      black = "#1d2021"; // Darker gray
      red = "#cc241d"; // Red
      green = "#98971a"; // Green
      blue = "#458588"; // Blue
      accent = "#d65d0e"; // Orange
      accentShadow = "#d65d0e40"; // Orange with opacity
      cardBackground = "#3c3836"; // Slightly lighter background for contrast
      cardBackgroundText = "#ebdbb2"; // Light beige
      hoverShadow = "#98971a50"; // Green with opacity
      warbgColor = "#b16286"; // Purple
      break;
    case "monokai":
      defaultFontColor = "#F8F8F2"; // Light gray (text color)
      defaultFontShadow = "#272822"; // Very dark gray (background)
      background = "#272822"; // Very dark gray
      white = "#F8F8F2"; // Light gray
      black = "#272822"; // Very dark gray
      red = "#F92672"; // Pink/Red
      green = "#A6E22E"; // Bright green
      blue = "#66D9EF"; // Light blue
      accent = "#AE81FF"; // Purple
      accentShadow = "#AE81FF40"; // Purple with opacity
      cardBackground = "#3E3D32"; // Slightly lighter background for contrast
      cardBackgroundText = "#F8F8F2"; // Light gray
      hoverShadow = "#A6E22E50"; // Green with opacity
      warbgColor = "#FD971F"; // Orange
      break;
    case "dracula":
      defaultFontColor = "#f8f8f2";
      background = "#282a36";
      white = "#f8f8f2";
      black = "#000000";
      red = "#ff5555";
      green = "#50fa7b";
      blue = "#8be9fd";
      accent = "#bd93f9";
      accentShadow = "#bd93f92a";
      cardBackground = "#282a36";
      cardBackgroundText = "#ff5555";
      hoverShadow = "#bd93f950";
      warbgColor = "#bd93f9";
      break;
    case "debug":
      defaultFontColor = "#ff0000";
      background = "#0000ff";
      break;
    default:
      break;
  }
  cssRoot = document.querySelector(":root");

  cssRoot.style.setProperty("--default-font-color", defaultFontColor);
  cssRoot.style.setProperty("--default-font-shadow", defaultFontShadow);
  cssRoot.style.setProperty("--background", background);
  cssRoot.style.setProperty("--white", white);
  cssRoot.style.setProperty("--black", black);
  cssRoot.style.setProperty("--red", red);
  cssRoot.style.setProperty("--green", green);
  cssRoot.style.setProperty("--blue", blue);
  cssRoot.style.setProperty("--accent", accent);
  cssRoot.style.setProperty("--accent-shadow", accentShadow);
  cssRoot.style.setProperty("--card-background", cardBackground);
  cssRoot.style.setProperty("--card-background-text", cardBackgroundText);
  cssRoot.style.setProperty("--hover-shadow", hoverShadow);
  cssRoot.style.setProperty("--warbg-color", warbgColor);
};
