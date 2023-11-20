const timerText = document.querySelectorAll('[data-time]');
const startButton = document.querySelector('[data-start]');
const pauseButton = document.querySelector('[data-pause]');
const unpauseButton = document.querySelector('[data-unpause]');
const pomodoroButton = document.querySelector('[data-pomodoro]');
const intervalButton = document.querySelector('[data-interval]');
const countText = document.querySelector('[data-count-text]');

const state = {
    values: {
        pomodoroMinutes: 0,
        pomodoroSeconds: 10,
        breakTimeMinutes: 0,
        breakTimeSeconds: 10,
        pomodoroCount: 0,
        breakCount: 0,
    }
};

let intervalPomodoroId;
let intervalBreakId;

// iniciará a contagem do pomodoro
function initPomodoroCount() {
    intervalPomodoroId = setInterval(() => {
        if (state.values.pomodoroMinutes === 0 && state.values.pomodoroSeconds === 0) {
            clearInterval(intervalPomodoroId);
            state.values.pomodoroCount++;
            updateCountCicles('Pomodoro(s)', state.values.pomodoroCount);
            handleIntervalPress();
        } else if (state.values.pomodoroSeconds === 0) {
            state.values.pomodoroMinutes--;
            state.values.pomodoroSeconds = 59;
            updateTime(state.values.pomodoroMinutes, state.values.pomodoroSeconds, 'Pomodoro');
        } else {
            state.values.pomodoroSeconds--;
            updateTime(state.values.pomodoroMinutes, state.values.pomodoroSeconds, 'Pomodoro');
        }
    }, 1000);
}

// iniciará a contagem do intervalo
function initBreakCount() {
    intervalBreakId = setInterval(() => {
        if (state.values.breakTimeSeconds === 0 && state.values.breakTimeMinutes === 0) {
            clearInterval(intervalBreakId);
            state.values.breakCount++;
            updateCountCicles('Intervalo(s)', state.values.breakCount);
            handlePomodoroPress();
        } else if (state.values.breakTimeSeconds === 0) {
            state.values.breakTimeMinutes--;
            state.values.breakTimeSeconds = 59;
            updateTime(state.values.breakTimeMinutes, state.values.breakTimeSeconds, 'Intervalo');
        } else {
            state.values.breakTimeSeconds--;
            updateTime(state.values.breakTimeMinutes, state.values.breakTimeSeconds, 'Intervalo');
        }
    }, 1000);
}

function updateCountCicles(type, value) {
    countText.textContent = `${type}: ${value}`;
}

// irá atualizar o tempo de acordo com os parâmetros passados
function updateTime(minutes, seconds, titleName) {
    console.log(minutes, seconds, titleName)
    timerText[0].textContent = `${editTimeNumber(minutes)}:`;
    timerText[1].textContent = editTimeNumber(seconds);
    document.title = `${titleName}: ${editTimeNumber(minutes)}:${editTimeNumber(seconds)}`;
}

function editTimeNumber(number) {
    return number < 10 ? `0${number}` : number;
}

// reinicia todos os dados de tempo
function resetAllInfos() {
    state.values.pomodoroMinutes = 0;
    state.values.pomodoroSeconds = 10;
    state.values.breakTimeMinutes = 0;
    state.values.breakTimeSeconds = 10;
}

// muda a visualização dos botões de acordo com o tipo passado
function changeVisibilityOfButtons(type) {
    if (type === 'pause') {
        unpauseButton.style.display = 'block';
        pauseButton.style.display = 'none';
    } else if (type === 'unpause') {
        pauseButton.style.display = 'block';
        unpauseButton.style.display = 'none';
    } else {
        unpauseButton.style.display = 'none';
        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
    }
}

function initCountByType() {
    pomodoroButton.classList.contains('navigation-selected')
        ? initPomodoroCount() : initBreakCount();
}

// funções das opções de começar, pausar e despausar
function handleStartPress() {
    startButton.style.display = 'none';
    pauseButton.style.display = 'block';
    initCountByType();
}

function handleUnpausePress() {
    initCountByType();
    changeVisibilityOfButtons('unpause');
}

function handlePausePress() {
    pomodoroButton.classList.contains('navigation-selected')
        ? clearInterval(intervalPomodoroId) : clearInterval(intervalBreakId);
    changeVisibilityOfButtons('pause');
}

// funções das navegações pomodoro/intervalo
function handlePomodoroPress() {
    updateCountCicles('Pomodoro(s)', state.values.pomodoroCount);
    clearInterval(intervalBreakId);
    intervalButton.classList.remove('navigation-selected');
    pomodoroButton.classList.add('navigation-selected');
    changeVisibilityOfButtons('start');
    updateTime(state.values.pomodoroMinutes, state.values.pomodoroSeconds, 'Pomodoro');
    resetAllInfos();
}

function handleIntervalPress() {
    updateCountCicles('Intervalo(s)', state.values.breakCount);
    clearInterval(intervalPomodoroId);
    pomodoroButton.classList.remove('navigation-selected');
    intervalButton.classList.add('navigation-selected');
    changeVisibilityOfButtons('start');
    resetAllInfos();
    updateTime(state.values.breakTimeMinutes, state.values.breakTimeSeconds, 'Intervalo');
}

function init() {
    updateTime(state.values.pomodoroMinutes, state.values.pomodoroSeconds, 'Pomodoro');
}

startButton.addEventListener('click', handleStartPress);
pauseButton.addEventListener('click', handlePausePress);
unpauseButton.addEventListener('click', handleUnpausePress);
pomodoroButton.addEventListener('click', handlePomodoroPress);
intervalButton.addEventListener('click', handleIntervalPress);

init();
