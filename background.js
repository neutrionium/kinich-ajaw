export default class Background {
    constructor(ctx, width, height, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = 0;

        this.backgroundImage = new Image();
        this.backgroundImage.src = "./images/background.PNG";
        this.image = this.backgroundImage;
    }

    draw(){
        this.ctx.drawImage(this.backgroundImage, this.x, this.y, this.width, this.height);
    }
}
