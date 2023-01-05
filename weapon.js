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

export default Weapon;