"use strict";
const motiv = document.getElementById("motivation");
const tasks = document.getElementById("tasks");
const hideButton = document.getElementById("hideButton");
const percent = document.getElementById("percent");
const addButton = document.getElementById("addButton");
const dropd = document.getElementById("dropd");
const dropdownButton = document.getElementById("dropdown");
const background = document.getElementById("bg");
const bgset = document.getElementById("bgset");
const settingsMenu = document.getElementById("settingsmenu");
const form = document.getElementById("form");
const colInput = document.getElementById("colinput");
const imgInput = document.getElementById("imginput");
const chooseImg = document.getElementById("chooseImg");
const customization = document.getElementById("customizations");
const icon = hideButton.querySelector("i");
const pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true');
pressSound.volume = 0.5;
tasks.style.display = "grid";
dropd.style.display = "none";
settingsMenu.style.display = "none";
bgset.style.visibility = "hidden";
let taskCount = 0;
document.addEventListener("paste", (event) => {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData)?.getData('text/plain').slice(0, 50) || "";
    const selection = window.getSelection();
    if (selection) {
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
    }
});
function playSound() {
    pressSound.currentTime = 0;
    pressSound.play();
}
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
motiv.innerText = motivs[Math.floor(Math.random() * motivs.length)];
function setRandomBackgroundColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    document.body.style.backgroundColor = color;
    colInput.value = color;
}
setRandomBackgroundColor();
function dropdown() {
    playSound();
    if (dropd.style.display == "none") {
        dropd.style.display = "flex";
        dropdownButton.style.borderRadius = "1000rem 0 0 1000rem";
    }
    else if (dropd.style.display == "flex") {
        dropd.style.display = "none";
        dropdownButton.style.borderRadius = "1000rem";
    }
}
// async function getDatabaseTasks() {
//     const url = `http://localhost:5501/profile`;
//     const response = await fetch(url, {
//         method: 'GET',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to get tasks');
//     }
//     const data = await response.json();
//     const tasks = data.tasks;
// }
function add() {
    playSound();
    if (tasks.style.display == "none") {
        return;
    }
    if (taskCount < 6) {
        taskCount++;
        const taskDiv = document.createElement("div");
        taskDiv.id = `task${taskCount}`;
        const taskText = document.createElement("h3");
        taskText.textContent = "";
        taskText.contentEditable = "true";
        taskText.style.maxWidth = "calc(100% - 30px)";
        taskText.addEventListener('input', () => {
            const maxChars = 50;
            if (taskText.innerText.length > maxChars) {
                taskText.innerText = taskText.innerText.slice(0, maxChars);
            }
            const width = taskDiv.clientWidth;
            const textWidth = taskText.clientWidth;
            if (textWidth > width) {
                const truncatedText = taskText.innerHTML.slice(0, -1);
                taskText.textContent = truncatedText;
            }
        });
        taskText.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                // addTask(taskText.innerText)
                window.open(`http://localhost:5501/tasks/add?task_name=${taskText.innerText}&close=true`);
                event.preventDefault();
            }
        });
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            update();
            playSound();
        });
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        tasks.appendChild(taskDiv);
        setTimeout(() => {
            taskText.focus();
        });
        update();
    }
}
function hide() {
    playSound();
    if (icon) {
        icon.classList.toggle("fa-eye-slash");
        icon.classList.toggle("fa-eye");
    }
    if (tasks.style.display === "grid") {
        tasks.style.display = "none";
        percent.style.display = "none";
        addButton.style.cursor = "not-allowed";
    }
    else if (tasks.style.display === "none") {
        tasks.style.display = "grid";
        percent.style.display = "block";
        addButton.style.cursor = "pointer";
    }
}
function update() {
    const checkboxes = Array.from(tasks.querySelectorAll("input[type='checkbox']"));
    const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length;
    const percentage = (checkedCount / taskCount) * 100;
    const completionText = isNaN(percentage) ? "0%" : percentage.toFixed(0) + "%";
    percent.innerText = completionText;
}
motiv.addEventListener("keydown", (event) => {
    const maxChars = 50;
    if (motiv.innerText.length >= maxChars && event.key !== "Backspace" && !event.ctrlKey) {
        event.preventDefault();
    }
    if (event.key === "Enter" || (event.key === "Enter" && event.ctrlKey)) {
        event.preventDefault();
    }
});
function settings() {
    playSound();
    if (bgset.style.visibility == "hidden") {
        settingsMenu.style.display = "grid";
        bgset.style.visibility = "visible";
    }
    else if (bgset.style.visibility = "visible") {
        settingsMenu.style.display = "none";
        bgset.style.visibility = "hidden";
    }
}
form.addEventListener('submit', function (e) {
    e.preventDefault();
    settingsMenu.style.display = "none";
    bgset.style.visibility = "hidden";
    document.body.style.backgroundColor = colInput.value;
    if (imgInput.files[0]) {
        const file = imgInput.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const imageUrl = reader.result;
            document.body.style.backgroundImage = `url(${imageUrl})`;
        };
        reader.readAsDataURL(file);
    }
    playSound();
});
form.addEventListener('reset', function (e) {
    e.preventDefault();
    settings();
});
chooseImg.addEventListener('click', function () {
    imgInput.click();
});
