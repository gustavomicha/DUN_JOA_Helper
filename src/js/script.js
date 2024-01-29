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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomCards(deck, count) {
    let selected = [];
    let copyOfDeck = [...deck];
    for (let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * copyOfDeck.length);
        selected.push(copyOfDeck[randomIndex]);
        copyOfDeck.splice(randomIndex, 1);
    }
    return selected;
}

function prepareDecks(encuentros, poder, obstaculos, players) {
    if (players > 2) {
        poder.push('refuerzos_(2).png');
        obstaculos.push('emboscada_(2).png');
    }
    poder.push('refuerzos_(1).png');
    obstaculos.push('ladron.png', 'emboscada_(1).png');
    shuffleArray(encuentros);
    shuffleArray(poder);
    shuffleArray(obstaculos);
}

function displayDecks(encuentros, poder, obstaculos, pv, players) {
    const deckSection = document.getElementById('deckSection');
    const encountersDeck = document.getElementById('encountersDeck').querySelector('.deck-content');
    const powerDeck = document.getElementById('powerDeck').querySelector('.deck-content');
    const obstaclesDeck = document.getElementById('obstaclesDeck').querySelector('.deck-content');

    [encountersDeck, powerDeck, obstaclesDeck].forEach(deck => deck.innerHTML = '');

    prepareDecks(encuentros, poder, obstaculos, players);

    setupDeck(encountersDeck, getRandomCards(encuentros, Math.ceil(pv / 10)), 'encuentros');
    setupDeck(powerDeck, getRandomCards(poder, players * 6), 'poder');
    setupDeck(obstaclesDeck, getRandomCards(obstaculos, players * 6), 'obstaculos');

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
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('deckSection').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';
});