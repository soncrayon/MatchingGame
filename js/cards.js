//GLOBAL VARIABLE DECLARATIONS
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.deck li');
const clock = document.querySelector('.clock');
const starList = Array.from(document.querySelectorAll('.ratingdiv .stars li'));
const match_pairs = 8;
let starCount = 0;
let flippedCards = [];
let moves = 0;
let matches = 0;
let clockOff = true;
let time = 0;
let minutes = 0;
let seconds = 0;
let timer;
//EVENT LISTENERS
//to execute overall game logic
deck.addEventListener('click', event => {
	const clickTarget = event.target;
	if (isClickValid(clickTarget)) {
		flipCard(clickTarget);
		addFlippedCard(clickTarget);
		if (clockOff) {
			clockOff = false;
			startClock();
		}
		if (flippedCards.length === 2) {
			addMove();
			checkforMatch(clickTarget);
			makeRating();
		}
	}
});
//to restart game using game icon
document.querySelector('.restart').addEventListener('click', () => {
	resetGame();
});
//to close the modal
document.querySelector('.modal_close').addEventListener('click', () => {
	toggleModal();
});
//to replay game via modal
document.querySelector('.playagain').addEventListener('click', () => {
	playAgain();
});
//GAME LOGIC FUNCTIONS
//reset game
function resetGame() {
	resetTimer();
	resetMoves();
	resetStars();
	shuffleDeck();
	resetCards();
};
resetGame();
//shuffle cards
function shuffle(array) {
	var currentIndex = array.length;
	var temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

function shuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffledCards = shuffle(cardsToShuffle);
	for (card of shuffledCards) {
		deck.appendChild(card);
	}
};
shuffleDeck();
//start the clock and display time
function startClock() {
	timer = setInterval(function () {
		clock.innerHTML = `${minutes}:0${seconds}`;
		seconds++;
		if (seconds >= 10) {
			clock.innerHTML = `${minutes}:${seconds}`;
		}
		if (seconds == 59) {
			minutes++;
			seconds = 0;
		}
	}, 1000);
};
//stop the clock
function stopClock() {
	if (!clockOff) {
		clockOff = true;
	}
	clearInterval(timer);
};
//function for valid click
function isClickValid(clickTarget) {
	return (clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && flippedCards.length < 2 && !flippedCards.includes(clickTarget));
};
//pushing opened cards into a list of open cards
function addFlippedCard(clickTarget) {
	flippedCards.push(clickTarget);
};
//flipping and animating the cards
function flipCard(clickTarget) {
	clickTarget.classList.toggle('open');
};

function wrongChoice(card) {
	card.classList.toggle('show');
};

function flipBack(card) {
	card.classList.toggle('open');
	card.classList.toggle('show');
};
//checking for a card match
function checkforMatch() {
	if (flippedCards[0].getAttribute('class') === flippedCards[1].getAttribute('class')) {
		flippedCards[0].classList.toggle('match');
		flippedCards[1].classList.toggle('match');
		flippedCards = [];
		matches++;
		endGame();
	} else {
		wrongChoice(flippedCards[0]);
		wrongChoice(flippedCards[1]);
		setTimeout(() => {
			flipBack(flippedCards[0]);
			flipBack(flippedCards[1]);
			flippedCards = [];
		}, 1000);
	}
};
//count number of moves made
function addMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
};
//set rating based on moves made
function hideStar() {
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
};

function makeRating() {
	if (moves === 15 || moves === 30) {
		hideStar();
	}
};
//toggle modal
function toggleModal() {
	const modal = document.querySelector('.modal_background');
	modal.classList.toggle('hide');
};
//add game stats to modal
function populateModalStats() {
	const timeStat = document.querySelector('.modal_time');
	const clockTime = document.querySelector('.clock').innerHTML;
	timeStat.innerHTML = `Time: ${clockTime}`;
	const movesStat = document.querySelector('.modal_moves');
	const movesMade = document.querySelector('.moves').innerHTML;
	movesStat.innerHTML = `Moves: ${movesMade}`;
	const ratingStat = document.querySelector('.modal_rating');
	const rating = getStars();
	ratingStat.innerHTML = `Rating: ${rating}`;
};
//get star count to add to game stats in modal
function getStars() {
	for (star of starList) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	return starCount;
};
//end game after win and call modal
function endGame() {
	if (matches == match_pairs) {
		gameOver();
	}
};

function gameOver() {
	stopClock();
	setTimeout(populateModalStats, 100);
	setTimeout(toggleModal, 300);
	matches = 0;
};
//to replay by hitting replay button in modal
function playAgain() {
	resetGame();
	toggleModal();
};
//reset timer
function resetTimer() {
	stopClock();
	timer = document.querySelector('.clock');
	clock.innerHTML = "0:00";
	time = 0;
	minutes = 0;
	seconds = 0;
};
//reset moves
function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
};
//reset stars
function resetStars() {
	for (star of starList) {
		if (star.style.display === 'none') {
			star.style.display = 'inline-block';
			break;
		}
	}
	starCount = 0;
};
//reset cards
function resetCards() {
	for (card of cards) {
		if (card.getAttribute('class').includes('open')) {
			card.classList.remove('open');
			card.classList.remove('show');
			card.classList.remove('match');
		}
	}
};
