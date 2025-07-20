import Tree from "./tree.js";
export default class TreeController {
    tree_interval_min = 600;
    tree_interval_max = 1500;

    nextTreeInterval = null;
    trees = [];

    constructor (ctx, treeImages, scaleRatio, speed){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.treeImages = treeImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.lastTreeTime = 0;

        this.setNextTreeTime();
    }

    setNextTreeTime(){
        const num = this.getRandomNumber(
            this.tree_interval_min, 
            this.tree_interval_max
        );

        this.nextTreeInterval = num;
    }

    createTree(){
         
       const index = this.getRandomNumber(0, this.treeImages.length -1);
       const treeImage = this.treeImages[index];
       const x = this.canvas.width * 1.5;
       const y = 82 * this.scaleRatio - treeImage.height;
       const tree = new Tree(this.ctx, x, y, treeImage.width, treeImage.height, treeImage.image);

       this.trees.push(tree);

    }

    getRandomNumber(min,max){
        return Math.floor(Math.random() * (max - min +1) + min);
    }

    update(gameSpeed, frameTimeDelta) {
    this.lastTreeTime += frameTimeDelta;
    
    if (this.lastTreeTime >= this.nextTreeInterval) {
        this.createTree();
        this.setNextTreeTime();
        this.lastTreeTime = 0;
    }

    this.trees.forEach((tree) => {
        tree.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.trees = this.trees.filter((tree) => {
        const isVisible = tree.x > -tree.width;
        return isVisible;
    });
}

    draw() {
        this.trees.forEach((tree) => tree.draw());
    }

    collideWith(sprite){
        return this.trees.some ((tree) => tree.collideWith(sprite));
    }

    reset() {
        this.trees = [];
    }
}