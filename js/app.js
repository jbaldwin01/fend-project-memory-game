let deck = document.querySelector(".deck");
let restart = document.querySelector(".fa-repeat");
let openCards = [];
let matchCount = 0;
let moves = 0;
let moveString = "Moves";
let modalSpan = document.querySelector(".modal");
let modalContent = document.querySelector(".modal-content");
let modalButton = document.createElement("button");
modalButton.className = "modal-button";
modalButton.textContent = "Yes";
let close = document.querySelector(".close");
let timerId = 0;
const scorePanel = document.querySelector(".score-panel");
let starList = document.querySelector(".stars");
let starHTML = `<li><i class="fa fa-star"></i></li>`;
let timerDiv = document.createElement("div");
timerDiv.className = "timer";
timerDiv.innerHTML = "00:00";
scorePanel.appendChild(timerDiv);
let totalSeconds = 0;
let starCount = 3;
const popupMessage = document.createElement("div");
let firstParagraph = document.createElement("p");
let secondParagraph = document.createElement("p");
let thirdParagraph = document.createElement("p");

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

function initGame() {
    matchCount = 0;
    moves = 0;
    starCount = 3;
    starList.innerHTML = starHTML + starHTML + starHTML;
    document.querySelector(".moves").innerHTML = `<span class="moves">${moves}</span> ${moveString}`;
    let shuffledCardList = shuffle(cardList);
    let htmlFrag = "";
    for(card of shuffledCardList) {
        htmlFrag += createCard(card);
    }

    deck.innerHTML = htmlFrag;
    createModal();
}

function createCard(card) {
    return `<li class="card"><i class="${card}"></i></li>`;
}

initGame();

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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function flipCard() {
    event.target.classList.add("open", "show");
}

function closeCards() {
    openCards[0].classList.remove("open", "show");
    openCards[1].classList.remove("open", "show");
    openCards = [];
}

function addToOpenCards() {
    openCards.push(event.target);
}

function lockOpen() {
    openCards[0].classList.remove("open", "show");
    openCards[0].classList.add("match");
    openCards[1].classList.remove("open", "show");
    openCards[1].classList.add("match");
}

function compareCards() {
    if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
        lockOpen();
        openCards = [];
        matchCount += 1;
    }
    else {
        setTimeout(closeCards, 1000);
    }
}

function updateMoveCount() {
    moves += 1; 
    moveString = moves === 1 ? "Move" : "Moves";
    document.querySelector(".moves").innerHTML = `<span class="moves">${moves}</span> ${moveString}`;
}

/*
 * Display popup when all cards are matched.
 */
function createModal() {
    firstParagraph.textContent = "Congratulations, you won!!!"
    modalContent.appendChild(firstParagraph);
    secondParagraph.innerHTML= "";
    modalContent.appendChild(secondParagraph);
    thirdParagraph.innerHTML = `Would you like to play again?`;
    modalContent.appendChild(thirdParagraph);
    modalContent.appendChild(modalButton);
}

function displayModal() {
    pluralChar = starCount > 1 ? "s" : "";
    secondParagraph.innerHTML= `Your total time was: ${timerDiv.innerHTML} and your rating was ${starCount} ${starList.firstElementChild.innerHTML}${pluralChar}`;
    modalSpan.style.display = "block";
}

function startTimer() {
    return setInterval(incrementTimer, 1000);
}

function incrementTimer() {
    ++totalSeconds;
    function addZero(i) {
        return (i < 10) ? "0" + i : i;
    }
    let min = addZero(Math.floor(totalSeconds/60));
    let sec = addZero(totalSeconds - (min*60));
    timerDiv.innerHTML = `${min}:${sec}`;
}

function resetTimer(){
    clearInterval(timerId);
    totalSeconds = 0;
    timerDiv.innerHTML = "00:00";
}

function stopTimer() {
    clearInterval(timerId);
}

function decrementStars() {
    let starElement = starList.firstElementChild;
    if(starList.children.length > 1) { 
        starElement.remove()
        --starCount;
    }
}

 deck.addEventListener("click", function() {
    if (event.target.nodeName === 'LI') {
        //only continue if only 1 other card is open
        if(openCards.length <= 1) {
            //make sure same card wasn't clicked
            if(!event.target.classList.contains("open") && !event.target.classList.contains("show")) {
                updateMoveCount();
                if(moves === 1) {
                    timerId = startTimer();
                }
                let starElement = starList.firstElementChild;
                if(moves % 20 === 0 ) {
                    decrementStars();
                }
                
                flipCard();
                addToOpenCards();
                if (openCards.length === 2) {
                    compareCards();
                }
                if(matchCount === 8) {
                    //display modal
                    stopTimer();
                    matchCount = 0;
                    displayModal();
                }
            }
        }
    }
 });

 restart.addEventListener("click", function() {
     resetTimer(timerId);
     initGame();
    });

close.addEventListener("click", function() {
    modalSpan.style.display = "none";
});

modalButton.addEventListener("click", function() {
    modalSpan.style.display = "none";
    resetTimer(timerId);
    initGame();
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalSpan) {
        modalSpan.style.display = "none";
    }
}