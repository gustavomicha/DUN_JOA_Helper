document.getElementById('startGame').addEventListener('click', function() {
    const pvInput = document.getElementById('pv');
    const playersInput = document.getElementById('players');

    const pv = parseInt(pvInput.value, 10);
    const players = parseInt(playersInput.value, 10);

    if (isNaN(pv) || pv < 0 || pv > 1000) {
        alert("Por favor ingrese un valor de PV válido (0-1000).");
        pvInput.focus();
        return;
    }

    if (isNaN(players) || players < 1 || players > 5) {
        alert("Por favor ingrese un número válido de héroes (1-5).");
        playersInput.focus();
        return;
    }

    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('infoButton').style.display = 'none';

    displayDecks(encuentrosCards, poderCards, obstaculosCards, pv, players);
    document.getElementById('returnButton').style.display = 'block';

});

document.addEventListener('DOMContentLoaded', function() {
    populateObstaculosModal();

    // Event listener for Select All button
    document.getElementById('selectAll').addEventListener('click', function() {
        document.querySelectorAll('#obstaculosChoices input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    });

    // Event listener for Unselect All button
    document.getElementById('unselectAll').addEventListener('click', function() {
        document.querySelectorAll('#obstaculosChoices input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });
});


// Show the modal when the customObstacles checkbox is checked
document.getElementById('customObstacles').addEventListener('change', function() {
    const modal = document.getElementById('obstaculosModal');
    if (this.checked) {
        modal.style.display = 'block';
    }
});

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('obstaculosModal').style.display = 'none';
});

// Handle the selection of cards
document.getElementById('confirmObstaculos').addEventListener('click', function() {
    const selectedCards = [];
    document.querySelectorAll('#obstaculosChoices input[type="checkbox"]:checked').forEach(checkbox => {
        selectedCards.push(checkbox.value);
    });

    // Update the obstaculosCards array or a new array to be used in deck building
    obstaculosSelectedCards = selectedCards;

    // Close the modal
    document.getElementById('obstaculosModal').style.display = 'none';
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomCards(deck, count) {
    let selected = [];
    let copyOfDeck = [...deck];

    // Use the minimum between the count and the deck size
    let actualCount = Math.min(count, copyOfDeck.length);

    for (let i = 0; i < actualCount; i++) {
        let randomIndex = Math.floor(Math.random() * copyOfDeck.length);
        selected.push(copyOfDeck[randomIndex]);
        copyOfDeck.splice(randomIndex, 1);
    }

    return selected;
}

let obstaculosSelectedCards = []; // Global array to store user-selected cards

function displayDecks(encuentros, poder, obstaculos, pv, players) {
    const deckSection = document.getElementById('deckSection');
    const encountersDeck = document.getElementById('encountersDeck').querySelector('.deck-content');
    const powerDeck = document.getElementById('powerDeck').querySelector('.deck-content');
    const obstaclesDeck = document.getElementById('obstaclesDeck').querySelector('.deck-content');

    [encountersDeck, powerDeck, obstaclesDeck].forEach(deck => deck.innerHTML = '');

    // Select random cards first
    let randomEncuentros = getRandomCards(encuentros, Math.ceil(pv / 10));
    let randomPoder = getRandomCards(poder, players * 6);
    let randomObstaculos = getRandomCards(obstaculos, players * 6);

    // Use selected cards if any, else use all cards for obstaculos
    if (obstaculosSelectedCards.length > 0) {
        randomObstaculos = getRandomCards(obstaculosSelectedCards, players * 6);
    } else {
        randomObstaculos = getRandomCards(obstaculos, players * 6);
    }

    // Add extra cards on top of the selected random cards
    randomPoder = ['refuerzos_(1).png'].concat(randomPoder);
    randomObstaculos = ['ladron.png', 'emboscada_(1).png'].concat(randomObstaculos);
    if (players > 2) {
        randomPoder = ['refuerzos_(2).png'].concat(randomPoder);
        randomObstaculos = ['emboscada_(2).png'].concat(randomObstaculos);
    }

    // Shuffle the decks including the extra cards
    shuffleArray(randomEncuentros);
    shuffleArray(randomPoder);
    shuffleArray(randomObstaculos);

    // Setup each deck
    setupDeck(encountersDeck, randomEncuentros, 'encuentros');
    setupDeck(powerDeck, randomPoder, 'poder');
    setupDeck(obstaclesDeck, randomObstaculos, 'obstaculos');

    deckSection.style.display = 'flex';
}


function setupDeck(deckElement, selectedCards, dir) {
    const backImage = createCardImage('fondo.png', dir, true);
    deckElement.appendChild(backImage);

    let currentCardIndex = 0;

    function showNextCard() {
        if (currentCardIndex < selectedCards.length) {
            const existingCard = deckElement.querySelector('.card-img:not(.back-of-deck)');
            if (existingCard) existingCard.remove();

            const cardImage = createCardImage(selectedCards[currentCardIndex], dir, false);
            deckElement.appendChild(cardImage);
            currentCardIndex++;
            cardImage.addEventListener('click', showNextCard);
        } else {
            backImage.style.display = 'block';
        }
    }

    backImage.addEventListener('click', showNextCard);
}

function createCardImage(cardName, dir, isBack) {
    const cardImage = document.createElement('img');
    cardImage.src = isBack ? `assets/cards/${dir}/fondo.png` : `assets/cards/${dir}/${cardName}`;
    cardImage.alt = cardName;
    cardImage.classList.add('card-img');
    cardImage.classList.toggle('back-of-deck', isBack);
    return cardImage;
}

document.getElementById('returnButton').addEventListener('click', function() {
    location.reload();
});


function populateObstaculosModal() {
    const modalContent = document.getElementById('obstaculosChoices');
    obstaculosCards.forEach(card => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = card;
        checkbox.checked = true; // By default, all cards are selected
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(card.replace('.png', ''))); 
        modalContent.appendChild(label);
        modalContent.appendChild(document.createElement('br'));
    });
}

// Info Button
var infoWindow = null;

function openInfoWindow() {
    // Check if the info window is already open
    if (infoWindow && !infoWindow.closed) {
        infoWindow.focus(); // If open, focus on the existing window
    } else {
        // If not open, open a new window with the specified text
        infoWindow = window.open('src/html/info.html', '_blank', 'width=400,height=200');
    }
}