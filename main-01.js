const startScreen = document.createElement('div');
startScreen.classList.add("start-screen");
const startScreenText = document.createElement('p');
startScreenText.style.color = "red";
startScreenText.style.fontSize = "50px";
startScreen.appendChild(startScreenText);
document.querySelector('body').appendChild(startScreen);

// Add the CSS styles here
const backgroundBezel = document.createElement('div');
backgroundBezel.classList.add("background-bezel");
document.querySelector('body').appendChild(backgroundBezel);

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

    window.removeEventListener("keydown",event => {
        if (event.code === "KeyG") {
          start();
        }
      });

    class Sprite {
        constructor({position, imageSrc, width, height}) {
            this.position = position;
            this.image = new Image();
            this.image.onload = () => this.loaded = true;
            this.image.src = imageSrc;
            this.loaded = false;
            this.width = width;
            this.height = height;
        }

        draw() {
            if (!this.loaded) {console.log("no picture loaded") ; return}
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    const backgroundLevel1 = new Sprite({
        position: {x: 0, y: 0},
        imageSrc: 'img/backgroundLevel1.jpg',
        height: canvas.height,
        width: canvas.width
    });
    
    class Player extends Sprite{
        constructor({imageSrc}){
            super({imageSrc});
            this.position = {x: 100, y: 100};
            this.width = 100;
            this.height = 100;
            this.velocity = {x: 0, y: 0};
            this.fillRect = 'red';
            this.onGround = false;
            this.health = 100;
            this.imageSrc = imageSrc;
        }
        
        update() {
            //console.log(this.velocity.y);
            //console.log(this.position.y);

            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
        
            // Update weapon position to match player position
            weapons[0].position.x = this.position.x;
            weapons[0].position.y = this.position.y;
    
            platforms.forEach(platform =>{
                if (this.position.x < platform.position.x + platform.width && 
                    this.position.x + this.width > platform.position.x && 
                    this.position.y < platform.position.y + platform.height &&
                    this.position.y + this.height > platform.position.y){
                    console.log("platform collision")
                    console.log(this.velocity.y)
                        if(this.velocity.y > 0 && this.position.x + this.width > platform.position.x - 20){
                            this.position.y = platform.position.y - this.height;
                            this.velocity.y = 0;
                            this.onGround = true;
                            console.log("platform collision top")
                        }
                        else if(this.velocity.y < 0){
                            console.log("platform collision bottom")
                            this.position.y = platform.position.y + platform.height;
                            this.velocity.y = 0;
                        }
                } 
            } )     

            if (!this.onGround){
                this.velocity.y += gravity;      
            }

/*
            if (this.position.x + this.width >= platform.position.x && this.position.x <= platform.position.x + platform.width) {
                if (this.position.y + this.height >= platform.position.y && this.position.y <= platform.position.y + platform.height) {
                    // Check if player is colliding from below
                    if (this.position.y + this.height <= platform.position.y + platform.height && this.position.y + this.height >= platform.position.y  && this.velocity.y > 0 ) {
                        this.velocity.y = 0;
                        this.onGround = true;
                    }
                    // Check if player is colliding from above
                    if (this.position.y <= platform.position.y + platform.height && this.position.y >= platform.position.y && this.velocity.y < 0 ) {
                        this.velocity.y = 0;
                        this.position.y = platform.position.y + platform.height;
                    }
                    // Check if player is colliding from the side
                    if(this.position.x + this.width >= platform.position.x && this.position.x + this.width <= platform.position.x + platform.width){
                        this.velocity.x = 0;
                    }
                    if(this.position.x <= platform.position.x + platform.width && this.position.x >= platform.position.x){
                        this.velocity.x = 0;
                    }
                }
            }*/
            
                
            

            // Check for collision with enemies
            for (const enemy of enemies) {
                if (this.position.x + this.width >= enemy.position.x && this.position.x <= enemy.position.x + enemy.width) {
                    if (this.position.y + this.height >= enemy.position.y && this.position.y <= enemy.position.y + enemy.height) {
                        // Player has collided with an enemy
                        // Trigger enemy collision event
                        // can only be triggered once per enemy per second
                        if (enemy.lastCollisionTime === undefined || enemy.lastCollisionTime < Date.now() - 1000) { 
                            enemy.lastCollisionTime = Date.now();

                            // Reduce player health
                            this.health -= 10;
                            console.log("You have been hit by an enemy!");
                            // player is knocked back
                            this.position.x -= 30;
                        }
                    }
                }
            }

        
            // Check for collision with floor
            /*
            if (this.position.y + this.height >= floor.position.y && this.position.x <= floor.position.x + floor.width) {
                this.position.y = floor.position.y - this.height;
                this.velocity.y = 0;
                this.onGround = true;
            }*/

            // Check if player falls off the bottom of the screen
            if (this.position.y > canvas.height) this.health = 0;
    
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
                        //this.velocity.y += gravity;
                        console.log("You fell into a death hole and died!");
                    }
                }
            }
            
            if (this.health <= 0) {
                // Player has died
                // Trigger game over event
                console.log("Game over!");
                gameOver();
            }
        
            this.draw();
            weapons[0].draw();
        }
    }

    class levelEnd {
        constructor(x, y, width = 100, height = 200) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.fillStyle = 'blue';
        }

        draw() {
            c.fillStyle = this.fillStyle;
            c.fillRect(this.x, this.y, this.width, this.height);
        }
    }


    class DeathHole {
        constructor(x, width) {
            this.x = x;
            this.y = canvas.height-70;
            this.width = width;
            this.height = 100;
            this.fillStyle = 'black';
        }

        draw() {
            c.fillStyle = this.fillStyle;
            c.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class HealthBar {
        constructor(health){
            this.position = {x: 100, y: canvas.height/2 - 150};
            this.width = 50;
            this.height = health*3;
            this.fillStyle = 'green'; 
        }

        draw(){
            c.fillStyle = this.fillStyle;
            c.fillRect(this.position.x, this.position.y, this.width, player.health*3);
        }
    }
 
    class Platform {
        constructor({x, y}, width, height){
            this.position = {x, y};
            this.width = width;
            this.height = height;
        }  
        draw(){
            c.fillStyle = 'green';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        } 
    }
    
    class enemy {
        constructor({x, y, health = 40}){
            this.position = {x, y};
            this.width = 150;
            this.height = 150;
            this.velocity = {x: 0, y: 0};
            this.health = health;
            this.onGround = false;
            this.lastChase = Date.now();
        }
        
        draw(){
            c.fillStyle = 'red';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    
        move(direction) {
            this.velocity.x = direction * 5;
        }
    
        chase(player) {
            // Calculate the direction to move towards the player
            // Calculate the angle between the enemy and the player
            let xDiff = player.position.x - this.position.x;
            let yDiff = player.position.y - this.position.y;
            let angle = Math.atan2(yDiff, xDiff);

            // Set the velocity in the direction of the angle
            this.velocity.x = Math.cos(angle) * 10;
            this.velocity.y = Math.sin(angle) * 10;
            
    
            // Check for collision with player
            if (this.position.x + this.width >= player.position.x && this.position.x <= player.position.x + player.width) {
                this.destroy();
            }


            
        }
    
        destroy() {
            enemies.splice(enemies.indexOf(this), 1);
        }
    
    
        update() {
            // this.velocity.y += gravity;
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
            // this.chase(player);
        
        
            // Check for collision with edges of canvas
            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x =- this.velocity.x;
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
    
            if(this.position.y + this.height >= canvas.height){
                this.destroy();
            }
    
            // Check for health <= 0
            if (this.health <= 0) {
                this.destroy();
            }
        
           if(player.position.x + 1500 >= this.position.x ){
            this.chase(player);
           }

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
    
    const keys = {
        right: { pressed:false},
        left: { pressed:false},
    }

// Press G to restart the Game
    window.addEventListener("keydown", event => {
        if (event.code === "KeyG") {
            start();
        }
    });
    

    function gameOver(){
        /* player = [];  
        enemies = [];
        projectiles = [];
        platforms = [];
        weapons = []; 
        */ 

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = 'red';
        c.font = '100px Arial';
        c.fillText('GAME OVER', 100, 200);
        c.font = '50px Arial';
        c.fillText('Press G to restart', 100, 300);
    };
    

    
    function animate(){
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        backgroundLevel1.draw();
        platforms.forEach(platform => {platform.draw();});
        player.update();
        enemies.forEach(enemy => {enemy.update();});
        weapons.forEach(weapon => {weapon.draw();});
        deathHoles.forEach(deathHole => {deathHole.draw();});
        healthbar.draw();
        endLevel.draw();
    
        // Update projectiles
        projectiles.forEach(projectile => { projectile.update(); });
    
        if (keys.right.pressed && player.position.x < 650) {player.velocity.x = 5;} 
        else if (keys.left.pressed && player.position.x > 100){player.velocity.x = -5;}
        else {  player.velocity.x = 0;
                if (keys.right.pressed) {
                    for (const platform of platforms) { platform.position.x -= 5;} 
                    for (const deathHole of deathHoles) { deathHole.x -= 5;}
                    for (const enemy of enemies) { enemy.position.x -= 5;}
                }   
        }

        if(player.position.x + player.width > levelEnd.x){
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.fillStyle = 'black';
            c.fillRect(0, 0, canvas.width, canvas.height);
            c.fillStyle = 'red';
            c.font = '100px Arial';
            c.fillText('YOU WIN', 100, 200);
            c.font = '50px Arial';
            c.fillText('Press G to restart', 100, 300);
        }



    
    // Platform collision detection
 
    }

    const player = new Player({imageSrc: './img/megaman/idle-right.png' });


    const platforms = [
        new Platform({x: 0,    y: canvas.height-100}, 1000, 200 ), 
        new Platform({x: 1200, y: canvas.height-400}, 1000, 600 ),
        new Platform({x: 2500, y: canvas.height-100}, 1000, 200 ),
        new Platform({x: 3700, y: canvas.height-200}, 200, 20 ),
        new Platform({x: 4000, y: canvas.height-300}, 200, 20 ),
        new Platform({x: 4300, y: canvas.height-400}, 200, 20 ),
        new Platform({x: 4600, y: canvas.height-250}, 200, 20 ), 
        new Platform({x: 5100, y: canvas.height-100}, 500, 500 ),
        new Platform({x: 5600, y: canvas.height-200}, 100, 500 ),
        new Platform({x: 5700, y: canvas.height-300}, 100, 500),
        new Platform({x: 5800, y: canvas.height-400}, 1000, 500),
        new Platform({x: 7000, y: canvas.height-400}, 100, 20),
        new Platform({x: 7400, y: canvas.height-300}, 100, 20),
        new Platform({x: 7800, y: canvas.height-450}, 100, 20),
        new Platform({x: 8200, y: canvas.height-350}, 2000, 600),];


    let enemies = [
        new enemy({x: 1400, y: canvas.height - 700}),
        new enemy({x: 1500, y: canvas.height - 700}),
        new enemy({x: 2700, y: canvas.height - 700}),
        new enemy({x: 2800, y: canvas.height - 700}),
        new enemy({x: 2900, y: canvas.height - 700}),
        new enemy({x: 3500, y: canvas.height - 700}),
        new enemy({x: 3800, y: canvas.height - 700}),
        new enemy({x: 5100, y: canvas.height - 700}),
        new enemy({x: 5600, y: canvas.height - 700}),
        new enemy({x: 6000, y: canvas.height - 700}),
        new enemy({x: 6400, y: canvas.height - 700}),
        new enemy({x: 6800, y: canvas.height - 700}),
        new enemy({x: 7200, y: canvas.height - 700}),
    ];

    const endLevel = new levelEnd({x: 10000, y: canvas.height - 350});

    const weapons = [new Weapon({x: player.position.x, y: player.position.y})];
    let projectiles = [];
    const healthbar = new HealthBar(player.health);
    const deathHoles = [
        new DeathHole(0, 0),
    ];
   
    
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

   
    setInterval(() => {
        enemies.forEach(enemy => {
            const direction = Math.random() < 0.5 ? -1 : 1;
            enemy.move(direction);
        });
    }, 1000);
}}