
// Display starting screen
const startScreen = document.createElement('div');
const startScreenText = document.createElement('p');
startScreenText.style.color = "red";
startScreenText.style.fontSize = "50px";
startScreen.style.position = "absolute";
startScreen.style.top = "50%";
startScreen.style.left = "50%";
startScreen.style.transform = "translate(-50%, -50%)";
startScreenText.innerHTML = "Press Enter to start";
startScreen.appendChild(startScreenText);
document.querySelector('body').appendChild(startScreen);




// Listen for key press event
document.addEventListener("keydown", startGame);

function startGame(event) {
    // Check if key pressed is the enter key
    if (event.code === "Enter") {
        // Remove starting screen message
        document.querySelector('div').remove();
        // Remove event listener
        document.removeEventListener("keydown", startGame);
        // Start the game
        start();
    }
}

function start() {
    const canvas = document.querySelector('#game');
    const c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const gravity = 0.5;


    class Player {
        constructor(){
            this.position = {x: 100, y: 100};
            this.width = 100;
            this.height = 100;
            this.velocity = {x: 0, y: 0};
            this.fillRect = 'red';
            this.onGround = false;
            this.health = 100;
        }
        
    
        draw() {
            // Draw the player's background image
            c.fillStyle = this.fillRect;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    
        update() {
            this.velocity.y += gravity;
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
            console.log(this.velocity.x)
        
            // Update weapon position to match player position
            weapons[0].position.x = this.position.x;
            weapons[0].position.y = this.position.y;
    
                // Check for collision with platforms
            for (const platform of platforms) {
                if (this.position.x + this.width >= platform.position.x && this.position.x <= platform.position.x + platform.width) {
                    if (this.position.y + this.height >= platform.position.y && this.position.y <= platform.position.y + platform.height) {
                         // Check if player is colliding from below
                         if (this.velocity.y > 0) {
                             // Adjust player's position to be on top of platform
                             this.position.y = platform.position.y - this.height;
                             this.velocity.y = 0;
                             this.onGround = true;
                         } else {
                             // Player is jumping from below
                             // Do nothing
                         }
                    }
                 }
            }
        
            // Check for collision with floor
            if (this.position.y + this.height >= floor.position.y) {
                this.position.y = floor.position.y - this.height;
                this.velocity.y = 0;
                this.onGround = true;
            }
    
            // Check for collision with edges of canvas
            if (this.position.x <= 0) {
                this.position.x = 0;
                this.velocity.x = 0;
                }
            if (this.position.x + this.width >= canvas.width) {
                this.position.x = canvas.width - this.width;
                this.velocity.x = 0;
                console.log("moving outside the bounds")
            }
            if (this.position.y <= 0) {
                this.position.y = 0;
                this.velocity.y = 0;
            }

            for (const deathHole of deathHoles) {
                if (this.position.x + this.width > deathHole.x && this.position.x < deathHole.x + deathHole.width) {
                    if (this.position.y + this.height > deathHole.y && this.position.y < deathHole.y + deathHole.height) {
                        // Player has fallen into a death hole
                        // Trigger death event
                        this.health = 0;
                        this.velocity.y += gravity;
                        console.log("You fell into a death hole and died!");
                    }
                }
            }
            
            if (this.health <= 0) {
                // Player has died
                // Trigger game over event
                console.log("Game over!");
                //restartGame();
            }
        
            this.draw();
            weapons[0].draw();
        }
        
    }

    class DeathHole {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.fillStyle = 'black';
        }

        draw() {
            c.fillStyle = this.fillStyle;
            c.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    const deathHoles = [
        new DeathHole(700, canvas.height-25, 300, 50),
        new DeathHole(1000, canvas.height-25, 500, 50)
    ];

    
    
    
    class Platform {
        constructor({x, y}){
            this.position = {x, y};
            this.width = 200;
            this.height = 20;
        }  
        draw(){
            c.fillStyle = 'green';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        } 
    }
    
    class enemy {
        constructor({x, y, health = 100}){
            this.position = {x, y};
            this.width = 400;
            this.height = 400;
            this.velocity = {x: 0, y: 0};
            this.health = health;
        }
        
        draw(){
            c.fillStyle = 'green';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    
        move(direction) {
            this.velocity.x = direction * 5;
        }
    
        chase(player) {
            // Calculate the direction to move towards the player
            let xDiff = player.position.x - this.position.x;
            let direction = xDiff / Math.abs(xDiff);
    
            // Move the enemy towards the player on the x-axis
            this.velocity.x = direction * 5;
        }
    
        destroy() {
            enemies.splice(enemies.indexOf(this), 1);
        }
    
    
        update() {
            this.velocity.y += gravity;
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
            // this.chase(player);
        
            // Check for collision with floor
            if (this.position.y + this.height >= floor.position.y) {
                this.position.y = floor.position.y - this.height;
                this.velocity.y = 0;
            }
        
            // Check for collision with edges of canvas
            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x =- this.velocity.x;
            }
    
            // Check for collision with platforms
            for (const platform of platforms) {
                if (this.position.x + this.width >= platform.position.x && this.position.x <= platform.position.x + platform.width) {
                    if (this.position.y + this.height >= platform.position.y && this.position.y <= platform.position.y + platform.height) {
                        this.velocity.y = -this.velocity.y;
                    }
                }
            }
    
            // Check for collision with projectiles
            for (const projectile of projectiles) {
                if (this.position.x + this.width >= projectile.position.x && this.position.x <= projectile.position.x + projectile.width) {
                    if (this.position.y + this.height >= projectile.position.y && this.position.y <= projectile.position.y + projectile.height) {
                        this.health -= 10;
                        projectile.position.x = -100;
                        projectile.position.y = -100;
                    }
                }
            }
    
    
            // Check for health <= 0
            if (this.health <= 0) {
                this.destroy();
            }
        
           // this.chase(player);
            this.draw();
        }
        
    }
        
    class Weapon {
        constructor({x, y}){
            this.position = {x, y};
            this.width = 30;
            this.height = 5;
        }
        draw(){
            c.fillStyle = 'blue';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
    
    class Projectile {
        constructor({ x, y, velocity }) {
            this.position = { x, y };
            this.velocity = velocity;
            this.width = 10;
            this.height = 10;
        }
    
        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.draw();
        }
    
        draw() {
            c.fillStyle = 'brown';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
    
    class Floor extends Platform {
        constructor({ y, height }) {
            super({ x: 0, y });
            this.height = height;
            this.width = 6000;
        }
    }
    
    
    
    const keys = {
        right: { pressed:false},
        left: { pressed:false},
    }
    
   
    function animate(){
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        platforms.forEach(platform => {platform.draw();})
        enemies.forEach(enemy => {enemy.update();})
        weapons.forEach(weapon => {weapon.draw();})
        deathHoles.forEach(deathHole => {deathHole.draw();})
    
        // Update projectiles
        projectiles.forEach(projectile => { projectile.update(); });
    
        if (keys.right.pressed && player.position.x < 650) {player.velocity.x = 5;} 
        else if (keys.left.pressed && player.position.x > 100){player.velocity.x = -5;}
        else {  player.velocity.x = 0;
                if (keys.right.pressed) {platforms.forEach(platform => {platform.position.x -= 5; scrollOffSet += 5; if (scrollOffSet > 5000) {alert('You Win'); restartGame(); }}); for (const deathHole of deathHoles) {
                    deathHole.x -= 5;
                }}
            
        }
    
    // Platform collision detection
        platforms.forEach(platform => {
            if (player.position.y + player.height <= platform.position.y && 
                player.position.y + player.height + player.velocity.y >= platform.position.y && 
                player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width){
                player.velocity.y = 0;
            }
        })
    }
    

    
    function restartGame() {
        // Reset player properties
        player.position.x = 100;
        player.position.y = 100;
        player.health = 100;
        player.velocity.x = 0;
        player.velocity.y = 0;
        scrollOffSet = 0;
    
        // Remove all enemies
        enemies = [];
    
        // Spawn new enemies
        enemies.push(new enemy({x: 500, y: 200}));
        enemies.push(new enemy({x: 700, y: 150}));
    
        // Reset platforms
        platforms = [];
        platforms.push(new Platform({x: 200, y: 300}));
        platforms.push(new Platform({x: 400, y: 250}));
    }

    const player = new Player();
    const platforms = [new Platform({x:100, y:900}), new Platform({x: 500, y: 800})];
    let enemies = [new enemy({x: 1000, y: 200})];
    const weapons = [new Weapon({x: player.position.x, y: player.position.y})];
    let projectiles = [];
    const floor = new Floor({ y: canvas.height - 20, height: 20 });
    platforms.push(floor);
    let scrollOffSet = 0;
    
    animate();
    
    addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
            case 65: 
                keys.left.pressed = true;
            break;
            case 83:
            break;
            case 68:
                keys.right.pressed = true;
            break;
            case 87:
                console.log(player.onGround);
                if(player.onGround) {
                player.velocity.y = -20;
                player.onGround = false;
                }
            break;
        }
    
    });
    
    addEventListener('keyup', ({ keyCode }) => {
        switch (keyCode) {
            case 65: 
                keys.left.pressed = false;
            break;
            case 83:
            break;
            case 68:
                keys.right.pressed = false;
            break;
            case 87:
                // player.velocity.y -= 10;
            break;
        }
    
    });

    document.addEventListener("keydown", shoot);

    function shoot(event) {
    if (event.code === "Space") {
        let projectile = new Projectile({
            x: player.position.x + player.width / 2,
            y: player.position.y,
            velocity: { x: 5, y: 0 },
        });
        projectiles.push(projectile);
    }
}

    
    setInterval(() => {
        enemies.forEach(enemy => {
            const direction = Math.random() < 0.5 ? -1 : 1;
            enemy.move(direction);
        });
    }, 1000);
}