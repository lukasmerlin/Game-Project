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

export default Projectile;