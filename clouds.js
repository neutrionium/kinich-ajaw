export default class Clouds {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = 0;

        this.cloudsImage = new Image();
        this.cloudsImage.src = "images/clouds.png";
        this.image = this.cloudsImage;
    }

    update(gameSpeed, frameTimeDelta){
       this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio; 
    }

    draw(){
        this.ctx.drawImage(this.cloudsImage, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.cloudsImage, this.x + this.width, this.y, this.width, this.height);

        if(this.x < -this.width){
            this.x = 0;
        }
    }
}