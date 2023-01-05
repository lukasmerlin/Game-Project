class enemy {
    constructor({x, y, health = 100}){
        this.position = {x, y};
        this.width = 100;
        this.height = 100;
        this.velocity = {x: 0, y: 0};
        this.health = health;
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
            this.position.x = -100;
            this.position.y = -100;
        }
    
        this.draw();
    }
    
}

export default enemy;