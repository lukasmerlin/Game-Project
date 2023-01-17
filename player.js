export class Player {
    constructor(){
        this.position = {x: 100, y: 100};
        this.width = 100;
        this.height = 100;
        this.velocity = {x: 0, y: 0};
        this.fillRect = 'red';
        this.onGround = false;
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
        
    
        this.draw();
        weapons[0].draw();
    }
    
}

