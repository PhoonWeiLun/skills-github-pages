const colors = ["red", "green", "blue", "yellow", "pink", "orange"];
let sequence = [];
let playerSequence = [];
let playing = false;
let soundEnabled = true;
let musicEnabled = true;
let speed = 600;

const statusText = document.getElementById("status");
const startBtn = document.getElementById("start-btn");
const scoreText = document.getElementById("score");
const bgMusic = document.getElementById("bg-music");

// 检查是否已添加音量控制，如果没有则添加
if (!document.getElementById("music-volume")) {
  const volumeControl = document.createElement("input");
  volumeControl.id = "music-volume";
  volumeControl.type = "range";
  volumeControl.min = "0";
  volumeControl.max = "1";
  volumeControl.step = "0.1";
  volumeControl.value = "0.5";
  volumeControl.style.display = "none";
  document.body.appendChild(volumeControl);
}

const volumeControl = document.getElementById("music-volume");

// Set initial volume
bgMusic.volume = volumeControl.value;

// Update volume when slider changes
volumeControl.addEventListener("input", (e) => {
  bgMusic.volume = e.target.value;
});

const buttons = {};
for (let color of colors) {
  buttons[color] = document.getElementById(color);
}

const buttonSound = new Audio("sound/Game.mp4");
const wrongSound = new Audio("sound/gameover.wav");

// Settings controls
document.getElementById("toggle-sound").addEventListener("change", (e) => {
  soundEnabled = e.target.checked;
});
document.getElementById("toggle-music").addEventListener("change", (e) => {
  musicEnabled = e.target.checked;
  if (musicEnabled) {
    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
  } else {
    bgMusic.pause();
  }
});
document.getElementById("difficulty").addEventListener("change", (e) => {
  speed = parseInt(e.target.value);
});
document.getElementById("toggle-bg").addEventListener("change", (e) => {
  if (e.target.checked) {
    document.body.classList.remove("no-background");
  } else {
    document.body.classList.add("no-background");
  }
});

startBtn.addEventListener("click", startGame);

for (let color of colors) {
  buttons[color].addEventListener("click", () => handleClick(color));
}

let score = 0;
function updateScore() {
  scoreText.textContent = `Score: ${score}`;
}

function startGame() {
  sequence = [];
  playerSequence = [];
  score = 0;
  updateScore();
  playing = true;
  statusText.textContent = "Watch the sequence...";
  
  if (musicEnabled) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
  }
  
  nextRound();
}

function nextRound() {
  playerSequence = [];
  const nextColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(nextColor);
  playSequence();
}

async function playSequence() {
  for (let color of sequence) {
    await highlight(color);
  }
  statusText.textContent = "Your turn!";
}

function highlight(color) {
  return new Promise((resolve) => {
    buttons[color].classList.add("active");
    setTimeout(() => {
      buttons[color].classList.remove("active");
      setTimeout(resolve, speed / 2);
    }, speed);
  });
}

function handleClick(color) {
  if (!playing) return;

  playerSequence.push(color);

  if (soundEnabled) {
    buttonSound.currentTime = 0;
    buttonSound.play();
  }

  buttons[color].classList.add("active");
  setTimeout(() => buttons[color].classList.remove("active"), 200);

  const index = playerSequence.length - 1;
  if (playerSequence[index] !== sequence[index]) {
    if (soundEnabled) {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
    statusText.textContent = "Wrong! Game over!";
    flashFailScreen();
    playing = false;
    bgMusic.pause();
    return;
  }

  if (playerSequence.length === sequence.length) {
    score++;
    updateScore();
    statusText.textContent = "Good! Next round...";
    flashAllButtons();
    setTimeout(nextRound, 1000); // 这里修复了缺少的时间参数
  }
}

function flashAllButtons() {
  for (let color of colors) {
    buttons[color].classList.add("flash-all");
  }
  setTimeout(() => {
    for (let color of colors) {
      buttons[color].classList.remove("flash-all");
    }
  }, 400);
}

function flashFailScreen() {
  const overlay = document.getElementById("fail-overlay");
  overlay.classList.add("active");
  setTimeout(() => {
    overlay.classList.remove("active");
  }, 500);
}