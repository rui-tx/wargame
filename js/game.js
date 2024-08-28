// Global Variables
let PC_DECK = [];
let PLAYER_DECK = [];
const WINS = [0, 0, 0, 0]; // pc, player, pc war, player war
const NUMBER_OF_CARDS_TO_DRAW_ON_WAR = 3;

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
      return;
    }
    if (compareCardsValues(pcCard, playerCard) === -1) {
      playerCardElement.classList.add("outline-win");

      warDeck.push(pcCard);
      warDeck.push(playerCard);

      PLAYER_DECK.unshift(...warDeck);
      console.log("Player won the WAR");
      //alert("You won the war! You got " + warDeck.length + " more cards!");
      warDeck.splice(0, warDeck.length);
      WINS[1]++;
      WINS[3]++;
      updateScoreboard();
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

  pcCardElement.innerHTML = getEmptyCard();
  playerCardElement.innerHTML = getEmptyCard();

  pcDeckElement.innerHTML = getBackCard(PC_DECK.length);
  playerDeckElement.innerHTML = getBackCard(PLAYER_DECK.length);

  playerDeckElement.setAttribute("onClick", "");

  // TODO: Change win state to better place
  if (PC_DECK.length === 0) {
    pcDeckElement.innerHTML = "<div class='card red'>PC LOSES</div>";
    console.log("PC LOSES");
    document.getElementById("play-button").disabled = true;
    return;
  }

  if (PLAYER_DECK.length === 0) {
    playerDeckElement.innerHTML = "<div class='card red'>PLAYER LOSES</div>";
    console.log("PLAYER LOSES");
    document.getElementById("play-button").disabled = true;
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
  }

  if (compareCardsValues(pcCard, playerCard) === 1) {
    pcCardElement.classList.add("outline-win");
    playerCardElement.classList.add("outline-lost");
    PC_DECK.unshift(playerCard);
    PC_DECK.unshift(pcCard);
    console.log("PC WINS");
    WINS[0]++;
    updateScoreboard();
    return;
  }

  if (compareCardsValues(pcCard, playerCard) === -1) {
    pcCardElement.classList.add("outline-lost");
    playerCardElement.classList.add("outline-win");

    PLAYER_DECK.unshift(pcCard);
    PLAYER_DECK.unshift(playerCard);
    console.log("PLAYER WINS");
    WINS[1]++;
    updateScoreboard();
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

  for (let i = 0; i < 26; i++) {
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
  const cardHtml = `
      <div class="card">
      </div>
    `;
  return cardHtml;
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
          <!-- <p class="small-letter-suit">${text}</p> -->
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

/* ************************************************************************** */
/* GAME INIT FUNCTION */
/* ************************************************************************** */
function initGame() {
  console.log("INIT GAME");
  const cardDeck = generateGameDeck();

  let pcCardElement = document.getElementById("current-card-pc");
  let playerCardElement = document.getElementById("current-card-player");

  let pcDeckElement = document.getElementById("current-deck-pc");
  let playerDeckElement = document.getElementById("current-deck-player");

  PC_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, 26);
  PLAYER_DECK = createPlayerDeckWithCardsFromDeck(cardDeck, 26);

  pcDeckElement.innerHTML = getBackCard(PC_DECK.length);
  playerDeckElement.innerHTML = getBackCard(PLAYER_DECK.length);

  pcCardElement.innerHTML = getBackCard();
  playerCardElement.innerHTML = getBackCard();

  // dealAnimation().then(() => {
  //   pcDeckElement.innerHTML = getBackCard(PC_DECK.length);
  //   playerDeckElement.innerHTML = getBackCard(PLAYER_DECK.length);
  // });
}

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
