const moves = ['rock', 'paper', 'scissors'];
let history = [];
const nGramDepth = 3;

let scores = { user: 0, bot: 0 };
let isPlaying = false;

let patternTable = {};

function getBeatingMove(move) {
    if (move === 'rock') return 'paper';
    if (move === 'paper') return 'scissors';
    return 'rock';
}

function getRandomMove() {
    return moves[Math.floor(Math.random() * moves.length)];
}

function predictNextUserMove() {
    if (history.length < 1) return getRandomMove();

    for (let i = nGramDepth; i >= 1; i--) {
        if (history.length < i) continue;

        const lastSequence = history.slice(-i).join('-');

        if (patternTable[lastSequence]) {
            const nextMoveCounts = patternTable[lastSequence];

            let likelyMove = null;
            let currentMax = -1;

            for (let move of moves) {
                if (nextMoveCounts[move] > currentMax) {
                    currentMax = nextMoveCounts[move];
                    likelyMove = move;
                }
            }

            if (likelyMove) {
                document.getElementById('aiStatus').innerText = `Padrão detectado (Profundidade ${i})`;
                return likelyMove;
            }
        }
    }

    document.getElementById('aiStatus').innerText = 'Coletando dados comportamentais...';
    return getRandomMove();
}

function updatePatternTable(newMove) {
    for (let i = 1; i <= nGramDepth; i++) {
        if (history.length < i) continue;

        const sequence = history.slice(-i).join('-');

        if (!patternTable[sequence]) {
            patternTable[sequence] = { rock: 0, paper: 0, scissors: 0 };
        }
        patternTable[sequence][newMove]++;
    }
}

function play(userMove) {
    if (isPlaying) return;
    isPlaying = true;

    const resultMsg = document.getElementById('resultMsg');
    const userHand = document.getElementById('userHand');
    const botHand = document.getElementById('botHand');
    const battleArea = document.getElementById('battleArea');

    const predictedUserMove = predictNextUserMove();
    const botMove = getBeatingMove(predictedUserMove);

    userHand.className = 'hand user rock';
    botHand.className = 'hand bot rock';
    resultMsg.innerText = 'Jo... Ken... Pô!';
    resultMsg.className = 'result-msg';

    battleArea.classList.add('shaking');

    setTimeout(() => {
        battleArea.classList.remove('shaking');

        userHand.className = `hand user ${userMove}`;
        botHand.className = `hand bot ${botMove}`;

        const winner = determineWinner(userMove, botMove);

        updateScore(winner);
        displayResult(winner);

        updatePatternTable(userMove);
        history.push(userMove);

        isPlaying = false;
    }, 1500);
}

function determineWinner(u, b) {
    // Simple logic to determine winner based on classic rules
    if (u === b) return 'draw';
    if ((u === 'rock' && b === 'scissors') ||
        (u === 'paper' && b === 'rock') ||
        (u === 'scissors' && b === 'paper')) {
        return 'user';
    }
    return 'bot';
}

function updateScore(winner) {
    if (winner === 'user') scores.user++;
    if (winner === 'bot') scores.bot++;

    document.getElementById('userScore').innerText = scores.user;
    document.getElementById('botScore').innerText = scores.bot;
}

function displayResult(winner) {
    const msg = document.getElementById('resultMsg');
    if (winner === 'user') {
        msg.innerText = 'Você Venceu!';
        msg.className = 'result-msg winner-user';
    } else if (winner === 'bot') {
        msg.innerText = 'I.A. Venceu!';
        msg.className = 'result-msg winner-bot';
    } else {
        msg.innerText = 'Empate!';
        msg.className = 'result-msg winner-draw';
    }
}

function resetGame() {
    scores = { user: 0, bot: 0 };
    history = [];
    patternTable = {};
    document.getElementById('userScore').innerText = 0;
    document.getElementById('botScore').innerText = 0;
    document.getElementById('resultMsg').innerText = 'Memória Resetada';
    document.getElementById('resultMsg').className = 'result-msg';
    document.getElementById('aiStatus').innerText = 'Aguardando dados...';

    document.getElementById('userHand').className = 'hand user rock';
    document.getElementById('botHand').className = 'hand bot rock';
}

