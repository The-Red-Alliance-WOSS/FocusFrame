"use strict";
const motiv = document.getElementById("motivation");
const tasks = document.getElementById("tasks");
const hideButton = document.getElementById("hideButton");
const icon = hideButton.querySelector("i");
tasks.style.display = "grid";
let taskCount = 0;
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
    if (taskCount < 6) {
        taskCount++;
        const taskDiv = document.createElement("div");
        const taskText = document.createElement("h3");
        taskText.textContent = "New Task";
        taskText.contentEditable = "true"; // Make h3 element directly editable
        taskText.style.maxWidth = "calc(100% - 30px)"; // Adjust the max-width
        taskText.addEventListener('input', () => {
            const width = taskDiv.clientWidth;
            const textWidth = taskText.clientWidth;
            if (textWidth > width) {
                const truncatedText = taskText.innerHTML.slice(0, -1);
                taskText.textContent = truncatedText;
            }
        });
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        tasks.appendChild(taskDiv);
    }
}
function hide() {
    if (icon) {
        icon.classList.toggle("fa-eye-slash");
        icon.classList.toggle("fa-eye");
    }
    if (tasks.style.display == "grid") {
        tasks.style.display = "none";
    }
    else if (tasks.style.display == "none") {
        tasks.style.display = "grid";
    }
}
