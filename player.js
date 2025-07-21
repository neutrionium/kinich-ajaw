export default class Player {
    walk_animation_timer = 50;
    walkAnimationTimer = this.walk_animation_timer;
    runImages = [];

    jump_velocity = 0;
    max_jump_velocity = 4.5;
    gravity = 0.29;
    jump_impulse = 4.3;
    maxFrameTimeDelta = 1000/60;

    constructor(ctx, width, height, jumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.jumpHeight = jumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 16 * scaleRatio;
        this.y = 82 * scaleRatio - this.height;
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "./images/ajaw_still.PNG";
        this.image = this.standingStillImage;

        this.jumpImage = new Image();
        this.jumpImage.src = "./images/ajaw_jump.PNG";

        const runImage1 = new Image();
        runImage1.src = "./images/ajaw_1.PNG";

        const runImage2 = new Image();
        runImage2.src = "./images/ajaw_2.PNG";

        this.runImages.push(runImage1);
        this.runImages.push(runImage2);

        window.removeEventListener("keydown", this.keydown);
        window.removeEventListener("keyup", this.keyup);
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);

        window.removeEventListener("touchstart", this.touchstart);
        window.removeEventListener("touchend", this.touchend);
        window.addEventListener("touchstart", this.touchstart);
        window.addEventListener("touchend", this.touchend);
    }

    touchstart = () => { this.jumpPressed = true; };
    touchend = () => { this.jumpPressed = false; };
    keydown = (event) => { if(event.code === "Space") this.jumpPressed = true; };
    keyup = (event) => { if(event.code === "Space") this.jumpPressed = false; };

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        if (this.jumpInProgress) {
        this.image = this.standingStillImage;
    }
    this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta) {
        const delta = Math.min(
            frameTimeDelta, this.maxFrameTimeDelta); 

        if (this.jumpPressed && !this.jumpInProgress && this.y >= this.yStandingPosition) {
            this.jumpInProgress = true;
            this.jump_velocity = -this.jump_impulse;
            this.image = this.jumpImage;
        }
        
        if (this.y < this.yStandingPosition || this.jump_velocity < 0) {
            this.jump_velocity += this.gravity;
            this.y += this.jump_velocity * delta * 0.1 * this.scaleRatio;
        }

            if (this.y > this.yStandingPosition) {
                this.y = this.yStandingPosition;
                this.jump_velocity = 0;
                this.jumpInProgress = false;
            }
        }

    run(gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
            if(this.image === this.runImages[0]) {
                this.image = this.runImages[1];
            } else {
            this.image = this.runImages[0];
            }
            this.walkAnimationTimer = this.walk_animation_timer;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
