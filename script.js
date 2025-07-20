import Player from "./player.js";
import Ground from "./ground.js";
import Background from "./background.js";
import Clouds from "./clouds.js";
import TreeController from "./treeController.js";
import Hearts from "./hearts.js";
import Score from "./score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game_speed_start = 0.75;
const game_speed_increment = 0.00001;

const game_width = 384;
const game_height = 97;
const player_width = 31;
const player_height = 28;
const jump_height = 62;
const ground_width = 576;
const ground_height = 97;
const ground_tree_speed = 0.20;
const background_width = 384;
const background_height = 97;
const clouds_width = 384;
const clouds_height = 97;
const clouds_speed = 0.01;
const hearts_width = 384;
const hearts_height = 97;

const tree_config = [
  { width: 11, height: 17, image: "./images/tree_1.png" },
  { width: 16, height: 26, image: "./images/tree_2.png" },
  { width: 28, height: 26, image: "./images/tree_3.png" },
  { width: 23, height: 17, image: "./images/tree_4.png" },
];

let player = null;
let ground = null;
let background = null;
let clouds = null;
let treeController = null;
let hearts = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = game_speed_start;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites(){
    const playerWidthInGame = player_width * scaleRatio;
    const playerHeightInGame = player_height * scaleRatio;
    const jumpHeightInGame = jump_height * scaleRatio;

    const groundWidthInGame = ground_width * scaleRatio;
    const groundHeightInGame = ground_height * scaleRatio;

    const backgroundWidthInGame = background_width * scaleRatio;
    const backgroundHeightInGame = background_height * scaleRatio;

    const cloudsWidthInGame = clouds_width * scaleRatio;
    const cloudsHeightInGame = clouds_height * scaleRatio;

    const heartsWidthInGame = hearts_width * scaleRatio;
    const heartsHeightInGame = hearts_height * scaleRatio;

    player = new Player (ctx, playerWidthInGame, playerHeightInGame, jumpHeightInGame, scaleRatio);
    ground = new Ground (ctx, groundWidthInGame, groundHeightInGame, ground_tree_speed, scaleRatio);
    background = new Background (ctx, backgroundWidthInGame, backgroundHeightInGame, scaleRatio);
    clouds = new Clouds (ctx, cloudsWidthInGame, cloudsHeightInGame, clouds_speed, scaleRatio);
    hearts = new Hearts (ctx, heartsWidthInGame, heartsHeightInGame, scaleRatio);

    const treeImages = tree_config.map((tree) => {
      const image = new Image();
      image.src = tree.image;
      return {
        image: image,
        width: tree.width * scaleRatio,
        height: tree.height * scaleRatio
      };
});

  treeController = new TreeController (ctx, treeImages, scaleRatio, ground_tree_speed);

  score = new Score(ctx, scaleRatio);
}


function getScaleRatio(){
  const screenHeight = Math.min(
    window.innerHeight, 
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth, 
    document.documentElement.clientWidth
  );

  if (screenWidth / screenHeight < game_width / game_height){
    if (screenWidth / screenHeight < game_width / game_height){
      return screenWidth / game_width;
    } else {
      return screenHeight / game_height;
    }
  }
}

function showGameOver() { const fontSize = Math.floor(16 * scaleRatio);
  ctx.font = `${fontSize}px 'Press Start 2P'`;
  
  ctx.fillStyle = "#4D7B7D";
  ctx.textAlign = "center";
  
  const x = canvas.width / 2;
  const y = canvas.height / 2 - 10 * scaleRatio;
  
  ctx.fillText("GAME OVER", Math.floor(x), Math.floor(y));
  
  ctx.strokeStyle = "#4E6F7A";
  ctx.lineWidth = Math.max(1, 1 * scaleRatio);
  ctx.strokeText("GAME OVER", Math.floor(x), Math.floor(y));
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  treeController.reset();
  score.reset();
  gameSpeed = game_speed_start;
}

function showStartGameText() {
  const fontSize = 9 * scaleRatio;
  ctx.font = `${fontSize}px 'Press Start 2P'`;
  ctx.fillStyle = "#4E6F7A";
  const x = canvas.width / 10.3;
  const y = canvas.height / 2.5;
  ctx.fillText("Tap Screen or Press Space To Start", x, y);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * game_speed_increment;
}

function setScreen(){
  scaleRatio = getScaleRatio();
  canvas.width = game_width * scaleRatio;
  canvas.height = game_height * scaleRatio;
  createSprites();
}

setScreen();

window.addEventListener("resize", () => setTimeout(setScreen, 500))
if(screen.orientation){
    screen.orientation.addEventListener("change",setScreen);
}

function clearScreen(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas. width, canvas.height);
}

function gameLoop(currentTime){
    if (previousTime === null) {
      previousTime = currentTime;
      requestAnimationFrame(gameLoop);
      return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    if(!gameOver && !waitingToStart) {

    ground.update(gameSpeed, frameTimeDelta);
    treeController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    clouds.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
    }

    if(!gameOver && treeController.collideWith(player)) {
      gameOver = true;
      setupGameReset();
      score.setHighScore();
    }

    background.draw();
    ground.draw();
    clouds.draw();
    treeController.draw();
    player.draw();
    hearts.draw();
    score.draw();

    if(gameOver){
      showGameOver();
    }

    if(waitingToStart){
      showStartGameText();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
