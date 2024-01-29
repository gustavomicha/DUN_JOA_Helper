document.getElementById('startGame').addEventListener('click', function() {
    // Capture user input
    const pvInput = document.getElementById('pv');
    const playersInput = document.getElementById('players');

    const pv = parseInt(pvInput.value, 10);
    const players = parseInt(playersInput.value, 10);

    // Validate input
    if (isNaN(pv) || pv < 0 || pv > 1000) {
        alert("Por favor ingrese un valor de PV válido (0-1000).");
        pvInput.focus(); // Focuses on the PV input field
        return; // Stops the function from proceeding
    }

    if (isNaN(players) || players < 1 || players > 5) {
        alert("Por favor ingrese un número válido de héroes (1-5).");
        playersInput.focus(); // Focuses on the players input field
        return; // Stops the function from proceeding
    }

    // Calculate the number of cards for each deck
    const encounterCardsCount = Math.ceil(pv / 10); // 1 card per 10 PV
    const powerCardsCount = players * 6 // 6 cards per player + refuerzos (1 or 2)
    const obstacleCardsCount = players * 6 // 6 cards per player + ladron + emboscada (1 or 2)

    // Hide main menu
    document.getElementById('mainMenu').style.display = 'none'; // Hide main menu
    document.getElementById('infoButton').style.display = 'none'; // Hide main menu


    // Use slices of the arrays based on the calculated numbers
    displayDecks(encuentrosCards.slice(0, encounterCardsCount), 
                 poderCards.slice(0, powerCardsCount), 
                 obstaculosCards.slice(0, obstacleCardsCount));
});

function loadDeckImages(deckElement, cardNames, dir, isBack = false) {
    deckElement.innerHTML = ''; // Clear existing content

    const cardImage = document.createElement('img');
    cardImage.src = isBack ? `assets/cards/${dir}/fondo.png` : `assets/cards/${dir}/${cardNames[0]}`;
    cardImage.alt = isBack ? 'Back of the deck' : cardNames[0];
    cardImage.classList.add('card-img');
    deckElement.appendChild(cardImage);

    if (!isBack) {
        cardImage.addEventListener('click', () => {
            if (cardNames.length > 1) {
                loadDeckImages(deckElement, cardNames.slice(1), dir); // Load next card
            }
        });
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function displayDecks(encuentros, poder, obstaculos) {
    const deckSection = document.getElementById('deckSection');
    const encountersDeck = document.getElementById('encountersDeck').querySelector('.deck-content');
    const powerDeck = document.getElementById('powerDeck').querySelector('.deck-content');
    const obstaclesDeck = document.getElementById('obstaclesDeck').querySelector('.deck-content');

    // Clear previous content
    [encountersDeck, powerDeck, obstaclesDeck].forEach(deck => deck.innerHTML = '');

    // Add extra cards for power deck
    poder = poder.concat(['refuerzos_(1).png']);
    if (players > 2) {
        poder = poder.concat(['refuerzos_(2).png']);
    }

    // Add extra cards for obstacles deck
    obstaculos = obstaculos.concat(['ladron.png', 'emboscada_(1).png']);
    if (players > 2) {
        obstaculos = obstaculos.concat(['emboscada_(2).png']);
    }

    // Shuffle decks
    shuffleArray(encuentros);
    shuffleArray(poder);
    shuffleArray(obstaculos);

    setupDeck(encountersDeck, encuentros, 'encuentros');
    setupDeck(powerDeck, poder, 'poder');
    setupDeck(obstaclesDeck, obstaculos, 'obstaculos');

    // Show the deck section
    deckSection.style.display = 'flex';
}

function setupDeck(deckElement, cardArray, dir) {
    // Create and append the back of the deck
    const backImage = createCardImage('fondo.png', dir, true);
    deckElement.appendChild(backImage);

    let currentCardIndex = 0; // Index to track the current card

    // Function to show the next card
    function showNextCard() {
        if (currentCardIndex < cardArray.length) {
            const cardImage = createCardImage(cardArray[currentCardIndex], dir, false);
            deckElement.appendChild(cardImage);
            cardImage.addEventListener('click', () => {
                cardImage.remove(); // Remove current card
                currentCardIndex++;
                showNextCard(); // Show next card
            });
            backImage.style.display = 'none'; // Hide the back of the deck
        }
    }

    // Add click event to backImage to show the first card
    backImage.addEventListener('click', showNextCard);
}


function createCardImage(cardName, dir, isBack) {
    const cardImage = document.createElement('img');
    cardImage.src = isBack ? `assets/cards/${dir}/fondo.png` : `assets/cards/${dir}/${cardName}`;
    cardImage.alt = isBack ? 'Back of the deck' : cardName;
    cardImage.classList.add('card-img');
    return cardImage;
}

