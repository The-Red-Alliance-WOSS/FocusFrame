const motiv = document.getElementById("motivation") as HTMLInputElement;
const tasks = document.getElementById("tasks") as HTMLInputElement;
const hideButton = document.getElementById("hideButton") as HTMLInputElement;
const icon = hideButton.querySelector("i");
const percent = document.getElementById("percent") as HTMLInputElement;
const addButton = document.getElementById("addButton") as HTMLInputElement;

const pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true');
pressSound.volume = 0.5;

document.addEventListener("paste", (event) => {
    event.preventDefault();
    const text = (event.clipboardData || (window as any).clipboardData)?.getData('text/plain').slice(0, 50) || "";
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

tasks.style.display = "grid";
percent.innerText = "0%";

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

motiv.innerText = motivs[Math.floor(Math.random() * motivs.length)];

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
    playSound();
}

function add() {
    playSound();
    if (taskCount < 6) {
        taskCount++;
        const taskDiv = document.createElement("div");

        const taskText = document.createElement("h3");
        taskText.textContent = "New Task";
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

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            update();
            playSound();
        });

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);

        tasks.appendChild(taskDiv);

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
        addButton.style.display = "none";
    } else if (tasks.style.display === "none") {
        tasks.style.display = "grid";
        percent.style.display = "block";
        addButton.style.display = "inline-block";
    }
}

function update() {
    const checkboxes = Array.from(tasks.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];
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