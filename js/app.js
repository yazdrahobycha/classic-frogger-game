// Constants
const configuration = {
    enemy: {
        START: -100,
        END: 520,
        WIDTH: 80,
        HEIGHT: 60,
        ROW_LOCATIONS: [60, 145, 230],
    },
    player: {
        START_ROW: 400,
        START_COL: 200,
        FINISH_ROW: -25,
        STEP_X: 100,
        STEP_Y: 85,
        WIDTH: 60,
        HEIGHT: 80,
    },
    field: {
        LEFT_BORDER: 0,
        RIGHT_BORDER: 400,
        UP_BORDER: -25,
        BOTTOM_BORDER: 400,
    },
};

// Enemies our player must avoid
var Enemy = function (x, y) {
    // Variables for starter position/speed
    (this.x = x),
        (this.y = y),
        (this.speed = this.getSpeed(200, 400)),
        (this.sprite = 'images/enemy-bug.png');
};

// Get random speed
Enemy.prototype.getSpeed = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

// Update the enemy's position, loop enemy to the initial position when
// they are out of bounds, also updates and collision checks are made
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt;
    if (this.x > configuration.enemy.END) {
        this.x = configuration.enemy.START;
        this.speed = this.getSpeed(200, 700);
    }
    this.checkCollisions();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check for collision, adding width and height to the player and enemies and
// cheking for the intersection between them
Enemy.prototype.checkCollisions = function () {
    if (
        player.y < this.y + configuration.enemy.HEIGHT &&
        player.y + configuration.player.HEIGHT > this.y &&
        player.x < this.x + configuration.enemy.WIDTH &&
        player.x + configuration.player.WIDTH > this.x
    ) {
        // Restarts if collision is detected
        (player.x = configuration.player.START_COL),
        (player.y = configuration.player.START_ROW);
    }
};

// Setting initial position of a player
function Player(x, y) {
    (this.x = x), (this.y = y), (this.sprite = 'images/char-boy.png');
}

Player.prototype.update = function () {};

// Updating the player position based on a key event
const winBlock = document.querySelector('.win');
Player.prototype.handleInput = function (key) {
    if (key === 'left' && this.x > configuration.field.LEFT_BORDER) {
        this.x -= configuration.player.STEP_X;
    } else if (key === 'right' && this.x < configuration.field.RIGHT_BORDER) {
        this.x += configuration.player.STEP_X;
    } else if (key === 'up' && this.y > configuration.field.UP_BORDER) {
        this.y -= configuration.player.STEP_Y;
        // if, after going up and updating y-position accordingly
        // the y-position is a position of a last tile, ending the game
        // by displaying the 'win' message, and, after 1500ms reseting players's position
        // and removing the message
        if (this.y === configuration.player.FINISH_ROW) {
            winBlock.classList.add('active');
            setTimeout(() => {
                this.x = configuration.player.START_COL;
                this.y = configuration.player.START_ROW;
                winBlock.classList.remove('active');
            }, 1500);
        }
    } else if (key === 'down' && this.y < configuration.field.BOTTOM_BORDER) {
        this.y += configuration.player.STEP_Y;
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Creating enemy and player entities, setting their
// initial positions
var allEnemies = [];
configuration.enemy.ROW_LOCATIONS.forEach((location) => {
    allEnemies.push(new Enemy(configuration.enemy.START, location));
});
const player = new Player(
    configuration.player.START_COL,
    configuration.player.START_ROW
);

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
