const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

const playerHealthBar = document.getElementById('playerHealthBar');
const enemyHealthBar = document.getElementById('enemyHealthBar');

const timer = document.getElementById('timer');
const displayText = document.getElementById('displayText');

let currentTimer = 60;
let currentTimerTimeoutId;
const gravity = 0.7;

const keys = {
    a: {
        pressed: false
    },

    d: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    }
};

const background = new Sprite('./img/background.png', {x: 0, y: 0});
const shop = new Sprite('./img/shop.png', {x: 628, y: 128}, 2.75, 6);

const player = new Fighter(
    {x: canvas.width / 5, y: 0},
    'red',
    {x: 215, y: 157},
    './img/samuraiMack/idle.png',
    2.5,
    8,

    {
        idle: {
            imageSource: './img/samuraiMack/Idle.png',
            numberOfFrames: 8
        },

        run: {
            imageSource: './img/samuraiMack/Run.png',
            numberOfFrames: 8
        },

        jump: {
            imageSource: './img/samuraiMack/Jump.png',
            numberOfFrames: 2
        },

        fall: {
            imageSource: './img/samuraiMack/Fall.png',
            numberOfFrames: 2
        },

        attack1: {
            imageSource: './img/samuraiMack/Attack1.png',
            numberOfFrames: 6
        },

        takeHit: {
            imageSource: './img/samuraiMack/Take hit - white silhouette.png',
            numberOfFrames: 4
        },

        death: {
            imageSource: './img/samuraiMack/Death.png',
            numberOfFrames: 6
        }
    },

    {
        offset: {
            x: 100,
            y: 50
        },

        width: 150,
        height: 50
    }
);

const enemy = new Fighter(
    {x: canvas.width - (canvas.width / 3.6), y: 0},
    'blue',
    {x: 215, y: 171},
    './img/kenji/idle.png',
    2.5,
    4,

    {
        idle: {
            imageSource: './img/kenji/Idle.png',
            numberOfFrames: 4
        },

        run: {
            imageSource: './img/kenji/Run.png',
            numberOfFrames: 8
        },

        jump: {
            imageSource: './img/kenji/Jump.png',
            numberOfFrames: 2
        },

        fall: {
            imageSource: './img/kenji/Fall.png',
            numberOfFrames: 2
        },

        attack1: {
            imageSource: './img/kenji/Attack1.png',
            numberOfFrames: 4
        },

        takeHit: {
            imageSource: './img/kenji/Take hit.png',
            numberOfFrames: 3
        },

        death: {
            imageSource: './img/kenji/Death.png',
            numberOfFrames: 7
        }
    },

    {
        offset: {
            x: -165,
            y: 50
        },

        width: 165,
        height: 50
    }
);

function animate() {
    window.requestAnimationFrame(animate);

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    // Player Movement
    player.velocity.x = 0;

    if (keys.a.pressed && player.lastKeyPressed === 'a') {
        player.velocity.x = -5;

        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKeyPressed === 'd') {
        player.velocity.x = 5;

        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Enemy Movement
    enemy.velocity.x = 0;

    if (keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
        enemy.velocity.x = -5;

        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
        enemy.velocity.x = 5;

        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Detect for Player Collision
    if (rectangularCollision(player, enemy) && player.isAttacking && player.currentFrame === 4) {
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealthBar', {
            width: `${enemy.health}%`
        });
    }

    if (player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false;
    }

    // Detect for Enemy Collision
    if (rectangularCollision(enemy, player) && enemy.isAttacking && enemy.currentFrame === 2) {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealthBar', {
            width: `${player.health}%`
        });
    }

    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false;
    }

    // End Game Based on Health
    if (player.health <= 0 || enemy.health <= 0) {
        displayText.style.display = 'flex';

        determineWinner(player, enemy, currentTimerTimeoutId);
    }
}

animate();
decreaseCurrentTimer();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            // Player Keys
            case 'a': {
                keys.a.pressed = true;
                player.lastKeyPressed = 'a';

                break;
            }

            case 'd': {
                keys.d.pressed = true;
                player.lastKeyPressed = 'd';

                break;
            }

            case 'w': {
                player.velocity.y = -20;

                break;
            }

            case ' ': {
                player.attack();

                break;
            }
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            // Enemy Keys
            case 'ArrowLeft': {
                keys.ArrowLeft.pressed = true;
                enemy.lastKeyPressed = 'ArrowLeft';

                break;
            }

            case 'ArrowRight': {
                keys.ArrowRight.pressed = true;
                enemy.lastKeyPressed = 'ArrowRight';

                break;
            }

            case 'ArrowUp': {
                enemy.velocity.y = -20;

                break;
            }

            case 'ArrowDown': {
                enemy.attack();

                break;
            }
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // Player Keys
        case 'a': {
            keys.a.pressed = false;

            break;
        }

        case 'd': {
            keys.d.pressed = false;

            break;
        }

        // Enemy Keys
        case 'ArrowLeft': {
            keys.ArrowLeft.pressed = false;

            break;
        }

        case 'ArrowRight': {
            keys.ArrowRight.pressed = false;

            break;
        }
    }
});