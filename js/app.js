const success = document.createElement("p");
const score = document.createElement("p");
const playAgain = document.createElement("p");
const modalButton = document.createElement("button");
const close = document.querySelector(".close");
const scorePanel = document.querySelector(".score-panel");
const starList = document.querySelector(".stars");
const starHTML = `<li><i class="fa fa-star"></i></li>`;
const timerDiv = document.createElement("div");
const open = "open";
const show = "show";
const match = "match";
let deck = document.querySelector(".deck");
let movesElement = document.querySelector(".moves");
let restart = document.querySelector(".fa-repeat");
let modalSpan = document.querySelector(".modal");
let modalContent = document.querySelector(".modal-content");
let openCards = [];
let timerId = 0;
let matchCount = 0;
let moves = 0;
let totalSeconds = 0;
let starCount = 3;
const moveConst = "Moves";

/*
 * Create a list that holds all of your cards
 */
let cardList = ["fa fa-diamond", "fa fa-diamond",
                "fa fa-paper-plane-o", "fa fa-paper-plane-o",
                "fa fa-anchor", "fa fa-anchor",
                "fa fa-bolt", "fa fa-bolt",
                "fa fa-cube", "fa fa-cube",
                "fa fa-leaf", "fa fa-leaf",
                "fa fa-bicycle", "fa fa-bicycle",
                "fa fa-bomb", "fa fa-bomb"];

/*
 * Load the game
 */
initGame();

/*
 * Initialize the game components.
 * Initialize variables, shuffle cards and build the card deck.
 */
function initGame() {
    openCards = [];
    matchCount = 0;
    moves = 0;
    starCount = 3;
    setupTimer();
    starList.innerHTML = `${starHTML}${starHTML}${starHTML}`;//user has 3 stars at beginning of game
    movesElement.innerHTML = `<span class="moves">${moves}</span> ${moveConst}`;
    let shuffledCardList = shuffle(cardList);
    let htmlFrag = "";
    for(card of shuffledCardList) {
        htmlFrag += createCard(card);
    }
    deck.innerHTML = htmlFrag;
    createModal();
}

/*
 * Create card html
 */
function createCard(card) {
    return `<li class="card"><i class="${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Turn the card face up
 */
function flipCard() {
    event.target.classList.add(open, show);
}

/*
 * Turn open cards face down
 */
function closeCards() {
    for(const card of openCards) {
        card.classList.remove(open, show);
    };
    openCards = [];
}

/*
 * Add card to list of open cards
 */
function addToOpenCards() {
    openCards.push(event.target);
}

/*
 * Lock matched cards face up
 */
function lockMatch() {
    for(card of openCards) {
        card.classList.remove(open, show);
        card.classList.add(match);
    }
}

/*
 * Compare the open card's icons to see if they match.  
 * If they do increment the match counter, lock them face up and remove them from the list of open cards.
 * If they don't match turn both cards face down after a one second delay.
 */
function compareCards() {
    if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
        lockMatch();
        openCards = [];
        matchCount += 1;
    }
    else {
        setTimeout(closeCards, 1000);
    }
}

/*
 * Increment the moves counter and display
 */
function updateMoveCount() {
    moves += 1; 
    let moveString = moves === 1 ? moveConst.substring(0, 4) : moveConst; // use singular or plural verbiage
    movesElement.innerHTML = `<span class="moves">${moves}</span> ${moveString}`;
}

/*
 * Initialize the modal which will be displayed when all cards are matched.
 */
function createModal() {
    success.textContent = "Congratulations, you won!!!"
    modalContent.appendChild(success);
    score.innerHTML= "";
    modalContent.appendChild(score);
    playAgain.innerHTML = `Would you like to play again?`;
    modalContent.appendChild(playAgain);
    modalButton.className = "modal-button";
    modalButton.textContent = "Yes";
    modalContent.appendChild(modalButton);
}

/*
 * Display the modal showing the elapsed time and star rating
 */
function displayModal() {
    pluralChar = starCount > 1 ? "s" : "";
    score.innerHTML= `Your total time was: ${timerDiv.innerHTML} and your rating was ${starCount} ${starList.firstElementChild.innerHTML}${pluralChar}`;
    modalSpan.style.display = "block";
}

/*
 * Setup game timer
 */
function setupTimer() {
    timerDiv.className = "timer";
    timerDiv.innerHTML = "00:00";
    scorePanel.appendChild(timerDiv);
}

/*
 * Start game timer
 */
function startTimer() {
    return setInterval(incrementTimer, 1000);
}

/*
 * Increment game timer and display as minutes and seconds
 */
function incrementTimer() {
    ++totalSeconds;
    function addZero(i) {
        return (i < 10) ? "0" + i : i;
    }
    let min = addZero(Math.floor(totalSeconds/60));
    let sec = addZero(totalSeconds - (min*60));
    timerDiv.innerHTML = `${min}:${sec}`;
}

/*
 * Reset game timer
 */
function resetTimer(){
    clearInterval(timerId);
    totalSeconds = 0;
    timerDiv.innerHTML = "00:00";
}

/*
 * Stop game timer
 */
function stopTimer() {
    clearInterval(timerId);
}

/*
 * Decrement the stars rating.
 * The lowest rating is one star.
 */
function decrementStars() {
    let starElement = starList.firstElementChild;
    if(starList.children.length > 1) { 
        starElement.remove()
        --starCount;
    }
}

/*
 * Game over
 */
function gameOver() {
    stopTimer();
    matchCount = 0;
    displayModal();
}
/*
 * Restart game
 */
function restartGame() {
    resetTimer(timerId);
    initGame();
}

/*
 * 1.  Check if a card was clicked.
 * 2.  Process click event only if 1 other card is open.
 * 3.  Check to see if same card was clicked.  If so exit.
 * 4.  Update the moves counter.
 * 5.  Start timer on first move.
 * 6.  Flip the card.
 * 7.  Add card to list of open cards.
 * 8.  If two cards are open compare them to see if they match.
 * 9.  Adjust rating based on number of moves.
 * 10. If all cards are matched end the game.
 */
function play() {
    if (event.target.nodeName === 'LI') {
        if(openCards.length <= 1) {
            if(!event.target.classList.contains(open) && !event.target.classList.contains(show) && !event.target.classList.contains(match)) {
                updateMoveCount();
                if(moves === 1) {
                    timerId = startTimer(); // start timer when first card is flipped
                }
                flipCard();
                addToOpenCards();
                if (openCards.length === 2) {
                    compareCards();
                }
                if(moves % 20 === 0 ) { // reduce star rating by one every 20 moves
                    decrementStars();
                }
                if(matchCount === 8) {
                    gameOver();
                }
            }
        }
    }
}

/*
 * Listen for clicks on the deck of cards
 */
deck.addEventListener("click", function() {
    play();
});

/*
 * Listen for clicks on the restart icon
 */
restart.addEventListener("click", function() {
    restartGame();
});

/*
 * Listen for clicks on the modal close icon
 */
close.addEventListener("click", function() {
    modalSpan.style.display = "none";
});

/*
 * Listen for clicks on the modal button
 */
modalButton.addEventListener("click", function() {
    modalSpan.style.display = "none";
    restartGame();
})

/*
 * Listen for clicks on the background modal and hide the modal.
 */
window.addEventListener("click", function() {
    if(this.event.target == modalSpan) {
        modalSpan.style.display = "none";
    }
})