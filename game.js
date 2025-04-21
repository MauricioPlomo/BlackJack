// Representación de las cartas
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerMoney = 500; // Dinero inicial del jugador
let currentBet = 0; // Apuesta actual

// Función para crear un mazo de cartas
function createDeck() {
    deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ value: value, suit: suit }); // Crear cada carta con valor y palo
        });
    });
    shuffleDeck();
}

// Función para barajar el mazo
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Intercambiar
    }
}

// Puntuaciones
function updateScores() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    // Actualizar los elementos del DOM con las puntuaciones
    document.getElementById('player-score').innerText = playerScore;
    document.getElementById('dealer-score').innerText = dealerScore;
}

// Función para repartir una carta
function dealCard(hand) {
    const card = deck.pop(); // Tomar una carta del mazo
    hand.push(card); // Agregarla a la mano
}

// Función para mostrar las cartas en la pantalla
// filepath: c:\Users\Jorge\Desktop\Curso Crea publi pag webs 2025\CONSTRUCCION PAGINAS WEB\Proyecto BLACKJACK\game.js
function displayHand(hand, elementId) {
    const handElement = document.getElementById(elementId);

    // Encuentra o crea un contenedor específico para las cartas
    let cardsContainer = handElement.querySelector('.cards-container');
    if (!cardsContainer) {
        cardsContainer = document.createElement('div');
        cardsContainer.classList.add('cards-container');
        handElement.appendChild(cardsContainer);
    }

    // Limpia solo las cartas, no el encabezado ni otros elementos
    cardsContainer.innerHTML = '';

    // Agrega las cartas al contenedor
    hand.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('card');
        cardElement.src = `images/${card.value}_of_${card.suit}.png`; // Ruta de la imagen
        cardElement.alt = `${card.value} de ${card.suit}`;
        cardsContainer.appendChild(cardElement);

        // Agregar animación con un pequeño retraso
        setTimeout(() => {
            cardElement.classList.add('animate');
        }, index * 100); // Retraso para cada carta
    });
}

// Función para calcular el puntaje de una mano
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.value)) {
            value += 10; // Las cartas J, Q, K valen 10
        } else if (card.value === 'A') {
            aces += 1; // Contar los ases
            value += 11; // Inicialmente, los ases valen 11
        } else {
            value += parseInt(card.value); // Convertir el valor numérico
        }
    });

    // Ajustar el valor de los ases si el puntaje supera 21
    while (value > 21 && aces > 0) {
        value -= 10; // Reducir el valor del as de 11 a 1
        aces -= 1;
    }

    return value;
}

// Cuando el jugador pide una carta
document.getElementById('hit').addEventListener('click', () => {
    dealCard(playerHand); // Repartir una carta al jugador
    displayHand(playerHand, 'player-hand'); // Mostrar la mano del jugador
    updateScores(); // Actualizar puntuaciones

    const playerScore = calculateHandValue(playerHand); // Calcular el puntaje del jugador
    if (playerScore > 21) {
        // Mostrar mensaje de derrota
        showMessage('Te pasaste de 21. ¡Perdiste!', 'lose');
        
        // Deshabilitar los botones
        document.getElementById('hit').disabled = true;
        document.getElementById('stand').disabled = true;
    }
});

// Cuando el jugador se planta
document.getElementById('stand').addEventListener('click', () => {
    while (calculateHandValue(dealerHand) < 17) {
        dealCard(dealerHand);
        displayHand(dealerHand, 'dealer-hand');
        updateScores(); // Actualizar puntuaciones
    }
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
        showMessage('¡Ganaste! Apueste de nuevo para continuar', 'win');
        playerMoney += currentBet * 2; // Ganar el doble de la apuesta
    } else if (playerScore < dealerScore) {
        showMessage('¡La casa ganó! Apueste de nuevo para continuar', 'lose');
        // El jugador pierde su apuesta (ya descontada al apostar)
    } else {
        showMessage('¡Empate! Apueste de nuevo para continuar', 'tie');
        playerMoney += currentBet; // Recuperar la apuesta
    }

    currentBet = 0; // Reiniciar la apuesta
    updateBettingUI(); // Actualizar el dinero y la apuesta
    document.getElementById('hit').disabled = true; // Deshabilitar botón
    document.getElementById('stand').disabled = true; // Deshabilitar botón
});


// Función para mostrar un mensaje con formato
function showMessage(message, type) {
    const resultElement = document.getElementById('result');
    resultElement.innerText = message;

    // Eliminar clases previas
    resultElement.classList.remove('win', 'lose', 'tie');

    // Agregar la clase correspondiente solo si 'type' no está vacío
    if (type) {
        resultElement.classList.add(type);
    }
}

// Al reiniciar el juego
document.getElementById('restart').addEventListener('click', () => {
    // Devolver la apuesta al jugador
    playerMoney += currentBet;
    currentBet = 0; // Reiniciar la apuesta

    // Actualizar la interfaz
    updateBettingUI();
    showMessage('', ''); // Limpiar el mensaje
    document.getElementById('player-score').innerText = '0'; // Reiniciar puntaje del jugador
    document.getElementById('dealer-score').innerText = '0'; // Reiniciar puntaje de la casa
    document.getElementById('hit').disabled = false; // Habilitar botón
    document.getElementById('stand').disabled = false; // Habilitar botón

    // Eliminar el efecto especial de Blackjack
    const playerHandElement = document.getElementById('player-hand');
    playerHandElement.classList.remove('blackjack-effect');

    startGame(); // Reiniciar el juego
});
// Animación de las cartas
// Removed duplicate displayHand function to avoid overwriting the original one.

// Función para iniciar el juego
function startGame() {
    createDeck(); // Crear y barajar el mazo
    playerHand = [];
    dealerHand = [];
    
    // Repartir cartas iniciales
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);
    
    // Mostrar las manos iniciales
    displayHand(playerHand, 'player-hand');
    displayHand(dealerHand, 'dealer-hand');
    
    // Actualizar las puntuaciones iniciales
    updateScores();

    // Verificar si el jugador tiene Blackjack
    const playerScore = calculateHandValue(playerHand);
    if (playerScore === 21) {
        triggerBlackjackEffect(); // Activar efecto especial
    }
}

function triggerBlackjackEffect() {
    // Mostrar mensaje especial
    showMessage('¡Blackjack! ¡Eres increíble! 🎉', 'win');

    // Aplicar un efecto visual al contenedor del jugador
    const playerHandElement = document.getElementById('player-hand');
    playerHandElement.classList.add('blackjack-effect');

}

// Actualizar el dinero y la apuesta en el DOM
function updateBettingUI() {
    document.getElementById('player-money').innerText = playerMoney;
    document.getElementById('current-bet').innerText = currentBet;

    // Mostrar advertencia si no se ha realizado una apuesta
    toggleWarningMessage(currentBet === 0);

    // Habilitar los botones solo si se ha realizado una apuesta
    const buttons = document.querySelectorAll('#hit, #stand, #restart');
    if (currentBet > 0) {
        buttons.forEach(button => button.disabled = false);
    } else {
        buttons.forEach(button => button.disabled = true);
    }
}

// Manejar las apuestas
document.querySelectorAll('.bet').forEach(button => {
    button.addEventListener('click', () => {
        const amount = parseInt(button.getAttribute('data-amount'));
        if (playerMoney >= amount) {
            currentBet += amount;
            playerMoney -= amount;
            updateBettingUI();
        } else {
            alert('No tienes suficiente dinero para esta apuesta.');
        }
    });
});

// Apostar todo
document.getElementById('bet-all').addEventListener('click', () => {
    if (playerMoney > 0) {
        currentBet += playerMoney;
        playerMoney = 0;
        updateBettingUI();
    } else {
        alert('No tienes suficiente dinero para apostar todo.');
    }
});

// Mostrar u ocultar el mensaje de advertencia
function toggleWarningMessage(show) {
    const warningMessage = document.getElementById('warning-message');
    if (show) {
        warningMessage.classList.remove('hidden');
    } else {
        warningMessage.classList.add('hidden');
    }
}



// Iniciar el juego al cargar la página
window.onload = () => {
    // Ensure all required DOM elements exist
    const requiredElements = [
        'player-score', 'dealer-score', 'player-hand', 'dealer-hand',
        'hit', 'stand', 'restart', 'result', 'player-money', 'current-bet',
        'warning-message', 'bet-all'
    ];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        alert('Error: Missing required elements in the HTML. Check the console for details.');
        return;
    }

    startGame();
};

