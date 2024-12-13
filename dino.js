import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 0);

  document.removeEventListener("keydown", onJump);
  document.removeEventListener("touchstart", onJump);

  document.addEventListener("keydown", onJump);
  document.addEventListener("touchstart", onJump); // Add touch support for jump
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png";
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`;
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  // Set the jumping image
  dinoElem.src = "imgs/dino-jump.png";

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;

    // Revert to the running image after jump
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  if ((e.code && e.code !== "Space") || isJumping) return;

  // For touch events, prevent triggering multiple times
  if (e.type === "touchstart") {
    e.preventDefault();
  }

  yVelocity = JUMP_SPEED;
  isJumping = true;
}
