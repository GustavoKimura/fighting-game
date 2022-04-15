class Sprite {
    constructor(imageSource, position, scale = 1, numberOfFrames = 1, offset = {x: 0, y: 0}) {
        this.image = new Image();
        this.image.src = imageSource;

        this.position = position;
        this.width = 50;
        this.height = 150;
        this.scale = scale;

        this.numberOfFrames = numberOfFrames;
        this.currentFrame = 0;

        this.framesElapsed = 0;
        this.framesToHold = 5;

        this.offset = offset;
    }

    draw() {
        context.drawImage(
            this.image,
            (this.image.width / this.numberOfFrames) * this.currentFrame,
            0,
            this.image.width / this.numberOfFrames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.numberOfFrames) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesToHold === 0) {
            if (this.currentFrame < this.numberOfFrames - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }

    update() {
        this.draw();

        this.animateFrames();
    }
}

class Fighter extends Sprite {
    lastKeyPressed;

    constructor(
        position,
        color = 'red',
        offset = {x: 0, y: 0},
        imageSource,
        scale = 1,
        numberOfFrames = 1,
        sprites,
        attackBox = {offset: {}, width: undefined, height: undefined}
    ) {
        super(imageSource, position, scale, numberOfFrames, offset);

        this.velocity = {x: 0, y: 0};
        this.width = 50;
        this.height = 150;

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },

            offset: attackBox.offset,

            width: attackBox.width,
            height: attackBox.height
        };

        this.color = color;
        this.isAttacking = false;
        this.health = 100;
        this.dead = false;

        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSource;
        }
    }

    update() {
        this.draw();

        if (!this.dead) {
            this.animateFrames();
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1');

        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 10;

        if (this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.attack1.image && this.currentFrame < this.sprites.attack1.numberOfFrames - 1) {
            return;
        }

        if (this.image === this.sprites.takeHit.image && this.currentFrame < this.sprites.takeHit.numberOfFrames - 1) {
            return;
        }

        if (this.image === this.sprites.death.image) {
            if (this.currentFrame === this.sprites.death.numberOfFrames - 1) {
                this.dead = true;
            }

            return;
        }

        switch (sprite) {
            case 'idle': {
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.numberOfFrames = this.sprites.idle.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }

            case 'run': {
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.numberOfFrames = this.sprites.run.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }

            case 'jump': {
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.numberOfFrames = this.sprites.jump.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }

            case 'fall': {
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.numberOfFrames = this.sprites.fall.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }

            case 'attack1': {
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.numberOfFrames = this.sprites.attack1.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }

            case 'takeHit': {
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.numberOfFrames = this.sprites.takeHit.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }

            case 'death': {
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.numberOfFrames = this.sprites.death.numberOfFrames;
                    this.currentFrame = 0;
                }

                break;
            }
        }
    }
}