"use strict";
const motiv = document.getElementById("motivation");
const motivs = [
    "You can do it!",
    "Don't give up!",
    "Stay positive!",
    "Make it happen!",
    "Keep the faith!",
    "Embrace the challenge!",
    "You're on the right track!",
    "You're unstoppable!",
    "You're amazing!",
    "Keep believing in yourself!",
    "You're a star!",
    "Go for it!",
    "You're a champion!",
    "Keep moving forward!",
    "You're making progress!",
    "You're getting closer!",
    "Keep your head up!",
    "You're a winner!",
    "Stay motivated!",
    "You're doing great!",
    "You're doing better than you think!",
    "You're on fire!",
    "You're unstoppable!",
];
motiv.innerHTML = motivs[Math.floor(Math.random() * motivs.length)];
function setRandomBackgroundColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    document.body.style.backgroundColor = color;
}
setRandomBackgroundColor();
function dropdown() {
}
function add() {
    const taskDiv = document.createElement("div");
    taskDiv.textContent = "New Task";
    document.getElementById("tasks").appendChild(taskDiv);
}
