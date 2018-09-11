let deck = document.querySelector(".deck");
let restart = document.querySelector(".fa-repeat");
let openCards = [];
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
    let shuffledCardList = shuffle(cardList);
    //const fragment = document.createDocumentFragment();
    let htmlFrag = "";
    for(card of shuffledCardList) {
        htmlFrag += createCard(card);

        //fragment.appendChild(cardHTML);
    }

    deck.innerHTML = htmlFrag;
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

function addOpenCard() {
    openCards.push(event.target);
}

function lockOpen() {
    openCards[0].classList.remove("open", "show");
    openCards[0].classList.add("match");
    openCards[1].classList.remove("open", "show");
    openCards[1].classList.add("match");
}

function checkMatch() {
    if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
        lockOpen();
        openCards = [];
    }
    else {
        console.log("not a match");//flipCardBack();//classList.toggle("open", "show");
        openCards[0].classList.remove("open", "show");
        openCards[1].classList.remove("open", "show");
        openCards = [];
    }
}

 deck.addEventListener("click", function() {
     flipCard();
     addOpenCard();
     if (openCards.length > 1) {
        checkMatch();
     }
 });

 restart.addEventListener("click", initGame);