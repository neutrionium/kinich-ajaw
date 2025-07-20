export default class Hearts {
    constructor(ctx, width, height, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = 0;

        this.heartsImage = new Image();
        this.heartsImage.src = "images/hearts.png";
        this.image = this.heartsImage;
    }

    draw(){
        this.ctx.drawImage(this.heartsImage, this.x, this.y, this.width, this.height);
    }
}