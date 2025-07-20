export default class Score {
  score = 0;
  high_score = "highScore";

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.high_score));
    if (this.score > highScore) {
      localStorage.setItem(this.high_score, Math.floor(this.score));
    }
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.high_score));
    const y = 15.5 * this.scaleRatio;
    const fontSize = 8 * this.scaleRatio;
    
    this.ctx.save();
    
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.font = `${fontSize}px 'Press Start 2P'`;
    this.ctx.fillStyle = "#4D7B7D";
    
    const scoreX = this.canvas.width - 114 * this.scaleRatio;
    const highScoreX = scoreX - 80 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, "0");
    const highScorePadded = highScore.toString().padStart(6, "0");

    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
    
    this.ctx.restore();
}
}
