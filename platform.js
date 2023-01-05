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

export default Platform;