const canvas = document.querySelector('#game');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;

class Player {
    constructor(){
        this.position = {x: 100, y: 100};
        this.width = 30;
        this.height = 30;
        this.velocity = {x: 0, y: 0};
    }
    

    draw(){
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    
        // Update weapon position to match player position
        weapons[0].position.x = this.position.x;
        weapons[0].position.y = this.position.y;
    
        // Check for collision with floor
        if (this.position.y + this.height >= floor.position.y) {
            this.position.y = floor.position.y - this.height;
            this.velocity.y = 0;
        }
    
        this.draw();
        weapons[0].draw();
    }
    
}


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
    constructor({x, y}){
        this.position = {x, y};
        this.width = 30;
        this.height = 30;
        this.velocity = {x: 0, y: 0};
    }
    draw(){
        c.fillStyle = 'black';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    move(direction) {
        this.velocity.x = direction * 5;
    }

    update() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    
        // Check for collision with floor
        if (this.position.y + this.height >= floor.position.y) {
            this.position.y = floor.position.y - this.height;
            this.velocity.y = 0;
        }
    
        // Check for collision with edges of canvas
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
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

class Floor extends Platform {
    constructor({ y, height }) {
        super({ x: 0, y });
        this.height = height;
        this.width = canvas.width;
    }
}


const player = new Player();
const platforms = [new Platform({x:100, y:200}), new Platform({x: 500, y: 300})];
const enemies = [new enemy({x: 300, y: 400})];
const weapons = [new Weapon({x: player.position.x, y: player.position.y})];
let projectiles = [];
const floor = new Floor({ y: canvas.height - 20, height: 20 });
platforms.push(floor);


const keys = {
    right: { pressed:false},
    left: { pressed:false},
}

let scrollOffSet = 0;


function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platforms.forEach(platform => {platform.draw();})
    enemies.forEach(enemy => {enemy.update();})
    weapons.forEach(weapon => {weapon.draw();})

    // Update projectiles
    projectiles.forEach(projectile => { projectile.update(); });

    if (keys.right.pressed && player.position.x < 650) {player.velocity.x = 5;} 
    else if (keys.left.pressed && player.position.x > 100){player.velocity.x = -5;}
    else {  player.velocity.x = 0;
            if (keys.right.pressed) {platforms.forEach(platform => {platform.position.x -= 5; scrollOffSet += 5; if (scrollOffSet > 2000) {console.log('You Win')}})}
            else if (keys.left.pressed) {platforms.forEach(platform => {platform.position.x += 5; scrollOffSet -= 5;})}
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

animate();

addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: 
            console.log('left');
            keys.left.pressed = true;
        break;
        case 83:
            console.log('down');
        break;
        case 68:
            console.log('right');
            keys.right.pressed = true;
        break;
        case 87:
            console.log('up');
            player.velocity.y -= 10;
        break;
    }

});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: 
            console.log('left');
            keys.left.pressed = false;
        break;
        case 83:
            console.log('down');
        break;
        case 68:
            console.log('right');
            keys.right.pressed = false;
        break;
        case 87:
            console.log('up');
            player.velocity.y -= 10;
        break;
    }

});

let mouse = { x: 0, y: 0 };

// Update mouse position when the mouse moves
document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function shoot() {
    // Calculate the distance from the player to the mouse
    let xDist = mouse.x - player.position.x;
    let yDist = mouse.y - player.position.y;
    let distance = Math.sqrt(xDist * xDist + yDist * yDist) / 5;  // Divide by 2 to decrease distance

    // Calculate the x and y velocity required to reach the mouse
    let xVelocity = xDist / distance;
    let yVelocity = yDist / distance;

    // Create a new projectile with the calculated velocities
    let projectile = new Projectile({
        x: player.position.x,
        y: player.position.y,
        velocity: { x: xVelocity, y: yVelocity },
    });

    // Add the projectile to the list of projectiles
    projectiles.push(projectile);
}


// Add a click event listener to the canvas
canvas.addEventListener('click', shoot);


setInterval(() => {
    enemies.forEach(enemy => {
        const direction = Math.random() < 0.5 ? -1 : 1;
        enemy.move(direction);
    });
}, 1000);