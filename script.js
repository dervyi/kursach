import { Game } from './game.js';

const canvas = document.querySelector('canvas');
const game = new Game(canvas);
game.loadAssets().then(() => game.start());

function restartGame() {
// Сброс необходимых переменных или объектов
        gameState = {
        score: 0,
        lives: 3,
        level: 1,
    };

// Обновление элементов интерфейса
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;

// Перезапуск игровой логики
    startGame();
}

// Функция для старта игры
function startGame() {
    console.log('Игра началась!');
// Здесь ваша основная игровая логика
}

// Пример использования функции рестарта
document.getElementById('restartButton').addEventListener('click', restartGame);